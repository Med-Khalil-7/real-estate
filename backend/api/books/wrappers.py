from collections import OrderedDict, defaultdict
from decimal import Decimal as D

from dateutil.relativedelta import relativedelta

from core.models import Bill, Invoice
from core.utils.intervals import TimeInterval, month_interval

from .calculators import ProfitsLossCalculator


class BaseReport(object):
    title = None
    period = None

    def __init__(self, title, start, end):
        self.title = title
        self.period = TimeInterval(start, end)

    def generate(self):
        raise NotImplementedError


class TaxRateSummary(object):
    tax_rate = None
    taxable_amount = D("0")
    expenses_amount = D("0")

    @property
    def collected_taxes(self):
        return self.tax_rate.rate * self.taxable_amount

    @property
    def deductible_taxes(self):
        return self.tax_rate.rate * self.expenses_amount

    @property
    def net_amount(self):
        return self.taxable_amount - self.expenses_amount

    @property
    def net_taxes(self):
        return self.tax_rate.rate * self.net_amount


class TaxReport(BaseReport):
    # TODO implement 'Billed (Accrual) / Collected (Cash based)'
    contract = None
    tax_summaries = None

    def __init__(self, contract, start, end):
        super().__init__("Tax Report", start, end)
        self.contract = contract
        self.tax_summaries = defaultdict(TaxRateSummary)

    def generate(self):
        invoice_queryset = Invoice.objects.all()
        bill_queryset = Bill.objects.all()
        self.generate_for_sales(invoice_queryset)
        self.generate_for_sales(bill_queryset)

    def generate_for_sales(self, sales_queryset):
        calculator = ProfitsLossCalculator(
            self.contract, start=self.period.start, end=self.period.end
        )

        for output in calculator.process_generator(sales_queryset):
            summary = self.tax_summaries[output.tax_rate.pk]
            summary.tax_rate = output.tax_rate

            if isinstance(output.sale, Invoice):
                summary.taxable_amount += output.amount_excl_tax
            elif isinstance(output.sale, Bill):
                summary.expenses_amount += output.amount_excl_tax
            else:
                raise ValueError(f"Unsupported type of sale {output.sale.__class__}")


class ProfitAndLossSummary(object):
    grouping_date = None
    sales_amount = D("0")
    expenses_amount = D("0")

    @property
    def net_profit(self):
        return self.sales_amount - self.expenses_amount


class ProfitAndLossIndex(object):
    expenses_index = D("00.0")
    profit_index = D("0.00")


class ProfitAndLossUnpaid(object):
    unpaid_sales = D("0")
    unpaid_expenses = D("0")


class ProfitAndLossReport(BaseReport):
    # TODO implement 'Billed (Accrual) / Collected (Cash based)'
    contract = None
    summaries = None
    total_summary = None
    indexes = None
    total_unpaid = None

    RESOLUTION_MONTHLY = "monthly"
    RESOLUTION_CHOICES = (RESOLUTION_MONTHLY,)
    group_by_resolution = RESOLUTION_MONTHLY

    def __init__(self, start, end, contract):
        super().__init__("Profit and Loss", start, end)
        self.contract = contract
        self.summaries = {}
        # dateutil's RelativeDetla .months() gives the wrong interval if dates are greater than a year
        steps_interval = month_interval(end, start)
        assert self.group_by_resolution in self.RESOLUTION_CHOICES, "No a resolution choice"
        if self.group_by_resolution == self.RESOLUTION_MONTHLY:
            for step in range(0, steps_interval + 1):
                key_date = start + relativedelta(months=step)
                self.summaries[key_date] = ProfitAndLossSummary()
        else:
            raise ValueError(f"Unsupported resolution {self.group_by_resolution}")

        self.indexes = ProfitAndLossIndex()
        self.total_summary = ProfitAndLossSummary()
        self.total_unpaid = ProfitAndLossUnpaid()

    def group_by_date(self, date):
        if self.group_by_resolution == self.RESOLUTION_MONTHLY:
            grouping_date = date.replace(day=1)
        else:
            raise ValueError(f"Unsupported resolution {self.group_by_resolution}")
        return grouping_date

    def generate(self):
        """
        generate stats
        :return:
        :rtype:
        """
        # If no contract fetch all invoices and bills else get contract related ones
        invoice_queryset = Invoice.objects.all()
        bill_queryset = Bill.objects.all()

        self.generate_for_sales(invoice_queryset)
        self.generate_for_sales(bill_queryset)

        self.generate_unpaid(invoice_queryset)
        self.generate_unpaid(bill_queryset)
        # order the results
        self.summaries = OrderedDict(sorted(self.summaries.items()))
        # compute totals
        for summary in self.summaries.values():
            self.total_summary.sales_amount += summary.sales_amount
            self.total_summary.expenses_amount += summary.expenses_amount

        self.generate_indexes()

    def generate_indexes(self):
        """
        get the last two records and calculate the expense/income indexes
        :return:
        :rtype:
        """
        summaries_list = list(self.summaries.values())
        summaries = list(filter(None, summaries_list))
        if len(summaries) >= 2:
            profit_index = summaries[-1].net_profit - summaries[-2].net_profit
            expenses_index = summaries[-1].expenses_amount - summaries[-2].expenses_amount
            self.indexes.profit_index = profit_index
            self.indexes.expenses_index = expenses_index

    def generate_for_sales(self, sales_queryset):
        calculator = ProfitsLossCalculator(
            self.contract, start=self.period.start, end=self.period.end
        )

        for output in calculator.process_generator(sales_queryset):
            key_date = self.group_by_date(output.payment.date_paid)
            summary = self.summaries[key_date]
            if isinstance(output.sale, Invoice):
                summary.sales_amount += output.amount_excl_tax
            elif isinstance(output.sale, Bill):
                summary.expenses_amount += output.amount_excl_tax
            else:
                raise ValueError(f"Unsupported type of sale {output.sale.__class__}")

    def generate_unpaid(self, sales_queryset):
        """
        generate owed
        WARNING: THIS DOES NOT SUPPORT PARTIAL PAYMENTS
        YOU CAN ONLY BLAME YOURSELF IF YOU PLAN TO USE IT AND SUPPORT PARTIAL PAYMENTS IN THE SYSTEM
        :param sales_queryset:
        :type sales_queryset:
        :return:
        :rtype:
        """
        sales_queryset = sales_queryset.filter(
            contract=self.contract,
            date_issued__gte=self.period.start,
            date_issued__lte=self.period.end,
        )

        # optimize the queryset
        sales_queryset = sales_queryset.prefetch_related(
            "lines", "lines__tax_rate", "payments"
        ).distinct()

        for sale in sales_queryset:
            if not sale.is_fully_paid():
                # owed sale processor
                if isinstance(sale, Invoice):
                    self.total_unpaid.unpaid_sales += sale.total_incl_tax
                elif isinstance(sale, Bill):
                    self.total_unpaid.unpaid_expenses += sale.total_incl_tax
                else:
                    raise ValueError(f"Unsupported type of sale {sale.__class__}")


class InvoiceDetailsReport(BaseReport):
    contract = None
    invoices = None

    # tax_rates = None

    def __init__(self, contract, start, end):
        super().__init__("Pay Run Report", start, end)
        self.contract = contract
        # self.tax_rates = contract.invoices.tax_rates.all()

    def generate(self):
        invoice_queryset = self.contract.invoices.all()
        self.generate_for_invoices(invoice_queryset)

    def generate_for_invoices(self, invoice_queryset):
        invoice_queryset = invoice_queryset.filter(
            payments__date_paid__range=[self.period.start, self.period.end]
        )

        # optimize the query
        invoice_queryset = (
            invoice_queryset.select_related("contract")
            .prefetch_related("lines", "lines__tax_rate", "payments",)
            .distinct()
        )

        self.invoices = invoice_queryset

from datetime import date
from decimal import Decimal as D, Decimal

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models.deletion import DO_NOTHING, PROTECT

from core.managers import BillQuerySet, EstimateQuerySet, ExpenseClaimQuerySet, InvoiceQuerySet

from .abstract import Auditable, BaseContract


TWO_PLACES = D(10) ** -2


class Price(object):
    """
    Simple price class that encapsulates a price and its tax information
    Attributes:
        incl_tax (Decimal): Price including taxes
        excl_tax (Decimal): Price excluding taxes
        tax (Decimal): Tax amount
        is_tax_known (bool): Whether tax is known
        currency (str): 3 character currency code
    """

    def __init__(self, currency, excl_tax, incl_tax=None, tax=None):
        self.currency = currency
        self.excl_tax = excl_tax
        if incl_tax is not None:
            self.incl_tax = incl_tax
            self.is_tax_known = True
        elif tax is not None:
            self.incl_tax = excl_tax + tax
            self.is_tax_known = True
        else:
            self.incl_tax = None
            self.is_tax_known = False

    def _get_tax(self):
        return self.incl_tax - self.excl_tax

    def _set_tax(self, value):
        self.incl_tax = self.excl_tax + value
        self.is_tax_known = True

    tax = property(_get_tax, _set_tax)

    def __repr__(self):
        if self.is_tax_known:
            return "%s(currency=%r, excl_tax=%r, incl_tax=%r, tax=%r)" % (
                self.__class__.__name__,
                self.currency,
                self.excl_tax,
                self.incl_tax,
                self.tax,
            )
        return "%s(currency=%r, excl_tax=%r)" % (
            self.__class__.__name__,
            self.currency,
            self.excl_tax,
        )

    def __eq__(self, other):
        """
        Two price objects are equal if currency, price.excl_tax and tax match.
        """
        return (
            self.currency == other.currency
            and self.excl_tax == other.excl_tax
            and self.incl_tax == other.incl_tax
        )


class EmployeeContract(Auditable, BaseContract):
    employee = models.ForeignKey(
        "core.User", related_name="employee_contract", on_delete=DO_NOTHING
    )
    amount = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)])

    salary_payments = models.CharField(
        max_length=100,
        choices=[
            ("month", "Every Month"),
            ("2months", "Every Two Months"),
            ("3months", "Every Three Months"),
            ("6months", "Every Six Months"),
        ],
    )


class UnitContract(Auditable, BaseContract):
    @property
    def turnover_excl_tax(self):
        return self.invoices.turnover_excl_tax() or D("0.00")

    def turnover_incl_tax(self):
        return self.invoices.turnover_incl_tax() or D("0.00")

    @property
    def debts_excl_tax(self):
        return self.bills.debts_excl_tax() or D("0.00")

    @property
    def debts_incl_tax(self):
        return self.bills.debts_incl_tax() or D("0.00")

    @property
    def profits(self):
        return self.turnover_excl_tax - self.debts_excl_tax

    @property
    def collected_tax(self):
        return self.turnover_incl_tax - self.turnover_excl_tax

    @property
    def deductible_tax(self):
        return self.debts_incl_tax - self.debts_excl_tax

    @property
    def tax_provisionning(self):
        return self.collected_tax - self.deductible_tax

    @property
    def overdue_total(self):
        due_invoices = self.invoices.dued()
        due_turnonver = due_invoices.turnover_incl_tax()
        total_paid = due_invoices.total_paid()
        return due_turnonver - total_paid

    property = models.ForeignKey(
        "core.Property", related_name="property_contracts", on_delete=DO_NOTHING
    )
    is_confirmed_by_admin = models.BooleanField(default=False)
    is_confirmed_by_tenant = models.BooleanField(default=False)
    is_confirmed_by_landlord = models.BooleanField(default=False)
    tenant = models.ForeignKey("core.User", related_name="tenant_contracts", on_delete=PROTECT)
    contract_type = models.CharField(max_length=100, choices=[("RENT", "Rent"), ("BUY", "Buy")])
    location_price = models.DecimalField(
        max_digits=7, decimal_places=2, validators=[MinValueValidator(0)], default=0
    )
    deposit = models.DecimalField(
        max_digits=7, decimal_places=2, validators=[MinValueValidator(0)], default=0
    )
    tax_rate = models.ForeignKey("TaxRate", on_delete=DO_NOTHING)


class TaxRate(models.Model):
    """
    Every transaction line item needs a Tax Rate.
    Tax Rates can have multiple Tax Components.
    For instance, you can have an item that is charged a Tax Rate
    called "City Import Tax (8%)" that has two components:
        - a city tax of 5%
        - an import tax of 3%.
    *inspired by Xero*
    """

    name = models.CharField(max_length=50)
    rate = models.DecimalField(
        max_digits=6,
        decimal_places=5,
        validators=[MinValueValidator(D("0")), MaxValueValidator(D("1"))],
    )

    class Meta:
        pass

    def __str__(self):
        return f"{self.name} {int(self.rate*100)}%"


class AbstractSale(models.Model):
    number = models.IntegerField(default=1, db_index=True)

    # Total price needs to be stored with and wihtout taxes
    # because the tax percentage can vary depending on the associated lines
    total_incl_tax = models.DecimalField(
        "Total (inc. tax)", decimal_places=2, max_digits=12, default=D("0")
    )
    total_excl_tax = models.DecimalField(
        "Total (excl. tax)", decimal_places=2, max_digits=12, default=D("0")
    )

    # tracking
    date_issued = models.DateField(default=date.today)
    date_dued = models.DateField(default=date.today)
    date_paid = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    terms = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True

    class CheckingOptions:
        fields = (
            "total_incl_tax",
            "total_excl_tax",
            "date_dued",
        )

    def __str__(self):
        return "#{} ({})".format(self.number, self.total_incl_tax)

    def compute_totals(self):
        self.total_excl_tax = self.get_total_excl_tax()
        self.total_incl_tax = self.get_total_incl_tax()

    def _get_total(self, prop):
        """
        For executing a named method on each line of the basket
        and returning the total.
        """
        total = D("0.00")
        line_queryset = self.lines.all()
        for line in line_queryset:
            total = total + getattr(line, prop)
        return total

    @property
    def total_tax(self):
        return self.total_incl_tax - self.total_excl_tax

    def get_total_excl_tax(self):
        return self._get_total("line_price_excl_tax")

    def get_total_incl_tax(self):
        return self._get_total("line_price_incl_tax")

    @property
    def total_paid(self):
        total = D("0")
        for p in self.payments.all():
            total += p.amount
        return total

    @property
    def total_due_incl_tax(self):
        due = self.total_incl_tax
        due -= self.total_paid
        return due

    def is_fully_paid(self):
        paid = self.total_paid.quantize(TWO_PLACES)
        total = self.total_incl_tax.quantize(TWO_PLACES)
        return paid >= total

    def is_partially_paid(self):
        paid = self.total_paid.quantize(TWO_PLACES)
        total = self.total_incl_tax.quantize(TWO_PLACES)
        return paid and 0 < paid < total


class AbstractSaleLine(models.Model):
    label = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    unit_price_excl_tax = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.DecimalField(
        max_digits=8, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))]
    )

    class Meta:
        abstract = True

    def __str__(self):
        return self.label

    @property
    def unit_price(self):
        """Returns the `Price` instance representing the instance"""
        unit = self.unit_price_excl_tax
        tax = unit * self.tax_rate.rate
        p = Price(settings.ACCOUNTING_DEFAULT_CURRENCY, unit, tax=tax)
        return p

    @property
    def line_price_excl_tax(self):
        return self.quantity * self.unit_price.excl_tax

    @property
    def line_price_incl_tax(self):
        return self.quantity * self.unit_price.incl_tax

    @property
    def taxes(self):
        return self.line_price_incl_tax - self.line_price_excl_tax


class Estimate(AbstractSale):
    contract = models.ForeignKey(UnitContract, related_name="estimates", on_delete=DO_NOTHING)
    tenant = models.ForeignKey("User", on_delete=DO_NOTHING)

    objects = EstimateQuerySet.as_manager()

    class Meta:
        unique_together = (("number", "contract"),)
        ordering = ("-number",)

    def from_contract(self):
        return self.contract

    def to_tenant(self):
        return self.tenant


class EstimateLine(AbstractSaleLine):
    invoice = models.ForeignKey(Estimate, related_name="lines", on_delete=DO_NOTHING)
    tax_rate = models.ForeignKey(TaxRate, on_delete=DO_NOTHING)

    class Meta:
        pass


class Invoice(AbstractSale):
    contract = models.ForeignKey(UnitContract, related_name="invoices", on_delete=DO_NOTHING)
    tenant = models.ForeignKey("core.User", on_delete=DO_NOTHING)
    payments = GenericRelation("Payment")
    objects = InvoiceQuerySet.as_manager()

    class Meta:
        unique_together = (("number", "contract"),)
        ordering = ("-number",)

    def from_contract(self):
        return self.contract

    def to_tenant(self):
        return self.tenant


class InvoiceLine(AbstractSaleLine):
    invoice = models.ForeignKey(Invoice, related_name="lines", on_delete=DO_NOTHING)
    tax_rate = models.ForeignKey(TaxRate, on_delete=DO_NOTHING)

    class Meta:
        pass


class Bill(AbstractSale):
    contract = models.ForeignKey(UnitContract, related_name="bills", on_delete=DO_NOTHING)
    tenant = models.ForeignKey("core.User", on_delete=DO_NOTHING)
    payments = GenericRelation("Payment")
    objects = BillQuerySet.as_manager()

    class Meta:
        unique_together = (("number", "contract"),)
        ordering = ("-number",)

    def from_contract(self):
        return self.contract

    def to_tenant(self):
        return self.tenant


class BillLine(AbstractSaleLine):
    bill = models.ForeignKey(Bill, related_name="lines", on_delete=DO_NOTHING)
    tax_rate = models.ForeignKey(TaxRate, on_delete=DO_NOTHING)

    class Meta:
        pass


class Payment(models.Model):
    amount = models.DecimalField("Amount", decimal_places=2, max_digits=12)
    detail = models.CharField(max_length=255, blank=True, null=True)
    date_paid = models.DateField(default=date.today)
    reference = models.CharField(max_length=255, blank=True, null=True)
    # relationship to an object
    content_type = models.ForeignKey(ContentType, on_delete=DO_NOTHING)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        ordering = ("-date_paid",)

    def __str__(self):
        if self.detail:
            return self.detail
        return f"Payment of {self.abstract}"


class ExpenseClaim(AbstractSale):
    contract = models.ForeignKey(UnitContract, related_name="expense_claims", on_delete=DO_NOTHING)
    tenant = models.ForeignKey("core.User", on_delete=DO_NOTHING)
    payments = GenericRelation(Payment, on_delete=DO_NOTHING)
    objects = ExpenseClaimQuerySet.as_manager()

    class Meta:
        unique_together = (("number", "contract"),)
        ordering = ("-number",)

    def from_contract(self):
        return self.contract

    def to_tenant(self):
        return self.tenant


class ExpenseClaimLine(AbstractSaleLine):
    expense_claim = models.ForeignKey(ExpenseClaim, related_name="lines", on_delete=DO_NOTHING)
    tax_rate = models.ForeignKey("TaxRate", on_delete=DO_NOTHING)

    class Meta:
        pass

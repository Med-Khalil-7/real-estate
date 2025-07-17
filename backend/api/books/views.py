"""
bookeeping views
"""
import calendar
from datetime import datetime

from django.conf import settings

from dateutil.utils import today

from core.mixins import OptionalPaginationMixin
from core.models import Bill, Estimate, ExpenseClaim, Invoice, Payment, TaxRate, UnitContract
from core.permissions import AuthenticatedAndReadOnly
from core.utils.number_generators import (
    BillNumberGenerator,
    EstimateNumberGenerator,
    ExpenseClaimNumberGenerator,
    InvoiceNumberGenerator,
)
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import permissions, viewsets
from rest_framework.permissions import DjangoModelPermissions, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import ContractFilter
from .serializers import (
    BillSerializer,
    ContractDashboardSerializer,
    ContractInvoiceDetailSerializer,
    ContractProfitOrLossReportSerializer,
    ContractTaxReportSerializer,
    ExpenseClaimSerializer,
    InvoiceSerializer,
    PaymentWithGenericRelationSerializer,
    TaxRateSerializer,
)
from .wrappers import InvoiceDetailsReport, ProfitAndLossReport, TaxReport


class TaxRateViewSet(OptionalPaginationMixin, viewsets.ModelViewSet):
    """
    tax rate view set
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    serializer_class = TaxRateSerializer
    queryset = TaxRate.objects.all()


class BillViewSet(OptionalPaginationMixin, viewsets.ModelViewSet):
    """
    bill rate view set
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    serializer_class = BillSerializer
    queryset = Bill.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = ContractFilter

    def perform_create(self, serializer):
        """
        increment bill number
        :param serializer:
        :type serializer:
        :return:
        :rtype:
        """
        contract_id = self.request.data["contract"]
        generated_number = BillNumberGenerator().next_number(
            UnitContract.objects.get(pk=contract_id)
        )
        instance = serializer.save(number=generated_number)
        instance.compute_totals()
        instance.save()

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.compute_totals()
        instance.save()


class InvoiceViewSet(OptionalPaginationMixin, viewsets.ModelViewSet):
    """
    invoice rate view set
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    serializer_class = InvoiceSerializer
    queryset = Invoice.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = ContractFilter

    def perform_create(self, serializer):
        """
        Increment invoice number
        :param serializer:
        :type serializer:
        :return:
        :rtype:
        """
        contract_id = self.request.data["contract"]
        generated_number = InvoiceNumberGenerator().next_number(
            UnitContract.objects.get(pk=contract_id)
        )
        instance = serializer.save(number=generated_number)
        instance.compute_totals()
        print("pre_save", instance.__dict__)
        instance.save()

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.compute_totals()
        instance.save()


class ExpenseClaimViewSet(OptionalPaginationMixin, viewsets.ModelViewSet):
    """
    invoice rate view set
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    serializer_class = ExpenseClaimSerializer
    queryset = ExpenseClaim.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = ContractFilter

    def perform_create(self, serializer):
        """
        Increment invoice number
        :param serializer:
        :type serializer:
        :return:
        :rtype:
        """
        contract_id = self.request.data["contract"]
        generated_number = ExpenseClaimNumberGenerator().next_number(
            UnitContract.objects.get(pk=contract_id)
        )
        instance = serializer.save(number=generated_number)
        instance.compute_totals()
        instance.save()

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.compute_totals()
        instance.save()


class EstimateViewSet(OptionalPaginationMixin, viewsets.ModelViewSet):
    """
    estimate rate view set
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    serializer_class = InvoiceSerializer
    queryset = Estimate.objects.all()

    def perform_create(self, serializer):
        contract_id = serializer.data["contract"]
        generated_number = EstimateNumberGenerator().next_number(
            UnitContract.objects.get(pk=contract_id)
        )
        instance = serializer.save(number=generated_number)
        instance.compute_totals()
        instance.save()

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.compute_totals()
        instance.save()


class PaymentViewSet(OptionalPaginationMixin, viewsets.ModelViewSet):
    """
    payment rate view set
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    serializer_class = PaymentWithGenericRelationSerializer
    queryset = Payment.objects.all()


class PayBillView(APIView):
    """
    pay Bill
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    queryset = Payment.objects.all()

    def post(self, request, *args, **kwargs):
        """
        pay a bill
        :param request:
        :type request:
        :return:
        :rtype:
        """

        bill_id = kwargs["bill_id"]
        try:
            bill = Bill.objects.get(pk=bill_id)
            total = bill.total_incl_tax
            Payment.objects.create(content_object=bill, date_paid=today(), amount=total)
            return Response(status=200)
        except Bill.DoesNotExist:
            return Response(status=404)


class PayInvoiceView(APIView):
    """
    pay invoice
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]

    def post(self, request, *args, **kwargs):
        """
        pay an invoice
        :param request:
        :type request:
        :return:
        :rtype:
        """

        invoice_id = kwargs["invoice_id"]
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
            total = invoice.total_incl_tax
            Payment.objects.create(content_object=invoice, date_paid=today(), amount=total)
            return Response(status=200)
        except Invoice.DoesNotExist:
            return Response(status=404)


class PayExpenseClaimView(APIView):
    """
    pay expense claim
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]

    def post(self, request, *args, **kwargs):
        """
        pay an invoice
        :param request:
        :type request:
        :return:
        :rtype:
        """

        expense_claim_id = kwargs["expense_claim_id"]
        try:
            expense_claim = ExpenseClaim.objects.get(pk=expense_claim_id)
            total = expense_claim.total_incl_tax
            Payment.objects.create(content_object=expense_claim, date_paid=today(), amount=total)
            return Response(status=200)
        except ExpenseClaim.DoesNotExist:
            return Response(status=404)


class ContractDashboardView(APIView):
    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]

    def get(self, request, *args, **kwargs):
        """
        get contract dashboard
        :param request:
        :type request:
        :param args:
        :type args:
        :param kwargs:
        :type kwargs:
        :return:
        :rtype:
        """
        contract_id = kwargs["contract_id"]
        try:
            contract = UnitContract.objects.get(pk=contract_id)
            # TODO: use drf serializers instead of this
            data = {
                "invoices": (
                    contract.invoices.all()
                    .select_related("tenant", "contract")
                    .prefetch_related("lines", "lines__tax_rate", "payments")
                    .distinct()
                ),
                "bills": (
                    contract.bills.all()
                    .select_related("tenant", "contract")
                    .prefetch_related("lines", "lines__tax_rate", "payments")
                    .distinct()
                ),
            }

            serializer = ContractDashboardSerializer(data)
            return Response(status=200, data=serializer.data)
        except UnitContract.DoesNotExist:
            return Response(status=404)


class ContractTaxReportView(APIView):
    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    params = [
        openapi.Parameter("start_date", openapi.IN_QUERY, type=openapi.TYPE_STRING),
        openapi.Parameter("end_date", openapi.IN_QUERY, type=openapi.TYPE_STRING),
    ]

    @swagger_auto_schema(manual_parameters=params)
    def get(self, request, *args, **kwargs):
        """
        get contract tax report
        :param request:
        :type request:
        :param args:
        :type args:
        :param kwargs:
        :type kwargs:
        :return:
        :rtype:
        """
        try:
            contract_id = kwargs["contract_id"]
            date_format = settings.REPORT_DATE_FORMAT
            contract = UnitContract.objects.get(pk=contract_id)
            start_date = datetime.strptime(request.query_params["start_date"], date_format).date()
            end_date = datetime.strptime(request.query_params["end_date"], date_format).date()
            report = TaxReport(contract, start_date, end_date)
            report.generate()
            summaries = report.tax_summaries.values()

            serializer = ContractTaxReportSerializer(summaries, many=True)
            return Response(status=200, data=serializer.data)
        except ValueError:
            return Response(status=400, data={"detail": "Invalid request params"})
        except UnitContract.DoesNotExist:
            return Response(status=404)


class ContractProfitAndLossReportView(APIView):
    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    params = [
        # openapi.Parameter("no_of_months", openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
        openapi.Parameter("start_date", openapi.IN_QUERY, type=openapi.TYPE_STRING),
        openapi.Parameter("end_date", openapi.IN_QUERY, type=openapi.TYPE_STRING),
    ]

    @swagger_auto_schema(manual_parameters=params)
    def get(self, request, *args, **kwargs):
        """
        get profit report from the last x months
        :param request:
        :type request:
        :param args:
        :type args:
        :param kwargs:
        :type kwargs:
        :return:
        :rtype:
        """
        try:
            contract_id = kwargs["contract_id"]
            contract = UnitContract.objects.get(pk=contract_id)
            date_format = "%Y-%m"
            start = datetime.strptime(request.query_params["start_date"], date_format).date()
            end = datetime.strptime(request.query_params["end_date"], date_format).date()
            last_day_of_month = calendar.monthrange(end.year, end.month)[1]
            end = end.replace(day=last_day_of_month)
            report = ProfitAndLossReport(start, end, contract)
            report.generate()
            data = {
                "summaries": report.summaries,
                "total_summary": report.total_summary,
                "indexes": report.indexes,
                "unpaid_sales": report.total_unpaid,
            }

            serializer = ContractProfitOrLossReportSerializer(data)
            return Response(status=200, data=serializer.data)
        except ValueError:
            return Response(status=400, data={"detail": "Invalid request params"})
        except UnitContract.DoesNotExist:
            return Response(status=404)


class ContractInvoiceDetailReportView(APIView):
    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    params = [
        openapi.Parameter("start_date", openapi.IN_QUERY, type=openapi.TYPE_STRING),
        openapi.Parameter("end_date", openapi.IN_QUERY, type=openapi.TYPE_STRING),
    ]

    @swagger_auto_schema(manual_parameters=params)
    def get(self, request, *args, **kwargs):
        """
        get profit report from the last x months
        :param request:
        :type request:
        :param args:
        :type args:
        :param kwargs:
        :type kwargs:
        :return:
        :rtype:
        """
        try:
            date_format = settings.REPORT_DATE_FORMAT
            contract_id = kwargs["contract_id"]
            contract = UnitContract.objects.get(pk=contract_id)
            start_date = datetime.strptime(request.query_params["start_date"], date_format).date()
            end_date = datetime.strptime(request.query_params["end_date"], date_format).date()
            report = InvoiceDetailsReport(contract, start_date, end_date)
            report.generate()
            data = {
                "invoices": report.invoices,
                # "tax_rates": report.tax_rates,
            }
            serializer = ContractInvoiceDetailSerializer(data)
            return Response(status=200, data=serializer.data)
        except UnitContract.DoesNotExist:
            return Response(status=404)
        except ValueError:
            return Response(status=400, data={"detail": "Invalid request params"})

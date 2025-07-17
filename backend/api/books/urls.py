from django.urls import path

from rest_framework import routers

from .views import (
    BillViewSet,
    ContractDashboardView,
    ContractInvoiceDetailReportView,
    ContractProfitAndLossReportView,
    ContractTaxReportView,
    EstimateViewSet,
    ExpenseClaimViewSet,
    InvoiceViewSet,
    PayBillView,
    PayExpenseClaimView,
    PayInvoiceView,
    PaymentViewSet,
    TaxRateViewSet,
)


router = routers.DefaultRouter()

router.register(r"taxrate", TaxRateViewSet, basename="tax_rate")
router.register(r"bill", BillViewSet, basename="bill")
router.register(r"invoice", InvoiceViewSet, basename="invoice")
router.register(r"expense-claim", ExpenseClaimViewSet, basename="expense claim")
router.register(r"payment", PaymentViewSet, basename="payment")
router.register(r"estimate", EstimateViewSet, basename="estimate")

urlpatterns = [
    path("bill/<int:bill_id>/pay", PayBillView.as_view()),
    path("invoice/<int:invoice_id>/pay", PayInvoiceView.as_view()),
    path("expense_claim/<int:expense_claim_id>/pay", PayExpenseClaimView.as_view()),
    path("contract/<int:contract_id>/dashboard", ContractDashboardView.as_view()),
    path("contract/<int:contract_id>/tax_report", ContractTaxReportView.as_view()),
    path("contract/<int:contract_id>/profit_report", ContractProfitAndLossReportView.as_view()),
    path("contract/<int:contract_id>/invoices_report", ContractInvoiceDetailReportView.as_view()),
]
urlpatterns += router.urls

from django.urls import path

from rest_framework import routers

from .views import (
    EmployeeContractsViewset,
    PropertyContractsViewSet,
    SignConfirmationView,
    SignContract,
    SignValidationView,
    TerminateContract,
    bulk_email_reminder_view,
    contract_pdf_gen_view,
)


router = routers.DefaultRouter()

# apartment contracts with financials


router.register(r"property", PropertyContractsViewSet, basename="property_contracts")
router.register(r"employee", EmployeeContractsViewset, basename="employee_contracts")
router.register(r"sign_validation", SignValidationView, basename="action")

urlpatterns = [
    path("<int:contract_id>/contract_pdf", contract_pdf_gen_view),
    path("bulk_reminder_email", bulk_email_reminder_view),
    path("<int:contract_id>/sign/", SignContract.as_view()),
    path("<int:contract_id>/terminate/", TerminateContract.as_view()),
    path("<int:contract_id>/sign_request/", SignConfirmationView.as_view()),
]
urlpatterns += router.urls

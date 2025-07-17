"""
property views
"""
from django.urls import path

from rest_framework import routers

from .views import (
    PropertyBulkCreateView,
    PropertyBulkCreateWizardView,
    PropertyViewSet,
    TowerViewSet,
)


router = routers.SimpleRouter()
router.register("tower", TowerViewSet, basename="tower")
router.register("property", PropertyViewSet, basename="property")
urlpatterns = [
    path("property/bulk_create", PropertyBulkCreateView.as_view(), name="property_bulk_create"),
    path("property/wizard", PropertyBulkCreateWizardView.as_view(), name="property_wizard"),
]
urlpatterns += router.urls

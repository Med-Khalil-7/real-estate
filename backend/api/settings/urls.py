from rest_framework import routers, urlpatterns

from .views import HtmlTemplateViewSet

router = routers.DefaultRouter()

router.register(r"templates", HtmlTemplateViewSet)

urlpatterns = []

urlpatterns += router.urls
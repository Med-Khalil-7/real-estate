from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, ListModelMixin,DestroyModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import DjangoModelPermissions, IsAdminUser
from core.permissions import AuthenticatedAndReadOnly
from core.models import HtmlTemplate
from .serializers import HtmlTemplateSerializer


class HtmlTemplateViewSet(GenericViewSet, CreateModelMixin, UpdateModelMixin, ListModelMixin, RetrieveModelMixin,DestroyModelMixin):
    """Configurable contract related templates

    Args:
        GenericViewSet ([type]): [description]
        CreateModelMixin ([type]): [description]
        UpdateModelMixin ([type]): [description]
        ListModelMixin ([type]): [description]
        RetrieveModelMixin ([type]): [description]
        DestroyModelMixin ([type]): [description]
    """
    queryset = HtmlTemplate.objects.all()
    serializer_class = HtmlTemplateSerializer
    # permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    pagination_class = None

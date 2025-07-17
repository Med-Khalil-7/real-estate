"""
property views
"""
from core.mixins import OptionalPaginationMixin
from core.models import Address, Apartment, Commercial, Property, Tower, Villa
from core.permissions import AuthenticatedAndReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, views, viewsets
from rest_framework.permissions import DjangoModelPermissions, IsAdminUser
from rest_framework.response import Response

from .filters import UnitTypeFilter
from .serializers import PropertySerializerNested, PropertyWizardSerializer, TowerSerializer


class TowerViewSet(OptionalPaginationMixin, viewsets.ModelViewSet):
    """
    tower ViewSet
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    serializer_class = TowerSerializer
    queryset = Tower.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Tower.objects.all()
        else:
            return Tower.objects.filter(owner=user)

    def perform_create(self, serializer):
        # attach tower to current user
        instance = serializer.save(owner=self.request.user)
        instance.save()


class PropertyViewSet(OptionalPaginationMixin, viewsets.ModelViewSet):
    """
    property ViewSet
    """

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    serializer_class = PropertySerializerNested
    queryset = Property.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = UnitTypeFilter

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset
        if user.is_superuser:
            return qs
        elif user.is_landlord:
            return qs.filter(owner=user)
        elif user.is_tenant:
            return qs.filter(property_contracts__tenant=user)


class PropertyBulkCreateView(views.APIView):
    """
    Bulk property create
    """

    permission_classes = [IsAdminUser | DjangoModelPermissions]
    serializer_class = PropertySerializerNested

    @swagger_auto_schema(
        request_body=PropertySerializerNested(many=True),
        responses={status.HTTP_201_CREATED: PropertySerializerNested(many=True)},
    )
    def post(self, request):
        """
        bulk create
        :param request:
        :type request:
        :return:
        :rtype:
        """
        data = request.data
        serializer = PropertySerializerNested(many=True, data=data)
        serializer.is_valid(raise_exception=True)
        for _property in data:
            prop = Property()
            prop.owner_id = _property.pop("owner")
            prop.address = Address.objects.create(**_property.pop("address"))
            if "apartment" in _property:
                apartment = _property.pop("apartment")
                tower_id = apartment.pop("tower", None)
                prop.apartment = Apartment.objects.create(**apartment, tower_id=tower_id)
            if "villa" in _property:
                villa = _property.pop("villa")
                tower_id = villa.pop("tower", None)
                prop.villa = Villa.objects.create(**villa, tower_id=tower_id)
            if "commercial" in _property:
                commercial = _property.pop("commercial")
                tower_id = commercial.pop("tower", None)
                prop.commercial = Commercial.objects.create(**commercial, tower_id=tower_id)
            prop.name = _property.pop("name")
            prop.save()
        return Response(status=status.HTTP_201_CREATED, data=serializer.data)


class PropertyBulkCreateWizardView(views.APIView):
    """
    Bulk property create
    """

    permission_classes = [IsAdminUser]
    serializer_class = PropertyWizardSerializer

    @swagger_auto_schema(
        request_body=PropertyWizardSerializer(),
        responses={status.HTTP_201_CREATED: PropertyWizardSerializer()},
    )
    def post(self, request):
        """
        property wizard

        :param request:
        :type request:
        :return:
        :rtype:
        """
        data = request.data
        serializer = PropertyWizardSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        apartments = data.pop("apartments", [])
        villas = data.pop("villas", [])
        commercials = data.pop("commercials", [])
        for apartment_data in apartments:
            address = Address.objects.create(**apartment_data.pop("address"))
            tower_id = apartment_data.pop("tower", None)
            apartment = Apartment.objects.create(
                tower_id=tower_id, **apartment_data.pop("apartment")
            )
            owner_id = apartment_data.pop("owner")
            Property.objects.create(
                address=address, owner_id=owner_id, apartment=apartment, **apartment_data
            )
        for villa_data in villas:
            address = Address.objects.create(**villa_data.pop("address"))
            tower_id = villa_data.pop("tower", None)
            villa = Villa.objects.create(tower_id=tower_id, **villa_data.pop("villa"))
            owner_id = villa_data.pop("owner")
            Property.objects.create(address=address, owner_id=owner_id, villa=villa, **villa_data)
        for commercial_data in commercials:
            address = Address.objects.create(**commercial_data.pop("address"))
            tower_id = commercial_data.pop("tower", None)
            commercial = Commercial.objects.create(
                tower_id=tower_id, **commercial_data.pop("commercial")
            )
            owner_id = commercial_data.pop("owner")
            Property.objects.create(
                address=address, owner_id=owner_id, commercial=commercial, **commercial_data
            )
        return Response(status=status.HTTP_201_CREATED, data=serializer.data)

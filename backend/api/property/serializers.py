"""
property serializer
"""

from core.models import Apartment, Commercial, Property, Tower, User, Villa
from core.serializers import AddresSerializer
from drf_writable_nested.serializers import WritableNestedModelSerializer
from rest_framework import serializers


# villa, apartment, commercial serializers
# Property serializer


class VillaUnitSerializer(serializers.ModelSerializer):
    """
    villa unit serializer
    """

    tower = serializers.PrimaryKeyRelatedField(
        queryset=Tower.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Villa
        fields = "__all__"


class ApartmentSerializer(serializers.ModelSerializer):
    """
    apartment serializer
    """

    tower = serializers.PrimaryKeyRelatedField(
        queryset=Tower.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Apartment
        fields = "__all__"


class ApartmentUnitSerializer(WritableNestedModelSerializer):
    """
    apartment unit serializer
    """

    class Meta:
        model = Apartment
        fields = "__all__"


class CommercialUnitSerializer(serializers.ModelSerializer):
    """
    commercial building serializer

    """

    tower = serializers.PrimaryKeyRelatedField(
        queryset=Tower.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Commercial
        fields = "__all__"


class PropertySerializer(WritableNestedModelSerializer):
    class Meta:
        model = Property
        fields = "__all__"


class PropertySerializerNested(WritableNestedModelSerializer):
    """
    property serializer
    """

    apartment = ApartmentSerializer(required=False, allow_null=True)
    commercial = CommercialUnitSerializer(required=False, allow_null=True)
    villa = VillaUnitSerializer(required=False, allow_null=True)
    address = AddresSerializer()
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    owner_name = serializers.StringRelatedField(source="owner", read_only=True)  # print owner name

    class Meta:
        model = Property
        fields = "__all__"

    def validate(self, data):
        """
        prevent filling more than one of those fields' villa, commercial, apartments
        :param data:
        :type data:
        :return:
        :rtype:
        """
        fields = [data.get("apartment"), data.get("villa"), data.get("commercial")]
        if sum(map(bool, fields)) != 1:
            raise ValueError("You must fill only one type of unit.")
        return data


class PropertyWizardSerializer(serializers.Serializer):
    """
    Property wizard serializers
    """

    apartments = PropertySerializerNested(many=True, required=False)
    villas = PropertySerializerNested(many=True, required=False)
    commercials = PropertySerializerNested(many=True, required=False)


class TowerSerializer(WritableNestedModelSerializer):
    """
    tower serializer
    """

    class Meta:
        model = Tower
        fields = "__all__"
        extra_kwargs = {"owner": {"read_only": True}}

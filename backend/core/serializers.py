from rest_framework import serializers

from .models import Address, Apartment, Property


class BasePropertySerializer(serializers.ModelSerializer):
    """
    property serializer
    :param serializers: [description]
    :type serializers: [type]
    """

    class Meta:
        model = Property
        fields = ("id", "name", "number", "address")


class BaseApartmentSerializer(serializers.ModelSerializer):
    """
    apartment serializer
    :param serializers: [description]
    :type serializers: [type]
    """

    class Meta:
        model = Apartment
        fields = ("id", "number", "is_vacant")


class AddresSerializer(serializers.ModelSerializer):
    """
    address serializer
    :param serializers: [description]
    :type serializers: [type]
    """

    class Meta:
        model = Address
        fields = "__all__"

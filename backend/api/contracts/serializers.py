"""
contract serializers
"""

from api.property.serializers import PropertySerializer
from api.users.serializers import UserSerializer
from core.models import EmployeeContract, Payment, UnitContract
from drf_writable_nested.serializers import WritableNestedModelSerializer
from rest_framework import serializers


class EmployeeContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeContract
        fields = "__all__"


class UnitContractSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ("status",)
        model = UnitContract
        fields = "__all__"


class UnitContractSerializerRead(serializers.ModelSerializer):
    tenant = UserSerializer()
    property = PropertySerializer()
    landlord = UserSerializer(read_only=True, source="property.owner")
    address = serializers.StringRelatedField(read_only=True, source="apartment.property.address")
    document = serializers.FileField()

    class Meta:
        model = UnitContract
        fields = "__all__"


class UnitContractSerializerWrite(WritableNestedModelSerializer):
    start_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    end_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")

    class Meta:
        model = UnitContract
        fields = "__all__"


class ContractPaymentSerializer(serializers.ModelSerializer):
    contract = UnitContractSerializer(read_only=True)
    date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", required=False)

    class Meta:
        model = Payment
        fields = "__all__"

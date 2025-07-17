from api.contracts.serializers import UnitContractSerializerRead
from rest_framework import serializers
from core.models import UnitContract
from api.users.serializers import UserSerializer
from api.property.serializers import PropertySerializer


class ContractSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    # Add other contract attributes as needed


class DashboardSerializer(serializers.Serializer):
    contract_count = serializers.IntegerField(default=0)
    signed_contract_count = serializers.IntegerField(default=0)
    unsigned_contract_count = serializers.IntegerField(default=0)
    terminated_contract_count = serializers.IntegerField(default=0)
    contracts = ContractSerializer(many=True, default=[])

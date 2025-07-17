import json
from json import JSONEncoder

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class setEncoder(JSONEncoder):
    """User permissions serializer

    Args:
        JSONEncoder ([type]): [description]
    """

    def default(self, obj):
        return list(obj)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["is_superuser"] = user.is_superuser
        token["is_landlord"] = user.is_landlord
        token["is_tenant"] = user.is_tenant
        token["is_employee"] = user.is_employee
        token["permissions"] = json.loads(json.dumps(user.get_all_permissions(), cls=setEncoder))

        return token


class TokenRefreshResponseSerializer(serializers.Serializer):
    access = serializers.CharField()

    def create(self, validated_data):
        raise NotImplementedError()

    def update(self, instance, validated_data):
        raise NotImplementedError()


class TokenVerifyResponseSerializer(serializers.Serializer):
    def create(self, validated_data):
        raise NotImplementedError()

    def update(self, instance, validated_data):
        raise NotImplementedError()


class TokenBlackListSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

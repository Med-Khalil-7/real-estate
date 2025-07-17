from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group, Permission
from django.db import transaction

from core.models.books import UnitContract
from core.models.mail_history import MailHistory
from core.serializers import AddresSerializer
from drf_writable_nested.mixins import UniqueFieldsMixin
from drf_writable_nested.serializers import WritableNestedModelSerializer
from rest_framework import serializers
from rest_framework.relations import StringRelatedField


from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode


User = get_user_model()


class UserContractSerilizer(serializers.ModelSerializer):
    from api.property.serializers import PropertySerializer

    property = PropertySerializer()
    tenant = serializers.StringRelatedField()
    landlord = serializers.StringRelatedField()
    address = serializers.StringRelatedField()
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()

    class Meta:
        model = UnitContract
        fields = "__all__"


class UserSerializer(UniqueFieldsMixin, WritableNestedModelSerializer):
    address = AddresSerializer(required=True)
    tenant_contracts = UserContractSerilizer(many=True, read_only=True)
    full_name = StringRelatedField()

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
        }

    def create(self, validated_data):
        with transaction.atomic():
            validated_data["password"] = make_password(validated_data["password"])
            return super().create(validated_data)

    def update(self, instance, validated_data):
        with transaction.atomic():
            return super().update(instance, validated_data)


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ("id", "codename", "name")


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"


class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name"]


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        is_landlord = serializers.BooleanField()
        is_tenant = serializers.BooleanField()
        fields = ["first_name", "last_name", "phone_number", "email", "password"]
        extra_kwargs = {
            "profile": {"read_only": True},
            "password": {"write_only": True, "required": True},
            "user_permissions": {"required": False},
            "groups": {"required": False},
        }


class MailHistorySerializer(serializers.ModelSerializer):
    sender = UserSearchSerializer()
    receiver = UserSearchSerializer()
    delivery_state = serializers.CharField(source="get_delivery_state_display")

    class Meta:
        model = MailHistory
        fields = ["created", "sender", "receiver", "delivery_state"]


class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)

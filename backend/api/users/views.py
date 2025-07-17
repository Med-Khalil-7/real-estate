# from django.shortcuts import render  # noqa
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group, Permission
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.db import transaction
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from core.mixins import OptionalPaginationMixin
from core.models import MailHistory, User
from core.models.boards import Board
from core.models.users import DEPT_CHOICES
from core.permissions import AuthenticatedAndReadOnly, IsLandlordPermission
from core.tokens import account_activation_token
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import APIException
from rest_framework.generics import ListAPIView
from rest_framework.permissions import (
    AllowAny,
    DjangoModelPermissions,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    GroupSerializer,
    MailHistorySerializer,
    PermissionSerializer,
    RegistrationSerializer,
    UserSerializer,
    ResetPasswordEmailRequestSerializer,
    SetNewPasswordSerializer
)


class CurrentUserViewset(APIView):
    """Retrieve current user

    :param APIView: [description]
    :type APIView: [type]
    :return: [description]
    :rtype: [type]
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class PermissionViewset(viewsets.ModelViewSet, OptionalPaginationMixin):
    """Account permission API

    Args:
        viewsets ([type]): [description]
    """

    queryset = Permission.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = PermissionSerializer
    pagination_class = None


class GroupViewSet(viewsets.ModelViewSet):
    """Account group API

    Args:
        viewsets ([type]): [description]
    """

    queryset = Group.objects.all()
    permission_classes = [IsAdminUser | DjangoModelPermissions]
    serializer_class = GroupSerializer
    pagination_class = None


class UserViewSet(viewsets.ModelViewSet):
    """Account API

    :param viewsets: [description]
    :type viewsets: [type]
    """

    queryset = User.objects.all()
    permission_classes = [
        IsAuthenticated | DjangoModelPermissions | AuthenticatedAndReadOnly | AllowAny
    ]
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        "email",
        "first_name",
        "last_name",
        "is_landlord",
        "is_tenant",
        "is_employee",
        "is_superuser",
    ]

    def paginate_queryset(self, queryset):
        """Enable/Disable pagination from request

        :param queryset: [description]
        :type queryset: [type]
        :return: [description]
        :rtype: [type]
        """
        if "limit" not in self.request.query_params:
            return None
        return super().paginate_queryset(queryset)


class SignUpViewset(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=RegistrationSerializer, responses={200: RegistrationSerializer}
    )
    def post(self, request, *args, **kwargs):
        """User registration

        Args:
            request ([type]): [description]
        """

        data = request.data
        # TODO: mzekri-madar increase password complexity
        # FIXME: Move the email sending part to celery

        serializer = RegistrationSerializer(data=data)
        if serializer.is_valid():
            try:
                data["password"] = make_password(data.get("password"))
                user = User(**data)
                user.is_active = False
                user.save()
                # Email
                current_site = get_current_site(request)
                mail_subject = "RESM account application"
                message = render_to_string(
                    "application_notification_email.html",
                    {
                        "user": user,
                        "uid": user.pk,
                        "domain": current_site.domain,
                        "route": settings.FRONTEND_ACCOUNT_CONFIRMATION_ROUTE,
                    },
                )
                to_email = settings.ADMIN_EMAIL
                send_mail(mail_subject, message, settings.SERVER_EMAIL, [to_email])
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                # Rollback in case of exception
                transaction.set_rollback(True)
                return Response(
                    f"Internal server error {e}", status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountViewset(viewsets.ViewSet):
    """Account activation and verification

    Args:
        viewsets ([type]): [description]

    Raises:
        APIException: [description]
        APIException: [description]
    """

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter("uidb64", openapi.IN_QUERY, type=openapi.TYPE_STRING,),
            openapi.Parameter("token", openapi.IN_QUERY, type=openapi.TYPE_STRING,),
        ]
    )
    @action(detail=False, permission_classes=[AllowAny])
    def verification(self, request):
        """User email verification

        Args:
            request ([type]): [description]
        """
        try:
            uidb64 = request.query_params["uidb64"]
            token = request.query_params["token"]
            # Decode user id
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as e:
            raise APIException(f"Token is invalid {e}")

        if account_activation_token.check_token(user, token):
            # If token is valid activate the user
            user.is_active = True
            user.save()
            return Response(data="You account has been activated!", status=status.HTTP_200_OK)
        else:
            raise APIException("Token is invalid")

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter("user_id", openapi.IN_QUERY, type=openapi.TYPE_INTEGER,),
            openapi.Parameter("accept", openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN,),
        ]
    )
    @action(detail=False, permission_classes=[IsAdminUser])
    def confirmation(self, request):
        """Account confirmation by admins

        Args:
            uid ([type]): [description]

        Raises:
            APIException: [description]
            APIException: [description]
        """
        try:

            user_id = int(request.query_params["user_id"])
            accept = request.query_params["accept"]
            if request.query_params["accept"] not in ["true", "false"]:
                return Response(
                    data=f"Invalid request.", status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                return Response(data=f"User does exist.", status=status.HTTP_404_NOT_FOUND,)
            if accept == "true":
                mail_subject = "Activate your account."
                current_site = get_current_site(request)
                message = render_to_string(
                    "email_template.html",
                    {
                        "user": user,
                        "domain": current_site.domain,
                        "route": settings.FRONTEND_ACTIVATION_ROUTE,
                        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                        "token": account_activation_token.make_token(user),
                    },
                )
                to_email = user.email
                send_mail(mail_subject, message, settings.ADMIN_EMAIL, [to_email])





                
                return Response(data="Confirmation email is sent.", status=status.HTTP_200_OK)
            else:
                user.delete()
                mail_subject = "Application refused."
                current_site = get_current_site(request)
                message = "Your application to RESM has been refused."
                to_email = user.email
                send_mail(mail_subject, message, settings.ADMIN_EMAIL, [to_email])
                return Response(data="Application is refused.", status=status.HTTP_200_OK)
        except Exception as e:
            # Rollback in case of exception
            transaction.set_rollback(True)
            return Response(
                data=f"Generic api exception {e}", status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ExcludeBoardMembersFilter(filters.BaseFilterBackend):
    """
    Filter that only shows members that are not a member of board.
    """

    result_limit = 8
    filter_param = "board"

    def filter_queryset(self, request, queryset, view):
        board_id = request.query_params.get(self.filter_param)
        try:
            board = Board.objects.get(id=board_id)
        except (Board.DoesNotExist, ValueError):
            return queryset

        return queryset.exclude(id__in=board.members.all())[: self.result_limit]


class UserSearchView(ListAPIView):
    """Search users that are not a board memebers

    :param ListAPIView: [description]
    :type ListAPIView: [type]
    """

    queryset = User.objects.filter(is_active=True).all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter, ExcludeBoardMembersFilter]
    permission_classes = [IsAuthenticated]
    pagination_class = None
    search_fields = ["email", "first_name", "last_name", "is_landlord", "is_tenant", "is_employee"]


class MailHistoryView(ListAPIView):
    serializer_class = MailHistorySerializer
    permission_classes = [IsAdminUser | IsLandlordPermission]

    def get_queryset(self):
        """
        Get mail history queryset
        """
        user = self.request.user
        if user.is_superuser:
            return MailHistory.objects.all()  # All if admin
        else:
            return MailHistory.objects.filter(sender=user)  # related if user


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def departments(request):
    """return the list of departements"""
    result = [
        {"id": key, "name": choice[0], "desc": choice[1]} for key, choice in enumerate(DEPT_CHOICES)
    ]
    return Response(result)


from rest_framework import generics
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
from django.http import HttpResponsePermanentRedirect
import os

class CustomRedirect(HttpResponsePermanentRedirect):

    allowed_schemes = [os.environ.get('APP_SCHEME'), 'http', 'https']
class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        email = request.data.get('email', '')

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(
                request=request).domain
            relativeLink = reverse(
                'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            redirect_url = request.data.get('redirect_url', '')
            # absurl = 'http://'+current_site + relativeLink
            # email_body = 'Hello, \n Use link below to reset your password  \n' + \
            #     absurl+"?redirect_url="+redirect_url
            # data = {'email_body': email_body, 'to_email': user.email,
            #         'email_subject': 'Reset your passsword'}
            # Util.send_email(data)
            
            # current_site = get_current_site(request)
            # message = 'Hello, \n Use link below to reset your password  \n' + \
            # absurl+'?redirect_url='+'http://'+current_site

            mail_subject = "Reset your passsword"
            message = render_to_string(
                    "reset_password_template.html",
                    {
                        "user": user,
                        "domain": current_site,
                        "route": relativeLink,
                        "redirect_url":redirect_url
                    },
                )
            to_email = user.email
            send_mail(mail_subject, message, settings.SERVER_EMAIL, [to_email])
            return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        elif not User.objects.filter(email=email).exists():
            return Response({'error':'This email is not registered yet'}, status=status.HTTP_400_BAD_REQUEST)


class PasswordTokenCheckAPI(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    def get(self, request, uidb64, token):

        redirect_url = request.GET.get('redirect_url')

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                if len(redirect_url) > 3:
                    return CustomRedirect(redirect_url+'?token_valid=False')
                else:
                    return CustomRedirect(os.environ.get('FRONTEND_URL', '')+'?token_valid=False')

            if redirect_url and len(redirect_url) > 3:
                return CustomRedirect(redirect_url+'/#'+settings.FRONTEND_RESET_PASSWORD_ROUTE+'/'+uidb64+'/'+token)
                # return Response({'success': 'Credantials Valid','uidb64':uidb64,'token':token}, status=status.HTTP_200_OK)
            else:
                return CustomRedirect(os.environ.get('FRONTEND_URL', '')+'?token_valid=False')

        except DjangoUnicodeDecodeError as identifier:
            try:
                if not PasswordResetTokenGenerator().check_token(user):
                    return CustomRedirect(redirect_url+'?token_valid=False')
                    
            except UnboundLocalError as e:
                return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)


class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success':'Password reset success'},status=status.HTTP_200_OK)
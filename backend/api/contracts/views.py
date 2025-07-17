from uuid import uuid4

from django.contrib.sites.shortcuts import get_current_site
from django.http.response import HttpResponse
from django.template import Context, Template
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode

from core.models import EmployeeContract, HtmlTemplate, UnitContract, User
from core.permissions import AuthenticatedAndReadOnly, IsLandlordPermission
from core.tasks import bulk_reminder_email, send_contract_sign_confirmation
from core.tokens import account_activation_token
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import (
    AllowAny,
    DjangoModelPermissions,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_202_ACCEPTED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.views import APIView
from weasyprint import HTML

from .serializers import (
    EmployeeContractSerializer,
    UnitContractSerializerRead,
    UnitContractSerializerWrite,
)


# TODO: mzekri add own records permissions


class EmployeeContractsViewset(viewsets.ModelViewSet):
    """Employee Contract viewsets"""

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]

    serializer_class = EmployeeContractSerializer
    queryset = EmployeeContract.objects.all()


class PropertyContractsViewSet(viewsets.ModelViewSet):
    """Property contract viewsets"""

    permission_classes = [IsAdminUser | AuthenticatedAndReadOnly | DjangoModelPermissions]
    pagination_class = None
    queryset = UnitContract.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return UnitContract.objects.all()
        elif user.is_tenant:
            return user.tenant_contracts.all()
        elif user.is_landlord:
            return UnitContract.objects.filter(property__owner=user)

    def get_serializer_class(self):
        """
        Change serializer depending on request
        """

        if self.action in ["retrieve", "list"]:
            return UnitContractSerializerRead
        return UnitContractSerializerWrite


@api_view(["GET"])
@permission_classes([AllowAny])
def contract_pdf_gen_view(self, *args, **kwargs):
    """
    Get contract by id and generate a pdf file
    """
    contract_id = kwargs["contract_id"]
    try:
        contract = UnitContract.objects.get(pk=contract_id)  # Get contract
        _template = HtmlTemplate.objects.get(template_type="AC")  # Get property contract template
        template_code = _template.template_code
        template = Template(template_code)
        context = Context({"contract": contract})
        html_string = template.render(context)
        html = HTML(string=html_string)
        file_name = f"{uuid4()}.pdf"
        pdf = html.write_pdf()
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'filename="{file_name}"'
        return response
    except UnitContract.DoesNotExist:
        return Response(status=HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR, data=f"{e}")


@api_view(["POST"])
@permission_classes([IsAdminUser | IsLandlordPermission])
def bulk_email_reminder_view(request):
    """
    Send bulk payment reminder emails
    """
    user_id = request.user.id
    bulk_reminder_email.delay(user_id)
    return Response(status=HTTP_202_ACCEPTED)


class TerminateContract(APIView):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(responses={HTTP_201_CREATED: ""})
    def post(self, request, *args, **kwargs):
        """
        Terminate a contract
        """
        contract_id = kwargs["contract_id"]
        try:
            contract = UnitContract.objects.get(pk=contract_id)
            contract.set_as_terminated()
            return Response(status=HTTP_201_CREATED)
        except ValidationError as exception:
            return Response(status=HTTP_400_BAD_REQUEST, data=f"{exception}")
        except UnitContract.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


class SignContract(APIView):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(responses={HTTP_201_CREATED: ""})
    def post(self, request, *args, **kwargs):
        """
        Terminate a contract
        """
        contract_id = kwargs["contract_id"]
        try:
            contract = UnitContract.objects.get(pk=contract_id)
            contract.set_as_signed()
            return Response(status=HTTP_201_CREATED)
        except ValidationError as exception:
            return Response(status=HTTP_400_BAD_REQUEST, data=f"{exception}")
        except UnitContract.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


class SignConfirmationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):

        """
        Send contract mail confirmation
        """

        try:
            """
            - get contract
            - send mail to admin tenant and landlord
            """
            domain = get_current_site(request).domain
            # FIXME: move all of the code below to celery
            contract_id = kwargs["contract_id"]
            contract = UnitContract.objects.get(pk=contract_id)
            tenant = contract.tenant
            landlord = contract.property.owner
            # send mail to admin
            # HACK will dispatch this to all admins for now until organization admin is implemented
            admins = User.objects.filter(is_superuser=True)
            for admin in admins:
                send_contract_sign_confirmation.delay(domain, contract_id, admin.id)
            # send mail to landlord
            send_contract_sign_confirmation.delay(domain, contract_id, landlord.id)
            # send mail to tenant
            send_contract_sign_confirmation.delay(domain, contract_id, tenant.id)
            return Response(status=status.HTTP_200_OK)
        except UnitContract.DoesNotExist as e:
            return Response(f"Contract does not exist {e}", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                f"Internal server error {e}", status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SignValidationView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter("uidb64", openapi.IN_QUERY, type=openapi.TYPE_STRING,),
            openapi.Parameter("token", openapi.IN_QUERY, type=openapi.TYPE_STRING,),
            openapi.Parameter("contract_id", openapi.IN_QUERY, type=openapi.TYPE_STRING,),
        ]
    )
    @action(detail=False, permission_classes=[AllowAny])
    def validation(self, request):

        try:
            """
            - get contract
            - send mail to admin tenant and landlord
            """
            uidb64 = request.query_params["uidb64"]
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = self.request.user
            token = request.query_params["token"]
            contract = UnitContract.objects.get(pk=request.query_params["contract_id"])
            print(account_activation_token.check_token(user, token))
            if not account_activation_token.check_token(user, token):
                return Response(data="Token is invalid", status=403)
                # update contract confirmation status
            if user.is_superuser:
                contract.is_confirmed_by_admin = True
            if user.is_landlord:
                contract.is_confirmed_by_landlord = True
            if user.is_tenant:
                contract.is_confirmed_by_tenant = True
            contract.save()
            return Response(status=200)
        except UnitContract.DoesNotExist as e:
            return Response(f"Contract does not exist {e}", status=404)
        except Exception as e:
            return Response(f"Internal server error {e}", status=500)

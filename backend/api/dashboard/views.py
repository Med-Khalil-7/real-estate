from datetime import datetime

from django.utils import timezone

from core.models import UnitContract
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAdminUser, IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
from rest_framework.views import APIView

from .serializers import DashboardSerializer,ContractSerializer


from decimal import Decimal as D

def contracts_stats(contracts, date):
    stats = {
        "contract_count": len(contracts),
        "signed_contract_count": 0,
        "unsigned_contract_count": 0,
        "terminated_contract_count": 0,
        "contracts": [],
    }

    for contract in contracts:
        if contract.is_confirmed_by_admin and contract.is_confirmed_by_landlord and contract.is_confirmed_by_tenant:
            stats["signed_contract_count"] += 1
        elif contract.state == "T":
            stats["terminated_contract_count"] += 1
        else:
            stats["unsigned_contract_count"] += 1
        # Serialize the UnitContract object and append it to the contracts list
        contract_data = ContractSerializer(contract).data
        stats["contracts"].append(contract_data)

    return stats


class DashboardView(APIView):
    """
    dashboard view
    """

    permission_classes = [IsAdminUser | IsAuthenticated]

    @swagger_auto_schema(
        responses={HTTP_200_OK: DashboardSerializer()},
        manual_parameters=[openapi.Parameter("date", openapi.IN_QUERY, type=openapi.TYPE_STRING,),],
    )
    def get(self, request):
        user = request.user
        date = request.query_params.get("date")
        if date:  # validate
            date = timezone.make_aware(datetime.strptime(date, "%Y-%m-%d"))
        else:
            date = timezone.now()
        date = date.replace(hour=23, minute=59)  # end of day
        try:
            if user.is_superuser:  # superuser
                contracts = UnitContract.objects.all()
                stats = contracts_stats(contracts, date)
            else:  # tenant
                contracts = UnitContract.objects.filter(property__owner=user)
                stats = contracts_stats(contracts, date)

            serializer = DashboardSerializer(stats)
            return Response(data=serializer.data, status=HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=HTTP_200_OK, data=str(e))
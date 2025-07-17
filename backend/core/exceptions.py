from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


class LandlordProfileNotExist(APIException):
    status_code = 404
    default_detail = "Landlord profile doesn't exist for the logged in user"
    default_code = "Landlord profile not available"


class UserCorrupted(APIException):
    status_code = 404
    default_detail = "corrupted user profile, please check with system admin"
    default_code = "Corrupted User"


class SignedOrTerminated(APIException):
    status_code = 400
    default_detail = "Contract is already signed or terminated"
    default_code = "Terminated contract"


class ContractTerminated(APIException):
    status_code = 400
    default_detail = "Connot create a transaction on a terminated contract"
    default_code = "contract_terminated"


class UserHasContract(APIException):
    status_code = 400
    default_detail = "This user has an active contract"
    default_code = "has_contract"


class UserHasBuilding(APIException):
    status_code = 400
    default_detail = "This user owns a building"
    defalt_code = "owns_a_building"

from rest_framework import permissions


class AuthenticatedAndReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS and bool(
            request.user and request.user.is_authenticated
        )


class IsLandlordPermission(permissions.BasePermission):
    """Check if the logged in user is a landlord"""

    message = "Landlord does not exist for the logged-in user"

    def has_permission(self, request, view):
        """
        has landlord permission
        :param request:
        :type request:
        :param view:
        :type view:
        :return:
        :rtype:
        """
        # @ziedbouf: has_permission permission should return bool
        # if we do conditional permissions on a view and we "OR" or "AND"
        # raising exception here will cause and issue
        return request.user.is_landlord


class IsTenantPermission(permissions.BasePermission):
    """Check if the loggedin user is a tenant"""

    message = "Landlord does not exist for the logged-in user"

    def has_permission(self, request, view):
        """
        has landlord permission
        :param request:
        :type request:
        :param view:
        :type view:
        :return:
        :rtype:
        """
        # @ziedbouf: has_permission permission should return bool
        # if we do conditional permissions on a view and we "OR" or "AND"
        # raising exception here will cause and issue
        return request.user.is_landlord

from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import (
    AccountViewset,
    CurrentUserViewset,
    GroupViewSet,
    MailHistoryView,
    PermissionViewset,
    SignUpViewset,
    UserSearchView,
    UserViewSet,
    departments,
    RequestPasswordResetEmail,
    PasswordTokenCheckAPI,
    SetNewPasswordAPIView
)


router = DefaultRouter()
router.register("groups", GroupViewSet, basename="groups")
router.register("permissions", PermissionViewset, basename="permissions")
router.register("", UserViewSet, basename="users")  # Generic crud
router.register("account", AccountViewset, basename="action")

urlpatterns = [
    path("search/", UserSearchView.as_view(), name="user-search"),
    path("mail_history", MailHistoryView.as_view(), name="mail_history"),
    path("current", CurrentUserViewset.as_view()),
    path("departments/", departments),
    path("signup/", SignUpViewset.as_view()),
    path('request-reset-email/', RequestPasswordResetEmail.as_view(),
         name="request-reset-email"),
    path('password-reset/<uidb64>/<token>/',
    PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('password-reset-complete/', SetNewPasswordAPIView.as_view(),
         name='password-reset-complete')
]
urlpatterns += router.urls

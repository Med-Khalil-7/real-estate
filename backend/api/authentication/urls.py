from django.conf.urls import include, url
from django.urls import path

from .views import (
    CustomObtainTokenPairView, 
    DecoratedTokenRefreshView,
    DecoratedTokenVerifyView,
    LogoutAndBlacklistRefreshTokenForUserView
)

from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path(
        "obtain/", CustomObtainTokenPairView.as_view(), name="token_create",
    ),  # override sjwt stock token
    path("refresh/", DecoratedTokenRefreshView.as_view(), name="token_refresh"),
    path("verify/", DecoratedTokenVerifyView.as_view(), name="token_verify"),
    path("blacklist/", LogoutAndBlacklistRefreshTokenForUserView.as_view(), name="logout")
]

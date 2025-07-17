"""
main api urls
"""
from django.conf.urls import include, url


urlpatterns = [
    url(r"^users/", include("api.users.urls")),
    url(r"books/", include("api.books.urls")),
    url(r"dashboard/", include("api.dashboard.urls")),
    url(r"^authentication/", include("api.authentication.urls")),
    url(r"^properties/", include("api.property.urls")),
    url(r"^contracts/", include("api.contracts.urls")),
    url(r"^kanban/", include("api.kanban.urls")),
    url(r"^settings/", include("api.settings.urls")),
]

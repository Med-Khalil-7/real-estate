from django.urls import path

from rest_framework import routers

from .views import BoardViewSet, ColumnViewSet, CommentViewSet, SortColumn, SortTask, TaskViewSet


router = routers.DefaultRouter()

router.register(r"boards", BoardViewSet)
router.register(r"columns", ColumnViewSet)
router.register(r"tasks", TaskViewSet)
router.register(r"comments", CommentViewSet)

urlpatterns = [
    path("sort/column/", SortColumn.as_view(), name="sort-column"),
    path("sort/task/", SortTask.as_view(), name="sort-task"),
]
urlpatterns += router.urls

"""
mixins
"""


class CreateListMixin:
    """Allows bulk creation of a resource."""

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super().get_serializer(*args, **kwargs)


class OptionalPaginationMixin:
    def paginate_queryset(self, queryset):
        """
        enable/Disable pagination from request
        :param queryset: [description]
        :type queryset: [type]
        :return: [description]
        :rtype: [type]
        """
        if "limit" not in self.request.query_params:
            return None
        return super().paginate_queryset(queryset)

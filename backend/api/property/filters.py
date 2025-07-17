"""
query string filters
"""
from django_filters import BooleanFilter, FilterSet, NumberFilter


class UnitTypeFilter(FilterSet):
    """
    unit filter fields
    """

    is_villa = BooleanFilter(field_name="villa", lookup_expr="isnull", exclude=True)
    is_apartment = BooleanFilter(field_name="apartment", lookup_expr="isnull", exclude=True)
    is_commercial = BooleanFilter(field_name="commercial", lookup_expr="isnull", exclude=True)
    commercial__tower_id = NumberFilter(field_name="commercial__tower_id", lookup_expr="exact")
    apartment__tower_id = NumberFilter(field_name="apartment__tower_id", lookup_expr="exact")
    villa__tower_id = NumberFilter(field_name="villa__tower_id", lookup_expr="exact")
    owner_id = NumberFilter(field_name="owner_id", lookup_expr="exact")

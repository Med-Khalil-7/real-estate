"""
query string filters
"""
from django_filters import FilterSet, NumberFilter


class ContractFilter(FilterSet):
    """
    bill filter fields
    """

    contract_id = NumberFilter(field_name="contract_id", lookup_expr="exact")

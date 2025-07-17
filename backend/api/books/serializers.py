"""
books serializes
"""
from datetime import datetime

from core.models import (
    Bill,
    BillLine,
    EstimateLine,
    ExpenseClaim,
    ExpenseClaimLine,
    Invoice,
    InvoiceLine,
    Payment,
    TaxRate,
)
from drf_writable_nested import WritableNestedModelSerializer
from generic_relations.relations import GenericRelatedField
from rest_framework import serializers


class TaxRateSerializer(serializers.ModelSerializer):
    """
    tax rate serializer
    """

    class Meta:
        model = TaxRate
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    """
    payment serializer
    """

    class Meta:
        model = Payment
        fields = "__all__"


class InvoiceLineSerializer(serializers.ModelSerializer):
    """
    invoice line serializer
    """

    class Meta:
        model = InvoiceLine
        fields = "__all__"
        read_only_fields = ["invoice"]


class InvoiceSerializer(WritableNestedModelSerializer):
    """
    invoice serializer
    """

    payments = PaymentSerializer(many=True, read_only=True)
    lines = InvoiceLineSerializer(many=True)
    number = serializers.IntegerField(read_only=True)
    is_fully_paid = serializers.BooleanField(read_only=True)

    def validate_date_dued(self, value):
        data = self.initial_data
        date_issued = datetime.strptime(data["date_issued"], "%Y-%m-%d").date()
        if value < date_issued:
            raise serializers.ValidationError("Due date cannot be less than issue date!")
        return value

    class Meta:
        extra_kwargs = {"date_issued": {"required": True}, "date_dued": {"required": True}}
        model = Invoice
        fields = "__all__"
        read_only_fields = ["total_incl_tax", "total_excl_tax"]


class BillLineSerializer(serializers.ModelSerializer):
    """
    bill line serializer
    """

    class Meta:
        model = BillLine
        fields = "__all__"
        read_only_fields = ["bill"]


class BillSerializer(WritableNestedModelSerializer):
    """
    bill serializer
    """

    payments = PaymentSerializer(many=True, read_only=True)
    lines = BillLineSerializer(many=True)
    number = serializers.IntegerField(read_only=True)
    is_fully_paid = serializers.BooleanField(read_only=True)

    def validate_date_dued(self, value):
        data = self.initial_data
        date_issued = datetime.strptime(data["date_issued"], "%Y-%m-%d").date()
        if value < date_issued:
            raise serializers.ValidationError("Due date cannot be less than issue date!")
        return value

    class Meta:
        model = Bill
        fields = "__all__"
        read_only_fields = ["total_incl_tax", "total_excl_tax"]


class ExpenseClaimLineSerializer(serializers.ModelSerializer):
    """
    expense claim line serializer
    """

    class Meta:
        model = ExpenseClaimLine
        fields = "__all__"
        read_only_fields = ["expense_claim"]


class ExpenseClaimSerializer(WritableNestedModelSerializer):
    """
    expense claim serializer
    """

    payments = PaymentSerializer(many=True, read_only=True)
    lines = ExpenseClaimLineSerializer(many=True)
    number = serializers.IntegerField(read_only=True)
    is_fully_paid = serializers.BooleanField(read_only=True)

    def validate_date_dued(self, value):
        data = self.initial_data
        date_issued = datetime.strptime(data["date_issued"], "%Y-%m-%d").date()
        if value < date_issued:
            raise serializers.ValidationError("Due date cannot be less than issue date!")
        return value

    class Meta:
        model = ExpenseClaim
        fields = "__all__"
        read_only_fields = ["total_incl_tax", "total_excl_tax"]


class EstimateLineSerializer(serializers.ModelSerializer):
    """
    estimate line serializer
    """

    class Meta:
        model = EstimateLine
        fields = "__all__"


class EstimateSerializer(WritableNestedModelSerializer):
    """
    estimate serializer
    """

    payments = PaymentSerializer(many=True, read_only=True)
    lines = EstimateLineSerializer(many=True)

    class Meta:
        model = Bill
        fields = "__all__"


class PaymentWithGenericRelationSerializer(serializers.ModelSerializer):
    """
    payment serializer
    """

    content_object = GenericRelatedField(
        {Bill: BillSerializer(), Invoice: InvoiceSerializer()}, read_only=True
    )

    class Meta:
        model = Payment
        fields = ["amount", "detail", "date_paid", "reference", "content_object"]


class ContractDashboardSerializer(serializers.Serializer):
    """
    contract dashboard serializer
    """

    bills = BillSerializer(many=True)
    invoices = InvoiceSerializer(many=True)


class ContractTaxReportSerializer(serializers.Serializer):
    """
    contract tax report
    """

    tax_rate = serializers.StringRelatedField()
    taxable_amount = serializers.DecimalField(max_digits=7, decimal_places=5)
    expenses_amount = serializers.DecimalField(max_digits=7, decimal_places=5)


class ProfitAndLosSummarySerializer(serializers.Serializer):
    """
    profit or loss summary line
    """

    sales_amount = serializers.DecimalField(max_digits=5, decimal_places=2)
    expenses_amount = serializers.DecimalField(max_digits=5, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=5, decimal_places=2)

    def get_net_profit(self, instance):
        """
        calculate net profit
        :param instance:
        :type instance:
        :return:
        :rtype:
        """
        return instance.sales_amount - instance.expenses_amount


class ProfitAndLosSummaryLineSerializer(serializers.Serializer):
    def to_representation(self, instance):
        summaries = []
        for k, v in instance.items():
            data = {"date": k, "summary": ProfitAndLosSummarySerializer(v).data}
            summaries.append(data)
        return summaries


class ProfitAndExpenseIndexes(serializers.Serializer):
    """
    profit or loss summary line
    """

    profit_index = serializers.DecimalField(max_digits=5, decimal_places=2)
    expenses_index = serializers.DecimalField(max_digits=5, decimal_places=2)


class ProfitAndExpenseUnpaid(serializers.Serializer):
    """
    profit or loss summary line
    """

    unpaid_sales = serializers.DecimalField(max_digits=5, decimal_places=2)
    unpaid_expenses = serializers.DecimalField(max_digits=5, decimal_places=2)


class ContractProfitOrLossReportSerializer(serializers.Serializer):
    """
    contract profit or loss report serializer
    """

    summaries = ProfitAndLosSummaryLineSerializer()
    total_summary = ProfitAndLosSummarySerializer()
    indexes = ProfitAndExpenseIndexes()
    unpaid_sales = ProfitAndExpenseUnpaid()


class ContractInvoiceDetailSerializer(serializers.Serializer):
    """
    contract invoice details serialize
    """

    invoices = InvoiceSerializer(many=True)
    # tax_rates = TaxRateSerializer(many=True)

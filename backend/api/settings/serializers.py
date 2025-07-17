from rest_framework import serializers

from core.models import HtmlTemplate


class HtmlTemplateSerializer(serializers.ModelSerializer):
    template_type = serializers.CharField()
    class Meta:
        model = HtmlTemplate
        fields = "__all__"
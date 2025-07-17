from django.db.models import Model
from django.db.models.enums import TextChoices
from django.db.models.fields import CharField, TextField


class TemplateType(TextChoices):
    """Template types

    Args:
        TextChoices ([type]): [description]
    """

    APARTMENT_CONTRACT = "AC", "Apartment contract"
    EMPLOYEE_CONTRACT = "EC", "Employee contract"
    INVOICE = "I", "Invoice"


class HtmlTemplate(Model):
    """Report django template for pdf generation

    Args:
        Auditable ([type]): [description]
    """

    name = TextField()
    template_type = CharField(
        max_length=2,
        choices=TemplateType.choices,
        default=TemplateType.APARTMENT_CONTRACT,
        unique=True,
    )
    template_code = TextField()

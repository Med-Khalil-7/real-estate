from django.db.models.deletion import SET_NULL
from django.db.models.enums import TextChoices
from django.db.models.fields import CharField
from django.db.models.fields.related import ForeignKey
from .abstract import Auditable
from .users import User


class DeliveryStatus(TextChoices):
    SUCCESS = "S", "Success"
    FAILURE = "F", "Failure"


class MailHistory(Auditable):
    delivery_state = CharField(max_length=1, choices=DeliveryStatus.choices)
    sender = ForeignKey(User, blank=True, null=True, on_delete=SET_NULL, related_name="sent_mails")
    receiver = ForeignKey(
        User, blank=True, null=True, on_delete=SET_NULL, related_name="received_mails"
    )

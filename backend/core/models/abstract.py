"""
abstract classes
"""
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.db.models import (
    PositiveIntegerField,
    BooleanField,
    CharField,
    DecimalField,
    ForeignKey,
    Model,
    TextChoices,
    TextField,
)
from django.db.models import SET_NULL, DateTimeField
from django.db.models.fields.files import FileField

User = get_user_model()


class Auditable(Model):
    created = DateTimeField(auto_now_add=True)
    updated = DateTimeField(auto_now=True)
    created_by = ForeignKey(
        User, blank=True, null=True, related_name="created_%(class)s", on_delete=SET_NULL,
    )
    updated_by = ForeignKey(
        User, blank=True, null=True, on_delete=SET_NULL, related_name="updated_%(class)s"
    )

    class Meta:
        abstract = True


class Unit(Auditable):
    """
    unit base class
    :param Auditable: [description]
    :type Auditable: [type]
    :return: [description]
    :rtype: [type]
    """

    class Meta:
        abstract = True

    is_vacant = BooleanField(default=True)
    has_parking = BooleanField(default=False)
    has_internet_connection = BooleanField(default=False)
    has_gas = BooleanField(default=False)
    has_electricity = BooleanField(default=False)
    has_airconditioning = BooleanField(default=False)
    pets_allowed = BooleanField(default=False)
    area = DecimalField(
        max_digits=7, decimal_places=2, validators=[MinValueValidator(0)], null=True
    )
    room_count = PositiveIntegerField(default=True)

    def set_as_occupied(self):
        """
        set as occupied
        """
        self.is_vacant = False
        self.save()

    def set_as_vacant(self):
        """
        set as vacant
        """
        self.is_vacant = True
        self.save()


class BaseContract(Model):
    class ContractState(TextChoices):
        SIGNED = "S", "Signed"
        NOT_SIGNED = "N", "Not signed"
        TERMINATED = "T", "TERMINATED"

    start_date = DateTimeField()
    end_date = DateTimeField()
    remarks = TextField(null=True)
    state = CharField(max_length=1, choices=ContractState.choices, default=ContractState.NOT_SIGNED)
    document = FileField(upload_to=settings.ATTACHEMENT_DIR, null=True)

    def set_as_terminated(self):
        """
        set as terminated
        """
        self.state = self.ContractState.TERMINATED
        self.save()

    def set_as_signed(self):
        """
        set as signed
        """
        self.state = self.ContractState.SIGNED
        self.save()

    class Meta:
        abstract = True

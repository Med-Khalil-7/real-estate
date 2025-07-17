"""
property models
"""
from django.db.models import BooleanField, CharField, ForeignKey, OneToOneField, TextChoices
from django.db.models.deletion import CASCADE, DO_NOTHING, PROTECT
from django.db.models.fields import PositiveIntegerField

from core.models import Address, User
from .abstract import Auditable, Unit


# order matter, please avoid no needed changes


class Tower(Auditable):
    """
    class tp aggregate apartments or commercial stores
    """

    name = CharField(max_length=100, null=True, blank=True)
    owner = ForeignKey(User, related_name="towers", on_delete=PROTECT, null=True)


class Commercial(Unit):
    """
    commercial unit models
    """

    class CommercialTypeChoices(TextChoices):
        """
        commercial type choices
        """

        STORE = "ST", "Store"
        OFFICE = "OF", "Office"
        GAS_STATION = "GS", "Gas station"
        RESTAURANT = "RS", "Restaurant"
        COFFEE_SHOP = "CF", "Coffee shop"
        KIOSK = "KS", "Kiosk"

    number = PositiveIntegerField()
    commercial_type = CharField(
        max_length=2, choices=CommercialTypeChoices.choices, null=True, blank=False
    )
    tower = ForeignKey(Tower, related_name="tower_commercials", on_delete=DO_NOTHING, null=True)


class Villa(Unit):
    """
    villa unit model
    """

    number = PositiveIntegerField()
    has_swimming_pool = BooleanField(default=False)
    has_backyard = BooleanField(default=False)
    bedroom_count = PositiveIntegerField(default=0)
    floor_count = PositiveIntegerField(default=1)
    tower = ForeignKey(Tower, related_name="tower_villa", on_delete=DO_NOTHING, null=True)

    def __str__(self):
        return self.number


class Apartment(Unit):
    """
    apartment details
    """

    number = PositiveIntegerField()
    bedroom_count = PositiveIntegerField(default=0)
    tower = ForeignKey(Tower, related_name="tower_apartments", on_delete=DO_NOTHING, null=True)

    def __str__(self):
        return self.number


class Property(Auditable):
    """
    property model
    """

    name = CharField(max_length=200)
    owner = ForeignKey(User, related_name="properties", on_delete=PROTECT, null=True)
    address = OneToOneField(Address, on_delete=CASCADE, null=True)
    villa = OneToOneField(Villa, related_name="property", on_delete=CASCADE, null=True)
    commercial = OneToOneField(Commercial, related_name="property", on_delete=CASCADE, null=True)
    apartment = OneToOneField(Apartment, related_name="property", on_delete=CASCADE, null=True)

    def __str__(self):
        """
        str
        :return:
        :rtype:
        """
        return self.name

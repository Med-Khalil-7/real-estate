from django.db.models import CharField
from django.db.models.base import Model


class Address(Model):
    city = CharField(max_length=255)
    state = CharField(max_length=255)
    district = CharField(max_length=255)

    @property
    def full_address(self):
        """Get full name

        :return: [description]
        :rtype: [type]
        """
        return f"{self.city}, {self.state}, {self.district}"

    def __str__(self):
        return f"{self.city}, {self.state}, {self.district}"

    class Meta:
        verbose_name = "Address"

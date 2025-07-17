from django.core.validators import MinValueValidator
from django.db.models import DO_NOTHING, CharField, DateField, DecimalField, ForeignKey

from .abstract import Auditable
from .contract import ApartementContract


class Payment(Auditable):
    """money received from the tenant"""

    description = CharField(max_length=1024)
    contract = ForeignKey(
        ApartementContract, related_name="contract_payments", on_delete=DO_NOTHING
    )
    date = DateField()
    amount = DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)])

    class Meta:
        ordering = ["-date"]

    def __unicode__(self):
        return "{} - {}".format(self.date, self.amount)

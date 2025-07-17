from django.conf import settings as S
from django.db.models import FileField

from .abstract import Auditable


class Attachement(Auditable):
    path = FileField(upload_to=S.ATTACHEMENT_DIR, null=True)

    def __str__(self):
        return self.path

    class Meta:
        verbose_name = "File attachment"

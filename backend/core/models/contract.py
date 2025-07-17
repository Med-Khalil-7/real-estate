import itertools
from calendar import monthrange
from collections import deque, namedtuple
from datetime import datetime
from decimal import Decimal
from math import floor
from operator import attrgetter

from django.conf import settings
from django.core.validators import MinValueValidator

# for cashflow analytics
from django.db.models import (
    DO_NOTHING,
    BooleanField,
    CharField,
    DecimalField,
    ForeignKey,
    Max,
    Model,
    TextChoices,
    TextField,
)
from django.db.models.deletion import CASCADE, PROTECT
from django.db.models.fields import DateTimeField
from django.db.models.fields.files import FileField
from django.utils import timezone
from django.utils.timezone import make_aware

from core.models import User
from .abstract import Auditable
from .properties import Property

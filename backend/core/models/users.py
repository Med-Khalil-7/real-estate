from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db.models import BooleanField, CharField, DateTimeField, EmailField
from django.db.models.deletion import SET_NULL
from django.db.models.fields import PositiveIntegerField
from django.db.models.fields.related import OneToOneField

from core.managers import UserManager
from core.models import Address


DEPT_CHOICES = [
    ("OPERATION", "operation dept."),
    ("FINANCE", "financial dept."),
    ("AUDIT", "audit dept."),
    ("HR", "human resources dept."),
]

ID_TYPE_CHOICES = [("NA", "National"), ("IK", "Ikama"), ("PA", "Passport")]

# Cannot apply Auditabale due to circular import needed by
class User(AbstractBaseUser, PermissionsMixin):
    id_number = PositiveIntegerField(default=0)
    id_type = CharField(max_length=25, choices=ID_TYPE_CHOICES, default="NA")
    is_landlord = BooleanField(default=False)
    is_tenant = BooleanField(default=False)
    is_employee = BooleanField(default=False)
    first_name = CharField(max_length=100, null=True, blank=True)
    last_name = CharField(max_length=100, null=True, blank=True)
    email = EmailField(max_length=255, unique=True)
    is_staff = BooleanField(default=False)
    is_active = BooleanField(default=True)
    address = OneToOneField(Address, on_delete=SET_NULL, null=True)
    phone_number = CharField(
        max_length=100, null=True, blank=True
    )  # @mzekri-madar see https://github.com/stefanfoulis/django-phonenumber-field
    gender = CharField(max_length=10, choices=[("M", "Male"), ("F", "Female"),], null=True,)
    # Employee stuff
    title = CharField(max_length=255, null=True, blank=True)
    department = CharField(max_length=25, choices=DEPT_CHOICES, null=True, blank=True)
    hire_date = DateTimeField(null=True)
    start_date = DateTimeField(null=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

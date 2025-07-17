"""
query managers
"""
from datetime import date

from django.contrib.auth.models import BaseUserManager
from django.db import models
from django.db.models import Sum


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, **kwargs):
        user = self.create_user(**kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class TotalQuerySetMixin(object):
    """

    """

    def _get_total(self, prop):
        """

        :param prop:
        :type prop:
        :return:
        :rtype:
        """
        return self.aggregate(sum=Sum(prop))["sum"]

    def total_paid(self):
        """

        :return:
        :rtype:
        """
        return self._get_total("payments__amount")


class InvoiceQuerySetMixin(object):
    """

    """

    def dued(self):
        """

        :return:
        :rtype:
        """
        return self.filter(date_dued__lte=date.today())


class EstimateQuerySet(TotalQuerySetMixin, models.QuerySet):
    pass


class InvoiceQuerySet(TotalQuerySetMixin, InvoiceQuerySetMixin, models.QuerySet):
    """

    """

    def turnover_excl_tax(self):
        """

        :return:
        :rtype:
        """
        return self._get_total("total_excl_tax")

    def turnover_incl_tax(self):
        """

        :return:
        :rtype:
        """
        return self._get_total("total_incl_tax")


class BillQuerySet(TotalQuerySetMixin, InvoiceQuerySetMixin, models.QuerySet):
    """

    """

    def debts_excl_tax(self):
        """

        :return:
        :rtype:
        """
        return self._get_total("total_excl_tax")

    def debts_incl_tax(self):
        """

        :return:
        :rtype:
        """
        return self._get_total("total_incl_tax")


class ExpenseClaimQuerySet(TotalQuerySetMixin, InvoiceQuerySetMixin, models.QuerySet):
    def debts_excl_tax(self):
        """

        :return:
        :rtype:
        """
        return self._get_total("total_excl_tax")

    def debts_incl_tax(self):
        """

        :return:
        :rtype:
        """
        return self._get_total("total_incl_tax")

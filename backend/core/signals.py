"""
model event handling
"""

from django.db.models.signals import post_save
from django.dispatch import Signal, receiver

from core.exceptions import UserHasBuilding, UserHasContract
from core.models import UnitContract, User
from core.models.abstract import Auditable


update_auditables = Signal(providing_args=["user"])


# make sure that signals do not interfere with each other


@receiver(update_auditables)
def update_auditables_handler(sender, instance, **kwargs):
    """
    update auditables handler.
    :param sender:
    :type sender:
    :param instance:
    :type instance:
    :param kwargs:
    :type kwargs:
    :return:
    :rtype:
    """
    if not issubclass(sender, Auditable):
        return

    user = kwargs["user"]
    instance.updated_by = user

    if instance.id is None:
        instance.created_by = user


update_auditables = Signal(providing_args=["user"])


@receiver(update_auditables)
def update_auditables_handler(sender, instance, **kwargs):
    """
    update_auditables_handler.
    :param sender:
    :type sender:
    :param instance:
    :type instance:
    :param kwargs:
    :type kwargs:
    :return:
    :rtype:
    """
    if not issubclass(sender, Auditable):
        return

    user = kwargs["user"]
    instance.updated_by = user

    if instance.id is None:
        instance.created_by = user


@receiver(post_save, sender=UnitContract)
def change_apartment_vacancy(instance, **kwargs):
    """
    change apartment vacancy if contract is signed or terminated
    :param instance:
    :type instance:
    :return:
    :rtype:
    """

    prop = instance.property  # get contract property
    if instance.state == "S":
        if prop.apartment:
            prop.apartment.set_as_occupied()
        if prop.commercial:
            prop.commercial.set_as_occupied()
        if prop.villa:
            prop.villa.set_as_occupied()

    if instance.state == "T":
        if prop.apartment:
            prop.apartment.set_as_vacant()
        if prop.commercial:
            prop.commercial.set_as_vacant()
        if prop.villa:
            prop.villa.set_as_vacant()


@receiver(post_save, sender=UnitContract)
def sign_contract(instance, **kwargs):
    """
    change apartment vacancy if contract is signed or terminated
    :param instance:
    :type instance:
    :return:
    :rtype:
    """
    # calling instance.save() will trigger an infinite loop
    if (
        instance.is_confirmed_by_admin
        and instance.is_confirmed_by_tenant
        and instance.is_confirmed_by_landlord
    ):
        UnitContract.objects.filter(pk=instance.pk).update(state="S")


@receiver(post_save, sender=User)
def prevent_role_disable(instance, created, **kwargs):
    """
    prevent role disable if user has contracts or owns a building

    :param instance: [description]
    :type instance: [type]
    :param created: [description]
    :type created: [type]
    :raises UserHasBuilding: [description]
    :raises UserHasContract: [description]
    """
    if not created:
        if not instance.is_landlord:
            if instance.properties.count() > 0:
                raise UserHasBuilding

        if not instance.is_tenant:
            if instance.tenant_contracts.count() > 0:
                raise UserHasContract

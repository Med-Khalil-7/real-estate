"""Celery tasks"""

from datetime import date, timedelta
from smtplib import SMTPException

from django.conf import settings
from django.core import management
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Q
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from celery.utils.log import get_logger
from core.models import Invoice, InvoiceLine, MailHistory, UnitContract, User
from core.tokens import account_activation_token
from core.utils.number_generators import InvoiceNumberGenerator
from real_estate import celery_app


logger = get_logger(__name__)


def send_reminder(tenant, landlord, contract):
    """
    send reminder email

    :param tenant: [description]
    :type tenant: [type]
    :param landlord: [description]
    :type landlord: [type]
    :param contract: [description]
    :type contract: [type]
    """
    to_email = tenant.email
    try:
        mail_subject = "Rent payment call."
        message = render_to_string("rentcall_reminder.html", {"contract": contract, "amount": ""})
        send_mail(mail_subject, message, settings.SERVER_EMAIL, [to_email], fail_silently=False)
        MailHistory.objects.create(delivery_state="S", sender=tenant, receiver=tenant)
        logger.info("Payment reminder mail to %s is sent!", to_email)
    except SMTPException as exception:
        MailHistory.objects.create(delivery_state="F", sender=landlord, receiver=tenant)
        logger.error("Failed to send mail to %s . reason %s.", to_email, exception)


@celery_app.task
def clearsessions():
    management.call_command("clearsessions")


@celery_app.task
def bulk_reminder_email(user_id):
    """
    manual payment reminder task

    :param user_id:
    :type user_id:
    :return:
    :rtype:
    """
    try:
        user = User.objects.get(pk=user_id)  # Get user
        contracts = []
        if user.is_superuser:  # if superuser get all contracts
            contracts = UnitContract.objects.filter(
                Q(state="S")  # & ~Q(payment__date__month=current_month)
            )
        elif user.is_landlord:  # if landlord own tenants
            contracts = UnitContract.objects.filter(
                Q(state="S")
                & Q(property__owner=user)
                # & ~Q(payment__date__month=current_month)
            )
        for contract in contracts:
            landlord = contract.property.owner
            tenant = contract.tenant  # receiver
            send_reminder(tenant, landlord, contract)
        logger.info("Task complete!")
    except User.DoesNotExist:
        logger.error("User does not exist!")
    except Exception as exception:
        logger.error("Bulk reminder email task failed %s!", exception)


@celery_app.task
def scheduled_payment_reminder():
    """
    payment scheduled tasks
    :return:
    :rtype:
    """
    today = date.today()
    logger.info("Task scheduled_payment_reminder fired.")
    with transaction.atomic():  # atomic context
        logger.info("In atomic context.")
        # fetch all signed contracts and compare day
        try:
            # TODO: filter the not payed contract
            contracts = UnitContract.objects.filter(Q(state="S"))
            logger.info("contract count %s", len(contracts))
            for contract in contracts:
                # get contract date and compare it to today
                tenant = contract.tenant
                landlord = contract.property.owner
                start_date = contract.start_date.date()
                if start_date == today:
                    tax_rate = contract.tax_rate
                    amount = contract.location_price

                    # create a invoice
                    invoice = Invoice()
                    invoice.contract = contract
                    invoice.tenant = tenant
                    invoice.date_issued = today
                    invoice.date_dued = today + timedelta(days=30)
                    invoice.number = InvoiceNumberGenerator().next_number(contract)
                    invoice.save()
                    # create a invoice line
                    invoice_line = InvoiceLine()
                    invoice_line.invoice = invoice
                    invoice_line.tax_rate = tax_rate
                    invoice_line.label = "rent"
                    invoice_line.unit_price_excl_tax = amount
                    invoice_line.save()
                    # send email
                    send_reminder(tenant, landlord, contract)  # Send email
                logger.info("Task complete!")
        except Exception as exception:
            logger.error("Bulk reminder email task failed %s!", exception)


@celery_app.task
def send_contract_sign_confirmation(domain, contract_id, user_id):
    """"
    - get receiver
    - get token
    - get route domain
    - generate mail
    - send mail
    """
    try:
        mail_subject = "Contract sign confirmation."
        confirmation_url = settings.FRONTEND_CONTRACT_SIGN_CONFIRMATION_ROUTE
        user = User.objects.get(pk=user_id)
        logger.info("USER_ID %s USER PK %s!", user_id, user.pk)
        message = render_to_string(
            "sign_confirmation.html",
            {
                "domain": domain,
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "route": confirmation_url,
                "token": account_activation_token.make_token(user),
                "contract_id": contract_id,
            },
        )
        send_mail(mail_subject, message, settings.SERVER_EMAIL, [user.email], fail_silently=False)
        logger.info("Contract sign confirmation mail to %s is sent!", user.email)
    except SMTPException as exception:
        logger.error("Failed to send mail. reason %s.", exception)

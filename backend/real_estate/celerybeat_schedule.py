from celery.schedules import crontab  # pylint:disable=import-error,no-name-in-module


CELERYBEAT_SCHEDULE = {
    # Internal tasks
    "scheduled_payment_reminder": {
        "task": "core.tasks.scheduled_payment_reminder",
        "schedule": crontab(minute=1, hour=0),  # everyday at midnight
    }
}

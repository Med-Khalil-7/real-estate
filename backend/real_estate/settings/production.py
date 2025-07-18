import sentry_sdk
from decouple import Csv
from sentry_sdk.integrations.django import DjangoIntegration

from .base import *  # noqa

DEBUG = False

SECRET_KEY = config("SECRET_KEY")

DATABASES["default"]["ATOMIC_REQUESTS"] = True

ALLOWED_HOSTS = config("ALLOWED_HOSTS", cast=Csv())

STATIC_ROOT = base_dir_join("staticfiles")
STATIC_URL = "/static/"

MEDIA_ROOT = base_dir_join("mediafiles")
MEDIA_URL = "/media/"

ADMIN_EMAIL = config("ADMIN_EMAIL", "")
SERVER_EMAIL = config("SERVER_EMAIL", "")
EMAIL_HOST = "smtp.sendgrid.net"
EMAIL_HOST_USER = config("SENDGRID_USERNAME")
EMAIL_HOST_PASSWORD = config("SENDGRID_PASSWORD")
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# Security
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = config("SECURE_HSTS_SECONDS", default=3600, cast=int)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

# Webpack
WEBPACK_LOADER["DEFAULT"]["CACHE"] = True

# Celery
CELERY_BROKER_URL = config("REDIS_URL", default="")
CELERY_RESULT_BACKEND = config("REDIS_URL", default="")
CELERY_SEND_TASK_ERROR_EMAILS = True

import ssl

if CELERY_BROKER_URL.startswith("rediss://"):
    broker_use_ssl = {"ssl_cert_reqs": ssl.CERT_NONE}
    redis_backend_use_ssl = {"ssl_cert_reqs": ssl.CERT_NONE}
else:
    broker_use_ssl = None
    redis_backend_use_ssl = None

CELERY_BROKER_USE_SSL = broker_use_ssl
CELERY_REDIS_BACKEND_USE_SSL = redis_backend_use_ssl

# Redbeat https://redbeat.readthedocs.io/en/latest/config.html#redbeat-redis-url
redbeat_redis_url = config("CELERY_BROKER_URL", default="")

# Whitenoise
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# django-log-request-id
MIDDLEWARE.insert(  # insert RequestIDMiddleware on the top
    0, "log_request_id.middleware.RequestIDMiddleware"
)

LOG_REQUEST_ID_HEADER = "HTTP_X_REQUEST_ID"
LOG_REQUESTS = True

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "require_debug_false": {"()": "django.utils.log.RequireDebugFalse"},
        "request_id": {"()": "log_request_id.filters.RequestIDFilter"},
    },
    "formatters": {
        "standard": {
            "format": "%(levelname)-8s [%(asctime)s] [%(request_id)s] %(name)s: %(message)s"
        },
    },
    "handlers": {
        "null": {
            "class": "logging.NullHandler",
        },
        "mail_admins": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "filters": ["require_debug_false"],
        },
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "filters": ["request_id"],
            "formatter": "standard",
        },
    },
    "loggers": {
        "": {"handlers": ["console"], "level": "INFO"},
        "django.security.DisallowedHost": {
            "handlers": ["null"],
            "propagate": False,
        },
        "django.request": {
            "handlers": ["mail_admins"],
            "level": "ERROR",
            "propagate": True,
        },
        "log_request_id.middleware": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}

JS_REVERSE_EXCLUDE_NAMESPACES = ["admin"]

# Sentry
sentry_sdk.init(dsn=SENTRY_DSN, integrations=[DjangoIntegration()], release=COMMIT_SHA)

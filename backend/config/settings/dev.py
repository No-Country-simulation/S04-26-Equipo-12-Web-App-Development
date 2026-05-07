from config.settings import BASE_DIR

from .base import *

DEBUG = True

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "db",
        "USER": "postgres",
        "PASSWORD": "tu_password",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
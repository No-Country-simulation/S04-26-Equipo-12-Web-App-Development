from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        OPERATOR = 'OPERATOR'
        SUPERVISOR = 'SUPERVISOR'
        MANAGER = 'MANAGER'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.OPERATOR
    )

    phone = models.CharField(max_length=20, blank=True)
    employee_code = models.CharField(max_length=50, unique=True, null=True, blank=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.role}'
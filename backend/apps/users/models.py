from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        OPERATOR = 'OPERATOR', 'Operator'
        SUPERVISOR = 'SUPERVISOR', 'Supervisor'
        MANAGER = 'MANAGER', 'Manager'

    email = models.EmailField(unique=True, verbose_name='Email')

    area = models.ForeignKey(
        'incidents.Area',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        verbose_name='Area',
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.OPERATOR,
        verbose_name='Role'
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Phone number'
    )

    employee_code = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
        verbose_name='Employee code'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD  = 'email'

    username = None
    is_staff = None
    is_superuser = None
    last_login = None

    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def role_label(self) -> str:
        return self.Role(self.role).label

    def __str__(self):
        return f'{self.get_full_name()} ({self.role_label()})'

    @property
    def is_operator(self) -> bool:
        return self.role == self.Role.OPERATOR

    @property
    def is_supervisor(self) -> bool:
        return self.role == self.Role.SUPERVISOR

    @property
    def is_manager(self) -> bool:
        return self.role == self.Role.MANAGER
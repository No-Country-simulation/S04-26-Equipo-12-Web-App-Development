from django.conf import settings
from django.db import models


class Area(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'areas'

    def __str__(self):
        return self.name


class IncidentType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'incident_types'

    def __str__(self):
        return self.name


class Machine(models.Model):
    area = models.ForeignKey(
        Area,
        related_name='machines',
        on_delete=models.PROTECT
    )
    name = models.CharField(max_length=150)
    machine_code = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'machines'

    def __str__(self):
        return f'{self.machine_code} - {self.name}'


class Incident(models.Model):
    class Status(models.TextChoices):
        OPEN = 'OPEN'
        IN_PROGRESS = 'IN_PROGRESS'
        CLOSED = 'CLOSED'
        CANCELLED = 'CANCELLED'

    class Priority(models.TextChoices):
        LOW = 'LOW'
        MEDIUM = 'MEDIUM'
        HIGH = 'HIGH'
        CRITICAL = 'CRITICAL'

    area = models.ForeignKey(
        Area,
        related_name='incidents',
        on_delete=models.PROTECT
    )
    machine = models.ForeignKey(
        Machine,
        related_name='incidents',
        null=True,
        blank=True,
        on_delete=models.PROTECT
    )
    type = models.ForeignKey(
        IncidentType,
        related_name='incidents',
        on_delete=models.PROTECT
    )
    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='reported_incidents',
        on_delete=models.PROTECT
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="assigned_incidents",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    root_cause = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'incidents'
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.status}] {self.title}'

    @property
    def resolution_time_minutes(self):
        if not self.resolved_at:
            return None

        resolution_time = self.resolved_at - self.created_at
        return int(resolution_time.total_seconds() / 60)


class IncidentAssignment(models.Model):
    incident = models.ForeignKey(
        Incident,
        related_name='assignments',
        on_delete=models.CASCADE
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='incident_assignments',
        on_delete=models.PROTECT
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='assigned_incidents_by_me',
        on_delete=models.PROTECT
    )
    notes = models.TextField(blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_current = models.BooleanField(default=True)

    class Meta:
        db_table = 'incident_assignments'


class Resolution(models.Model):
    incident = models.OneToOneField(
        Incident,
        related_name='resolution',
        on_delete=models.CASCADE
    )
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='resolutions',
        on_delete=models.PROTECT
    )
    description = models.TextField()
    root_cause_confirmed = models.TextField(blank=True)
    resolved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resolutions'


class IncidentLog(models.Model):
    incident = models.ForeignKey(
        Incident,
        related_name='logs',
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='incident_logs',
        on_delete=models.PROTECT
    )
    previous_status = models.CharField(
        max_length=20,
        choices=Incident.Status.choices,
        null=True,
        blank=True
    )
    new_status = models.CharField(
        max_length=20,
        choices=Incident.Status.choices
    )
    action = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'incident_logs'
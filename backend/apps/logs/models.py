from django.conf import settings
from django.db import models
from ..incidents.models import Incident
from ..users.models import CustomUser

class IncidentLog(models.Model):
    ACTION_CREATE = 'CREATE'
    ACTION_ASSINGN = 'ASSIGN'
    ACTION_REASSING = 'REASSIGN'
    ACTION_STATUS_CHANGE = 'STATUS_CHANGE'
    ACTION_UPDATE = 'UPDATE'
    ACTION_CLOSE = 'CLOSE'

    ACTION_CHOICES = [
        (ACTION_CREATE, 'creacion'),
        (ACTION_ASSINGN, 'asignacion'),
        (ACTION_REASSING, 'reasignacion'),
        (ACTION_STATUS_CHANGE, 'cambio de estado'),
        (ACTION_UPDATE, 'actualizacion'),
        (ACTION_CLOSE, 'cierre')
    ]

    incident = models.ForeignKey(
        Incident,
        related_name= 'activity_logs',
        on_delete= models.CASCADE
    )

    user = models.ForeignKey(
        CustomUser,
        related_name= 'activity_logs',
        on_delete= models.PROTECT
    )

    action = models.CharField(
        max_length=20,
        choices= ACTION_CHOICES
    )

    #campo para guardar el estado anterior cuando cambie
    previous_status = models.CharField(
        max_length=20,
        choices= Incident.Status,
        null = True,
        blank = True
    )

    new_status = models.CharField(
        max_length=20,
        choices= Incident.Status,
        null = True,
        blank = True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
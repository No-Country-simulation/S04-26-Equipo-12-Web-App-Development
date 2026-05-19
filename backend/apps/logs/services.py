from apps.incidents.models import Incident
from apps.logs.models import IncidentLog

def log_incident_created(incident: Incident, user) -> IncidentLog:
    return IncidentLog.objects.create(
        incident=incident,
        user= user,
        action = IncidentLog.ACTION_CREATE,
        previous_status = None,
        new_status = incident.status
    )

def log_incident_assigned(incident: Incident, user) -> IncidentLog:
    return IncidentLog.objects.create(
        incident=incident,
        user= user,
        action = IncidentLog.ACTION_ASSINGN,
        previous_status = Incident.Status.OPEN,
        new_status = Incident.Status.IN_PROGRESS
    )

def log_incident_reassigned(incident: Incident, user) -> IncidentLog:
    return IncidentLog.objects.create(
        incident= incident,
        user=user,
        action= IncidentLog.ACTION_REASSING,
        previous_status= Incident.Status.IN_PROGRESS,
    )


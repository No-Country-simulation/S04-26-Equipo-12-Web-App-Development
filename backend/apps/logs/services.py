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
    return Incident.objects.create(
        incident=incident,
        user= user,
        action = IncidentLog.ACTION_ASSINGN,
        previous_status = Incident.STATUS_OPEN,
        new_status = Incident.STATUS_IN_PROGRESS
    )

def log_incident_reassigned(incident: Incident, user) -> IncidentLog:
    return IncidentLog.objects.create(
        incident= incident,
        user=user,
        action= IncidentLog.ACTION_REASSING,
        previous_satatus= Incident.STATUS_IN_PROGRESS
    )


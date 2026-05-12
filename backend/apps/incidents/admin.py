from django.contrib import admin
from .models import (
  Area,
  IncidentType,
  Machine,
  Incident,
  IncidentAssignment,
  Resolution,
  IncidentLog
)

admin.site.register(Area)
admin.site.register(IncidentType)
admin.site.register(Machine)
admin.site.register(Incident)
admin.site.register(IncidentAssignment)
admin.site.register(Resolution)
admin.site.register(IncidentLog)

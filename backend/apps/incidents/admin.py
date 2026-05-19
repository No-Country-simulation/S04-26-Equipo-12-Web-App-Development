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

@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "is_active", "created_at")
    search_fields = ("name", "description")
    list_filter = ("is_active",)


@admin.register(IncidentType)
class IncidentTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "is_active", "created_at")
    search_fields = ("name", "description")
    list_filter = ("is_active",)


@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = ("id", "machine_code", "name", "area", "is_active", "created_at")
    search_fields = ("machine_code", "name")
    list_filter = ("area", "is_active")


@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "status",
        "priority",
        "area",
        "machine",
        "reported_by",
        "assigned_to",
        "created_at",
        "resolved_at",
    )
    search_fields = ("title", "description", "root_cause", "solution")
    list_filter = ("status", "priority", "area", "machine", "created_at")
    ordering = ("-created_at",)


@admin.register(IncidentAssignment)
class IncidentAssignmentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "incident",
        "assigned_to",
        "assigned_by",
        "assigned_at",
        "is_current",
    )
    search_fields = ("incident__title", "assigned_to__username", "assigned_by__username")
    list_filter = ("is_current", "assigned_at")


@admin.register(Resolution)
class ResolutionAdmin(admin.ModelAdmin):
    list_display = ("id", "incident", "resolved_by", "resolved_at")
    search_fields = ("incident__title", "description", "root_cause_confirmed")
    list_filter = ("resolved_at",)


@admin.register(IncidentLog)
class IncidentLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "incident",
        "user",
        "previous_status",
        "new_status",
        "action",
        "created_at",
    )
    search_fields = ("incident__title", "user__username", "action")
    list_filter = ("previous_status", "new_status", "created_at")


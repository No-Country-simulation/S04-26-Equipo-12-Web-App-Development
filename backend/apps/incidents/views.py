from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.timezone import now
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.exceptions import ValidationError
from core.permissions import IsAssignedToIncident, IsOperator, IsSupervisor
from .models import Incident
from .serializers import (
    IncidentAssignSerializer,
    IncidentCloseSerializer,
    IncidentCreateSerializer,
    IncidentDetailSerializer,
    IncidentUpdateSerializer,
    IncidentStatusUpdateSerializer,
)
from apps.logs.services import (
    log_incident_assigned,
    log_incident_closed,
    log_incident_created,
    log_incident_reassigned,
    log_incident_updated,
    log_status_change,
)


class IncidentViewSet(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    GenericViewSet,
):
    """
    ViewSet para administrar el ciclo de vida de incidencias.

    Endpoints principales:
    - POST  /api/v1/incidents/
    - GET   /api/v1/incidents/
    - GET   /api/v1/incidents/{id}/
    - PATCH /api/v1/incidents/{id}/assign/
    - PATCH /api/v1/incidents/{id}/update-info/
    - PATCH /api/v1/incidents/{id}/change-status/
    - PATCH /api/v1/incidents/{id}/close/
    """

    queryset = (
        Incident.objects
        .select_related(
            "reported_by",
            "assigned_to",
            "area",
            "machine",
            "type",
        )
    )

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
    ]

    filterset_fields = [
        "status",
        "priority",
        "area",
        "machine",
        "type",
    ]

    ordering_fields = [
        "created_at",
        "resolved_at",
        "priority",
        "status",
    ]

    ordering = [
        "-created_at",
    ]

    http_method_names = [
        "get",
        "post",
        "patch",
        "head",
        "options",
    ]

    def get_permissions(self):
        supervisor_actions = [
            "assign",
            "update_info",
            "close",
        ]
        
        if self.action == "create":
            return [IsAuthenticated(), IsOperator()]

        if self.action == "change_status":
            return [IsAuthenticated(), IsAssignedToIncident()]
        
        if self.action in supervisor_actions:
            return [IsAuthenticated(), IsSupervisor()]

        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action == "list":
            return queryset.filter(assigned_to=self.request.user)

        return queryset

    def get_serializer_class(self):
        serializer_map = {
            "create": IncidentCreateSerializer,
            "assign": IncidentAssignSerializer,
            "update_info": IncidentUpdateSerializer,
            "change_status": IncidentStatusUpdateSerializer,
            "close": IncidentCloseSerializer,
        }

        return serializer_map.get(self.action, IncidentDetailSerializer)

    def perform_create(self, serializer):
        incident = serializer.save(
            reported_by = self.request.user,
            status = Incident.Status.OPEN,
        )

        log_incident_created(
        incident = incident,
        user = self.request.user,
    )

    def _raise_drf_validation_error(self, error):
        raise ValidationError(error.message_dict if hasattr(error, "message_dict") else error.messages)

    @action(
        detail = True,
        methods = ["patch"],
        url_path = "assign",
    )
    def assign(self, request, pk=None):
        """
        Asigna o reasigna un responsable a una incidencia.

        Si la incidencia está OPEN, pasa automáticamente a IN_PROGRESS.
        No permite reasignar incidencias cerradas.
        """
        incident = self.get_object()

        try:
            incident.validate_can_be_reassigned()
        except DjangoValidationError as error:
            self._raise_drf_validation_error(error)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        previous_status = incident.status
        was_unassigned = incident.assigned_to_id is None

        incident.assigned_to = serializer.validated_data["assigned_to"]

        if incident.status == Incident.Status.OPEN:
            incident.validate_status_transition(Incident.Status.IN_PROGRESS)
            incident.status = Incident.Status.IN_PROGRESS

        incident.save(
            update_fields = [
                "assigned_to",
                "status",
                "updated_at",
            ]
        )

        if was_unassigned:
            log_incident_assigned(
                incident = incident,
                user = request.user,
            )
        else:
            log_incident_reassigned(
                incident = incident,
                user = request.user,
            )

        return Response(
            IncidentDetailSerializer(incident).data,
            status = status.HTTP_200_OK,
        )

    @action(
        detail = True,
        methods = ["patch"],
        url_path = "update-info",
    )
    def update_info(self, request, pk=None):
        """
        Amplía o modifica información básica de una incidencia.

        Campos permitidos:
        - priority
        - description
        - area
        """
        incident = self.get_object()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        updated_fields = []

        for field, value in serializer.validated_data.items():
            setattr(incident, field, value)
            updated_fields.append(field)

        updated_fields.append("updated_at")

        incident.save(update_fields=updated_fields)

        log_incident_updated(
            incident = incident,
            user = request.user,
        )

        return Response(
            IncidentDetailSerializer(incident).data,
            status = status.HTTP_200_OK,
        )

    @action(
        detail = True,
        methods = ["patch"],
        url_path = "change-status",
    )
    def change_status(self, request, pk=None):
        """
        Cambia el estado operativo de una incidencia.

        Transiciones permitidas:
        - OPEN -> IN_PROGRESS
        - IN_PROGRESS -> OPEN
        - IN_PROGRESS -> CLOSED
        - OPEN -> CLOSED
        - CLOSED -> sin transiciones
        """
        incident = self.get_object()

        serializer = self.get_serializer(
            data = request.data,
            context = {"incident": incident},
        )
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data["status"]
        previous_status = incident.status

        try:
            incident.validate_status_transition(new_status)
        except DjangoValidationError as error:
            self._raise_drf_validation_error(error)

        incident.status = new_status

        incident.save(
            update_fields = [
                "status",
                "updated_at",
            ]
        )

        log_status_change(
            incident = incident,
            user = request.user,
            previous_status = previous_status,
            new_status = incident.status,
        )

        return Response(
            IncidentDetailSerializer(incident).data,
            status = status.HTTP_200_OK,
        )

    @action(
        detail = True,
        methods = ["patch"],
        url_path = "close",
    )
    def close(self, request, pk=None):
        """
        Cierra formalmente una incidencia.

        Requiere:
        - root_cause
        - solution

        Al cerrar:
        - status = CLOSED
        - resolved_at = now()
        """
        incident = self.get_object()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            incident.validate_status_transition(Incident.Status.CLOSED)
        except DjangoValidationError as error:
            self._raise_drf_validation_error(error)

        incident.root_cause = serializer.validated_data["root_cause"]
        incident.solution = serializer.validated_data["solution"]
        incident.status = Incident.Status.CLOSED
        incident.resolved_at = now()

        incident.save(
            update_fields = [
                "root_cause",
                "solution",
                "status",
                "resolved_at",
                "updated_at",
            ]
        )

        log_incident_closed(
            incident = incident,
            user = request.user,
        )

        return Response(
            IncidentDetailSerializer(incident).data,
            status = status.HTTP_200_OK,
        )
    
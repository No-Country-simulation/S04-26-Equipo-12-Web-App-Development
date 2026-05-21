from django.utils.timezone import now
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from core.permissions import IsAssignedToIncident, IsOperator

from .models import Incident
from .serializers import (
    IncidentCreateSerializer,
    IncidentDetailSerializer,
    IncidentStatusUpdateSerializer,
)


class IncidentViewSet(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    GenericViewSet,
):
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
        if self.action == "create":
            return [IsAuthenticated(), IsOperator()]

        if self.action == "change_status":
            return [IsAuthenticated(), IsAssignedToIncident()]

        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action == "list":
            return queryset.filter(assigned_to=self.request.user)

        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return IncidentCreateSerializer

        if self.action == "change_status":
            return IncidentStatusUpdateSerializer

        return IncidentDetailSerializer

    def perform_create(self, serializer):
        serializer.save(
            reported_by=self.request.user,
            status=Incident.Status.OPEN,
        )

    @action(
        detail=True,
        methods=["patch"],
        url_path="change-status",
    )
    def change_status(self, request, pk=None):
        incident = self.get_object()

        serializer = self.get_serializer(
            data=request.data,
            context={"incident": incident},
        )
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data["status"]

        incident.status = new_status

        if new_status == Incident.Status.CLOSED:
            incident.resolved_at = now()
        else:
            incident.resolved_at = None

        incident.save(
            update_fields=[
                "status",
                "resolved_at",
                "updated_at",
            ]
        )

        return Response(IncidentDetailSerializer(incident).data)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import Incident
from .serializers import (
    IncidentCreateSerializer,
    IncidentDetailSerializer,
)


class IncidentViewSet(ModelViewSet):
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

    permission_classes = [IsAuthenticated]

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
        "head",
        "options",
    ]

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action == "list":
            return queryset.filter(assigned_to=self.request.user)

        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return IncidentCreateSerializer

        return IncidentDetailSerializer

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

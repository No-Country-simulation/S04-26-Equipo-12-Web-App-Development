from rest_framework import serializers

from apps.users.serializers import UserSummarySerializer

from .models import (
    Area,
    IncidentType,
    Machine,
    Incident,
    IncidentAssignment,
    Resolution,
)


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = [
            "id",
            "name",
            "description",
        ]


class IncidentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentType
        fields = [
            "id",
            "name",
            "description",
        ]


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = [
            "id",
            "name",
            "machine_code",
            "area",
        ]


class IncidentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = [
            'title',
            'description',
            'area',
            'machine',
            'type',
            'priority'
            ]


class IncidentAssignSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentAssignment
        fields = [
            'assigned_to',
            'notes'
            ]

    def validate_assigned_to(self, user):
        if user.role != 'OPERATOR':
            raise serializers.ValidationError(
                'El responsable asignado debe tener rol OPERATOR.'
            )
        return user


class IncidentStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=[
            Incident.Status.OPEN,
            Incident.Status.IN_PROGRESS,
            Incident.Status.CLOSED,
        ]
    )

    def validate_status(self, value):
        incident = self.context["incident"]

        if incident.status == value:
            raise serializers.ValidationError(
                "El incidente ya se encuentra en ese estado."
            )

        return value


class IncidentResolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resolution
        fields = [
            'description',
            'root_cause_confirmed'
        ]


class IncidentDetailSerializer(serializers.ModelSerializer):
    reported_by = UserSummarySerializer(read_only=True)
    assigned_to = UserSummarySerializer(read_only=True)
    area = AreaSerializer(read_only=True)
    machine = MachineSerializer(read_only=True)
    type = IncidentTypeSerializer(read_only=True)
    resolution_time_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Incident
        fields = '__all__'

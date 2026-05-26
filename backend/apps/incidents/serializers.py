from rest_framework import serializers
from apps.users.models import CustomUser
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


class IncidentAssignSerializer(serializers.Serializer):
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all()
    )

    def validate_assigned_to(self, user):
        valid_roles = [
            CustomUser.Role.OPERATOR,
            CustomUser.Role.SUPERVISOR,
        ]

        if user.role not in valid_roles:
            raise serializers.ValidationError(
                "El usuario asignado debe tener rol OPERATOR o SUPERVISOR."
            )

        return user


class IncidentUpdateSerializer(serializers.Serializer):
    priority = serializers.ChoiceField(
        choices=Incident.Priority.choices,
        required=False,
    )
    description = serializers.CharField(
        required=False,
        allow_blank=False,
    )
    area = serializers.PrimaryKeyRelatedField(
        queryset=Area.objects.all(),
        required=False,
    )

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError(
                "Debe enviar al menos un campo para actualizar."
            )

        return attrs


class IncidentStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=[
            Incident.Status.OPEN,
            Incident.Status.IN_PROGRESS,
        ]
    )

    def validate_status(self, value):
        incident = self.context["incident"]

        if incident.status == value:
            raise serializers.ValidationError(
                "El incidente ya se encuentra en ese estado."
            )

        return value


class IncidentCloseSerializer(serializers.Serializer):
    root_cause = serializers.CharField(
        required=True,
        allow_blank=False,
    )
    solution = serializers.CharField(
        required=True,
        allow_blank=False,
    )


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

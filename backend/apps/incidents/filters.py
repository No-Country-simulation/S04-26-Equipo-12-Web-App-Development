import django_filters
from .models import Incident


class IncidentFilter(django_filters.FilterSet):
    created_at__gte = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
    )
    created_at__lte = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
    )
    assigned_to = django_filters.NumberFilter(
        field_name="assigned_to_id",
    )

    class Meta:
        model = Incident
        fields = [
            "status",
            "priority",
            "area",
            "assigned_to",
        ]

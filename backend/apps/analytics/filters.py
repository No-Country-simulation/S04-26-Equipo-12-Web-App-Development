import django_filters

from apps.incidents.models import Incident


class IncidentReportFilter(django_filters.FilterSet):
    area = django_filters.NumberFilter(field_name='area_id')
    type = django_filters.NumberFilter(field_name='type_id')
    status = django_filters.CharFilter(field_name='status')
    priority = django_filters.CharFilter(field_name='priority')
    start_date = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    end_date = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Incident
        fields = ['area', 'type', 'status', 'priority', 'start_date', 'end_date']

from rest_framework import serializers


class AvgResponseTimeSerializer(serializers.Serializer):
    area_name = serializers.CharField()
    avg_minutes = serializers.FloatField()


class AvgResolutionTimeSerializer(serializers.Serializer):
    area_name = serializers.CharField()
    avg_minutes = serializers.FloatField()


class ResolutionRateSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    closed = serializers.IntegerField()
    rate = serializers.FloatField()


class IncidentsByAreaSerializer(serializers.Serializer):
    area_name = serializers.CharField()
    count = serializers.IntegerField()


class RootCauseFrequencySerializer(serializers.Serializer):
    type_name = serializers.CharField()
    root_cause = serializers.CharField()
    count = serializers.IntegerField()


class CriticalIncidentsOverTimeSerializer(serializers.Serializer):
    date = serializers.CharField()
    count = serializers.IntegerField()


class MetricsSummarySerializer(serializers.Serializer):
    avg_response_time = AvgResponseTimeSerializer(many=True)
    avg_resolution_time = AvgResolutionTimeSerializer(many=True)
    resolution_rate = ResolutionRateSerializer()
    incidents_by_area = IncidentsByAreaSerializer(many=True)
    root_cause_frequency = RootCauseFrequencySerializer(many=True)
    critical_incidents_over_time = CriticalIncidentsOverTimeSerializer(many=True)

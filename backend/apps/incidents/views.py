from django.shortcuts import render

# Create your views here.

class IncidentViewSet(ModelViewSet):
    queryset = (
        Incident.objects
        .select_related('reported_by', 'area', 'machine', 'type')
        .prefetch_related('assignments')
    )
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = IncidentFilter
    ordering_fields = ['created_at', 'priority', 'status']

    def get_permissions(self):
        permission_map = {
            'create':  [IsAuthenticated, IsOperator],
            'assign':  [IsAuthenticated, IsSupervisor],
            'resolve': [IsAuthenticated, IsOperator],
            'list':    [IsAuthenticated, IsSupervisorOrManager],
        }
        permission_classes = permission_map.get(self.action, [IsAuthenticated])
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        serializer_map = {
            'create':  IncidentCreateSerializer,
            'assign':  IncidentAssignSerializer,
            'resolve': IncidentResolveSerializer,
        }
        return serializer_map.get(self.action, IncidentDetailSerializer)

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        incident = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        IncidentAssignment.objects.filter(
            incident=incident,
            is_current=True
        ).update(is_current=False)

        IncidentAssignment.objects.create(
            incident=incident,
            assigned_by=request.user,
            **serializer.validated_data
        )

        incident.status = Incident.STATUS_IN_PROGRESS
        incident.save(update_fields=['status', 'updated_at'])

        return Response(IncidentDetailSerializer(incident).data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        incident = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        Resolution.objects.create(
            incident=incident,
            resolved_by=request.user,
            **serializer.validated_data
        )

        incident.status = Incident.STATUS_CLOSED
        incident.root_cause = serializer.validated_data.get('root_cause_confirmed', '')
        incident.resolved_at = now()
        incident.save(update_fields=['status', 'root_cause', 'resolved_at', 'updated_at'])

        return Response(IncidentDetailSerializer(incident).data)

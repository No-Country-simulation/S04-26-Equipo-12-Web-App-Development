from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
 
from apps.incidents.models import Incident, File
from apps.incidents.serializers import FileUploadSerializer, FileDetailSerializer
from core.permissions import IsAuthenticated

class FileViewSet(ListModelMixin, GenericViewSet):

    parser_classes  = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self):
        return File.objects.filter(incident_id=self.kwargs['incident_pk'])
 
    def get_serializer_class(self):
        if self.action == 'create':
            return FileUploadSerializer
        return FileDetailSerializer
 
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['incident'] = self._get_incident()
        return context
 
    def _get_incident(self):
        return Incident.objects.get(pk=self.kwargs['incident_pk'])
 
    def create(self, request, *args, **kwargs):
        # verificar que la incidencia existe antes de procesar el archivo
        self._get_incident()
 
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file_instance = serializer.save()
 
        return Response(
            FileDetailSerializer(file_instance, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )
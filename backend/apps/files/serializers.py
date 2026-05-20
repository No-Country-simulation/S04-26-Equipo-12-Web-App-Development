from rest_framework import serializers
from apps.files.models import (
    File,
    FILE_ALLOWED_IMAGE_TYPES,
    FILE_ALLOWED_VIDEO_TYPES,
    FILE_ALLOWED_TYPES,
    FILE_IMAGE_MAX_BYTES,
    FILE_VIDEO_MAX_BYTES,
    FILE_IMAGE_MAX_MB,
    FILE_VIDEO_MAX_MB,
)

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['file']

    def validate_file(self, file):
        mime_type = file.content_type

        if mime_type not in FILE_ALLOWED_TYPES:
            raise serializers.ValidationError('tipo de archivo no permitido. se aceptan imagenes o videos')
    
        if mime_type in FILE_ALLOWED_IMAGE_TYPES:
            if file.size > FILE_IMAGE_MAX_BYTES:
                raise serializers.ValidationError(f'el archivo supera el limite de {FILE_IMAGE_MAX_MB}mb para imagenes.')
            file_type = File.FILE_TYPE_IMAGE
 
        else:
            if file.size > FILE_VIDEO_MAX_BYTES:
                raise serializers.ValidationError(f'el archivo supera el limite de {FILE_VIDEO_MAX_MB}mb para videos.')
            file_type = File.FILE_TYPE_VIDEO
 
        # adjuntar datos calculados para usarlos en create()
        self._resolved_file_type= file_type
        self._resolved_mime_type= mime_type
        self._resolved_size= file.size
 
        return file

    def create(self, validated_data):
        return File.objects.create(
            incident= self.context['incident'],
            uploaded_by= self.context['request'].user,
            file= validated_data['file'],
            file_type= self._resolved_file_type,
            mime_type= self._resolved_mime_type,
            size_bytes= self._resolved_size,
        )
    
class FileDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model  = File
        fields = [
            'id',
            'file',
            'file_type',
            'mime_type',
            'size_bytes',
            'uploaded_at',
        ]
from django.conf import settings
from django.db import models
from apps.files.services import incident_file_upload_path

FILE_IMAGE_MAX_MB  = 5
FILE_VIDEO_MAX_MB  = 200
 
FILE_IMAGE_MAX_BYTES = FILE_IMAGE_MAX_MB * 1024 * 1024
FILE_VIDEO_MAX_BYTES = FILE_VIDEO_MAX_MB * 1024 * 1024
 
FILE_ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
FILE_ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
 
FILE_ALLOWED_TYPES = FILE_ALLOWED_IMAGE_TYPES + FILE_ALLOWED_VIDEO_TYPES


class File(models.Model):

    FILE_TYPE_IMAGE = 'image'
    FILE_TYPE_VIDEO = 'video'
 
    FILE_TYPE_CHOICES = [
        (FILE_TYPE_IMAGE, 'imagen'),
        (FILE_TYPE_VIDEO, 'video'),
    ]

    incident    = models.ForeignKey(
        'incidents.Incident',
        related_name='files',
        on_delete=models.CASCADE,
    )

    uploaded_by = models.ForeignKey(
        'users.CustomUser',
        related_name='uploaded_files',
        on_delete=models.PROTECT,
    )

    file= models.FileField(upload_to=incident_file_upload_path)
    file_type= models.CharField(max_length=10, choices=FILE_TYPE_CHOICES)
    mime_type= models.CharField(max_length=50)
    size_bytes= models.PositiveIntegerField()
    uploaded_at= models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']
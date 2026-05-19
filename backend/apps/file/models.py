from django.db import models
from services import incident_file_upload_path

class File(models.Model):
    FILE_TYPE_IMAGE = 'image'
    FILE_TYPE_VIDEO = 'video'
 
    FILE_TYPE_CHOICES = [
        (FILE_TYPE_IMAGE, 'imagen'),
        (FILE_TYPE_VIDEO, 'video'),
    ]

    incident    = models.ForeignKey(
        'Incident',
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
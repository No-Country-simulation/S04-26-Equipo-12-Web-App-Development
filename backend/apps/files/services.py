import os

def incident_file_upload_path(instance, filename):
    return os.path.join('incidents', str(instance.incident_id), 'files', filename)
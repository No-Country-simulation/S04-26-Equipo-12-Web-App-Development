from rest_framework_nested import routers
from apps.incidents.views import IncidentViewSet, FileViewSet
 
# router principal
router = routers.DefaultRouter()
router.register(r'incidents', IncidentViewSet, basename='incident')
 
# router anidado: /incidents/<incident_pk>/files/
incidents_router = routers.NestedDefaultRouter(router, r'incidents', lookup='incident')
incidents_router.register(r'files', FileViewSet, basename='incident-files')
 
urlpatterns = router.urls + incidents_router.urls
 
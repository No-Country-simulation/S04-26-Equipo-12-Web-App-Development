from django.urls import path

from .views import MetricsSummaryView, ReportExportView

urlpatterns = [
    path('analytics/metrics/', MetricsSummaryView.as_view(), name='metrics-summary'),
    path('analytics/reports/export/', ReportExportView.as_view(), name='report-export'),
]

from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsManager

from .serializers import MetricsSummarySerializer
from .services import build_report_data, generate_report_file


class MetricsSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        data = build_report_data('metrics', {}, start_date, end_date)
        serializer = MetricsSummarySerializer(data)
        return Response(serializer.data)


class ReportExportView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        source = request.query_params.get('source', 'metrics')
        file_format = request.query_params.get('format', 'excel')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        filters = {
            'area': request.query_params.get('area'),
            'type': request.query_params.get('type'),
            'status': request.query_params.get('status'),
            'priority': request.query_params.get('priority'),
            'start_date': request.query_params.get('start_date'),
            'end_date': request.query_params.get('end_date'),
        }
        filters = {k: v for k, v in filters.items() if v is not None}
        report_data = build_report_data(source, filters, start_date, end_date)
        file_buffer = generate_report_file(report_data, file_format)

        content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' if file_format == 'excel' else 'text/plain'
        extension = 'xlsx' if file_format == 'excel' else 'txt'
        filename = f'reporte_{source}.{extension}'

        return HttpResponse(
            file_buffer.getvalue(),
            content_type=content_type,
            headers={'Content-Disposition': f'attachment; filename="{filename}"'},
        )

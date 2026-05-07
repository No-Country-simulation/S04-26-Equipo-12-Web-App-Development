from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return Response(
            {
                "success": False,
                "message": "Internal Server Error",
                "details": str(exc),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {
            "success": False,
            "status_code": response.status_code,
            "message": get_error_message(response.data),
            "errors": response.data,
        },
        status=response.status_code,
    )


def get_error_message(data):
    if isinstance(data, dict):
        if "detail" in data:
            return data["detail"]

        first_key = next(iter(data), None)
        if first_key:
            first_error = data[first_key]

            if isinstance(first_error, list):
                return first_error[0]

            return first_error

    if isinstance(data, list) and len(data) > 0:
        return data[0]

    return "Something went wrong"
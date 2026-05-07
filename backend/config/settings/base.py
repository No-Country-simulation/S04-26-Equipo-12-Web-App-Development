
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "core.pagination.StandardResultsSetPagination",
    "PAGE_SIZE": 10,
    "EXCEPTION_HANDLER": "core.exceptions.custom_exception_handler",
}
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display  = ('email', 'get_full_name', 'role', 'area', 'is_active')
    list_filter   = ('role', 'is_active', 'area')
    search_fields = ('email', 'first_name', 'last_name', 'employee_code')
    ordering      = ('last_name', 'first_name')

    fieldsets = tuple(UserAdmin.fieldsets) + (
        ('Additional Information', {
            'fields': ('area', 'role', 'phone', 'employee_code')
        }),
    ) # type: ignore
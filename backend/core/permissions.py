from rest_framework.permissions import BasePermission

from apps.users.models import CustomUser

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.Role.ADMIN
    
class IsAdminOrSupervisor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            CustomUser.Role.ADMIN,
            CustomUser.Role.SUPERVISOR
            ]

class IsOperator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.Role.OPERATOR

class IsSupervisor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.Role.SUPERVISOR

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.Role.MANAGER

class IsSupervisorOrManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['SUPERVISOR', 'MANAGER']
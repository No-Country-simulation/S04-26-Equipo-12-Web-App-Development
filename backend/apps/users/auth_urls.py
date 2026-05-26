from django.urls import path
from .views import ChangePasswordView, LoginView, PasswordRecoveryView, RegisterView, RefreshView, LogoutView, MeView

urlpatterns = [
  path('login/', LoginView.as_view(), name='auth-login'),
  path('register-operator/', RegisterView.as_view(), name='auth-register'),
  path('refresh/', RefreshView.as_view(), name='auth-refresh'),
  path('logout/', LogoutView.as_view(), name='auth-logout'),
  path('me/', MeView.as_view(), name='auth-me'),
  path('password-recovery/', PasswordRecoveryView.as_view(), name='auth-password-recovery'),
  path('change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
]
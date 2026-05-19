from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser
from typing import Any, cast

class UserSummarySerializer(serializers.ModelSerializer):

  full_name = serializers.SerializerMethodField()
  class Meta:
    model = CustomUser
    fields = ('id', 'full_name', 'role')

  def get_full_name(self, obj) -> str:
    return obj.get_full_name()

class UserProfileSerializer(serializers.ModelSerializer):
  
  full_name = serializers.SerializerMethodField()

  area_name = serializers.CharField(source='area.name', read_only=True)

  class Meta:
    model = CustomUser
    fields = [
      'id',
      'full_name',
      'first_name',
      'last_name',
      'email',
      'role',
      'phone',
      'employee_code',
      'area',
      'area_name',
      'is_active',
      'created_at'
    ]

  def get_full_name(self, obj) -> str:
    return obj.get_full_name()

class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, min_length=8, max_length=30)

  class Meta:
    model = CustomUser
    fields = [
      'email',
      'first_name',
      'last_name',
      'password',
      'phone'
    ]

  def create(self, validated_data):
    password = validated_data.pop('password')

    user = CustomUser(
      **validated_data,
      role = CustomUser.Role.OPERATOR
    )

    user.employee_code = self.generate_employee_code()
    user.set_password(password)
    user.save()

    return user
  
  def generate_employee_code(self) -> str:
    last_user = (
      CustomUser.objects
      .exclude(employee_code__isnull=True)
      .order_by('-id')
      .first()
    )

    next_id = 1 if not last_user else int(last_user.pk) + 1

    return f"EMP-{next_id:04d}"

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
  def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
    data = cast(dict[str, Any], super().validate(attrs))
    data['user'] = UserProfileSerializer(self.user).data
    return data
  
class LogoutSerializer(serializers.Serializer):
  refresh = serializers.CharField(
    help_text="Refresh token",
  )
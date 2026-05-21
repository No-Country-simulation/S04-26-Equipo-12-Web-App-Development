from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser
from typing import Any, cast

class UserCreateSerializer(serializers.ModelSerializer):

  password = serializers.CharField(write_only=True, min_length=8, max_length=30)

  class Meta:
    model  = CustomUser
    fields = [
            'first_name',
            'last_name',
            'email',
            'password',
            'role',
            'area',
            'phone',
            'employee_code',
        ]

  def validate_role(self, value):
        requesting_user = self.context['request'].user

        # Un SUPERVISOR solo puede crear cuentas OPERATOR.
        if requesting_user.is_supervisor and value != CustomUser.Role.OPERATOR:
            raise serializers.ValidationError({
              'role': 'SUPERVISOR_CANNOT_ASSIGN_HIGHER_ROLE'
            })

        # Un ADMIN puede crear OPERATOR, SUPERVISOR y MANAGER,
        # pero no puede crear otro ADMIN.
        if requesting_user.is_admin and value == CustomUser.Role.ADMIN:
            raise serializers.ValidationError(
                'No se puede crear un usuario con rol ADMIN.'
            )

        return value

  def create(self, validated_data):
        password = validated_data.pop('password')

        validated_data['username'] = validated_data['email']

        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserRoleUpdateSerializer(serializers.ModelSerializer):

  role = serializers.ChoiceField(
     choices=[
        CustomUser.Role.OPERATOR,
        CustomUser.Role.SUPERVISOR,
     ]
  )

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
  username_field = 'email'
  def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
    data = cast(dict[str, Any], super().validate(attrs))
    data['user'] = UserProfileSerializer(self.user).data
    return data
  
class LogoutSerializer(serializers.Serializer):
  refresh = serializers.CharField(
    help_text="Refresh token",
  )
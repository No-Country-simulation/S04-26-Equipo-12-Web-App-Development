from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from apps.users.models import CustomUser
from core.permissions import IsAdmin, IsAdminOrSupervisor

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserCreateSerializer,
    UserProfileSerializer,
    LogoutSerializer,
    RegisterSerializer,
    UserRoleUpdateSerializer
)

from rest_framework.generics import CreateAPIView
from typing import cast, Any

class LoginView(TokenObtainPairView):
  """
  POST /api/auth/login
  """

  permission_classes = [AllowAny]

  serializer_class = CustomTokenObtainPairSerializer

class RegisterView(CreateAPIView):
  """
  POST /api/auth/register
  """

  permission_classes =[AllowAny]
  serializer_class = RegisterSerializer

  def post(self, request):
     serializer = RegisterSerializer(data = request.data)
     serializer.is_valid(raise_exception=True)
     user = cast(CustomUser, serializer.save())

     refresh = RefreshToken.for_user(user)

     return Response(
            {
                'message': 'User registered successfully',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            },
            status=status.HTTP_201_CREATED
        )

class RefreshView(TokenRefreshView):
  """
  POST /api/auth/refresh
  Recibe el refresh token y retorna un nuevo access token
  """

  permission_classes = [AllowAny]

  pass

class LogoutView(APIView):
  """
  POST /api/auth/logout
  """
  permission_classes = (IsAuthenticated,)

  def post(self, request):
    serializer = LogoutSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        validated_data = cast(dict[str, Any], serializer.validated_data)

        refresh_token = cast(str, validated_data.get('refresh'))

        if not refresh_token:
            return Response(
                {'message': 'Refresh token is invalid'},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = RefreshToken(refresh_token)  # type: ignore[arg-type]
        token.blacklist()

    except TokenError:
        return Response(
            {'message': 'Token is invalid or expired'},
            status=status.HTTP_400_BAD_REQUEST
        )

    return Response(
        {'message': 'Logout successful'},
        status=status.HTTP_200_OK
    )

class MeView(APIView):
  """
  GET /api/auth/me
  Retorna el perfil completo del usuario autenticado
  """
  permission_classes = (IsAuthenticated,)

  def get(self, request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
class UserViewSet(ModelViewSet):
    """
    ViewSet para la gestión de usuarios del sistema.
    La creación está permitida para ADMIN y SUPERVISOR,
    pero cada uno con restricciones distintas validadas en el serializer.
    """

    queryset         = CustomUser.objects.filter(is_active=True).order_by('last_name')
    serializer_class = UserProfileSerializer

    # Solo permitimos los métodos que tienen sentido para este recurso.
    # DELETE no existe: los usuarios se desactivan (is_active=False), no se eliminan.
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    serializer_map = {
        'create':      UserCreateSerializer,
        'update_role': UserRoleUpdateSerializer,
    }

    def get_permissions(self):
        permission_map = {
            'create':      [IsAuthenticated, IsAdminOrSupervisor],
            'update_role': [IsAuthenticated, IsAdmin],
            'list':        [IsAuthenticated, IsAdminOrSupervisor],
            'retrieve':    [IsAuthenticated, IsAdminOrSupervisor],
        }
        permission_classes = permission_map.get(self.action, [IsAuthenticated])
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        user     = self.request.user

        if self.action == 'list':
            if user.is_supervisor:
                # El supervisor solo puede ver y gestionar operarios.
                return queryset.filter(role=CustomUser.Role.OPERATOR)

            if user.is_admin:
                return queryset.exclude(role=CustomUser.Role.ADMIN)

        return queryset

    @action(detail=True, methods=['patch'])
    def update_role(self, request, pk=None):
        """
        PATCH /api/v1/users/{id}/update-role/

        Cambia el rol de un usuario entre OPERATOR y SUPERVISOR.
        Solo ejecutable por un ADMIN
        """
        user       = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_role = serializer.validated_data['role']

        old_role     = user.role
        user.role    = new_role
        user.save(update_fields=['role', 'updated_at'])

        return Response(
        {
            'code': 'USER_ROLE_UPDATED',
            'old_role': old_role,
            'new_role': new_role,
            'user': UserProfileSerializer(user).data,
        },
        status=status.HTTP_200_OK,
    )
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from apps.users.models import CustomUser

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserProfileSerializer,
    LogoutSerializer,
    RegisterSerializer
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
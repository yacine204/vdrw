from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.tokens import RefreshToken
from . import services as userService
from django.views.decorators.csrf import csrf_exempt
from .serializers import UserSerializer, LoginSerializer, SignUpSerializer

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request: Request):
    print(request.data)
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        password = serializer.validated_data.get('password')
        email = serializer.validated_data.get('email')
        user = userService.login(email, password)
        if not user:
            return Response({"error": "wrong credentials"}, status=401)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        })
    return Response(serializer.errors, status=400)

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def sign_up(request: Request):
    print(request.data)
    serializer = SignUpSerializer(data=request.data)
    print(serializer)
    if serializer.is_valid():
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        pseudo = serializer.validated_data.get('pseudo')

        user = userService.signup(email, password, pseudo)
        if not user:
            return Response({"error": "email already in use"}, status=400)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        }, status=201)
    return Response(serializer.errors,status=400)
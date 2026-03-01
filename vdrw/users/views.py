from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from . import services as userService
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request: Request):
    password = request.data.get('password')
    email = request.data.get('email')
    user = userService.login(email, password)
    if not user:
        return Response({"error": "wrong credentials"}, status=401)
    
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user":{
            "id": user.id,
            "pseudo": user.pseudo,
            "email": user.email
        }
    })

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def sign_up(request: Request):
    email = request.data.get('email')
    password = request.data.get('password')
    pseudo = request.data.get('pseudo')

    user = userService.signup(email, password, pseudo)
    if not user:
        return Response({"error": "email already in use"}, status=400)
    
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user":{
            "id": user.id,
            "email": user.email,
            "pseudo": user.pseudo
        }
    }, status=201)


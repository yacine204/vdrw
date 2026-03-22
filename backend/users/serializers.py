from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "pseudo", "email"]

class LoginSerializer(serializers.Serializer):
    password = serializers.CharField(required=True, max_length = 255)
    email = serializers.CharField(required=True, max_length=255)


class SignUpSerializer(serializers.Serializer):
    pseudo = serializers.CharField(required=True, max_length=255)
    password = serializers.CharField(required=True, max_length = 255)
    email = serializers.CharField(required=True, max_length=255)

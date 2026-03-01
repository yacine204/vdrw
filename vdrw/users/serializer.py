from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class META:
        model = User
        fields = ["id", "pseudo", "email", "lastLogin"]

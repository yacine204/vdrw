from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class User(models.Model):

    pseudo = models.CharField(max_length=250)
    email = models.CharField(max_length=250)
    createdAt = models.DateTimeField(auto_now_add=True)
    hashed_password = models.CharField(max_length=255)
    updatedAt = models.DateTimeField(auto_now=True)
    inGame = models.BooleanField(default=False)
    isOnline = models.BooleanField(default=True)
    lastLogin = models.DateTimeField(auto_now=True)
    
    def set_password(self, raw_password: str):
        self.hashed_password = make_password(raw_password)

    def check_password(self, raw_password: str)->bool:
        return check_password(raw_password, self.hashed_password)
    
    class Meta:
        db_table = "users"
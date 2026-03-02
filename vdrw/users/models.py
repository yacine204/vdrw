from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class User(models.Model):

    pseudo = models.CharField(max_length=250)
    email = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)
    hashed_password = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now=True)
    in_game = models.BooleanField(default=False)
    is_online = models.BooleanField(default=True)
    last_login = models.DateTimeField(default=timezone.now, null= True, blank=True)
    
    def set_password(self, raw_password: str):
        self.hashed_password = make_password(raw_password)

    def check_password(self, raw_password: str)->bool:
        return check_password(raw_password, self.hashed_password)
    
    class Meta:
        db_table = "users"
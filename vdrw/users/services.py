from .models import User
from .models import UserStatus

from django.core.exceptions import ObjectDoesNotExist
from typing import Optional
from datetime import datetime

def login(email: str, password: str)-> Optional[User]:
    # return the user instance if credentails are correct else none
    if not email or not password:
        return None
    try:
        user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        return None
    
    if user.check_password(password):
        user.last_login = datetime.now()
        user.status = UserStatus.online
        user.save()
        return user
    return None

def signup(email: str, password: str, pseudo: str)->Optional[User]:
    # return user 
    if not email or not password or not pseudo: 
        return None
    if User.objects.filter(email=email).exists():
        return None
    user = User.objects.create(
        pseudo=pseudo,
        email=email,
    )
    user.set_password(password)
    user.save()
    return user
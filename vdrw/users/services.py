from .models import User
from django.core.exceptions import ObjectDoesNotExist
from typing import Optional

def login(email: str, password: str)-> Optional[User]:
    # return nthe user instance if credentails are correct else none
    if not email or not password:
        return None
    try:
        user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        return None
    
    if user.check_password(password):
        return user
    return None

def signup(email: str, password: str, pseudo: str)->Optional[User]:
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
from django.urls import path
from . import views as userViews

urlpatterns = [
    path("login/", userViews.login_user),
    path("signup/", userViews.sign_up)
]
from django.urls import path
from .views import HostParty, EnterPrivateParty, TerminateParty, GetAllPublicParties, JoinPublic

urlpatterns=[
    path('host/', HostParty, name='host-party'),
    path('join-private/', EnterPrivateParty, name='join-private'),
    path('terminate/', TerminateParty, name='terminate-party'),
    path('public-parties/', GetAllPublicParties, name='public-parties'),
    path('join-public/', JoinPublic, name="join-public-party")
]
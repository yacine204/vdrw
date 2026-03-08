from django.urls import path
from .views import HostParty, EnterPrivateParty, TerminateParty, GetAllPublicParties, JoinPublic, GetPM, GetUserInGame

urlpatterns=[
    path('host/', HostParty, name='host-party'),
    path('join-private/', EnterPrivateParty, name='join-private'),
    path('terminate/', TerminateParty, name='terminate-party'),
    path('public-parties/', GetAllPublicParties, name='public-parties'),
    path('join-public/', JoinPublic, name="join-public-party"),
    path('party-members/', GetPM, name="get-party-members"),
    path('user-in-game/', GetUserInGame, name="get-user-in-game")
]
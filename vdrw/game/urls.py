from django.urls import path
from .views import HostParty, EnterPrivateParty, TerminateParty, GetAllPublicParties

urlpatterns=[
    path('host/', HostParty, name='host-party'),
    path('join-private/', EnterPrivateParty, name='join-private'),
    path('terminate/', TerminateParty, name='terminate-party'),
    path('public_parties/', GetAllPublicParties, name='public-parties')
]
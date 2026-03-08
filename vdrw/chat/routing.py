from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/room/(?P<party_id>\d+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/draw/room/(?P<party_id>\d+)/$', consumers.DrawConsumer.as_asgi()),
]
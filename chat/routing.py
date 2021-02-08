from django.urls import path
from . import consumers


websocket_urlpatterns = [
  path('room/<int:room_id>', consumers.ChatConsumer.as_asgi()),
]

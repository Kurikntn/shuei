import os
from django.conf.urls import url
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatjo.settings')
django_asgi_app = get_asgi_application()


import django
django.setup()


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing


application = ProtocolTypeRouter( {
    'http': django_asgi_app,
    'websocket': AuthMiddlewareStack( URLRouter( chat.routing.websocket_urlpatterns ) ),
} )

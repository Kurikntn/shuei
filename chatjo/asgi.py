from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing
import os


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatjo.settings')

# application = get_asgi_application()
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter( {
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack( URLRouter( chat.routing.websocket_urlpatterns ) ),
} )
from django.contrib import admin
from django.urls import path, include
from chat import views as chat_views

urlpatterns = [
    path('_admin/', admin.site.urls),
    path('account/', include('django.contrib.auth.urls')),

    path('', chat_views.index, name='index'),
    path('room/<int:room_id>', chat_views.room, name='room'),
    path('google67811a07e1a912c4.html', chat_views.google, name='google'),
]

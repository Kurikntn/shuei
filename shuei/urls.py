from django.contrib import admin
from django.urls import path, include
from chat import views as chat_views

urlpatterns = [
    path('_admin/', admin.site.urls),
    path('account/', include('django.contrib.auth.urls')),

    path('', chat_views.index),
]

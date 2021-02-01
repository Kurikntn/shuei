from django.contrib import admin
from chat.models import Room

class RoomAdmin(admin.ModelAdmin):
  list_display = ['name', 'time', 'at']

admin.site.register(Room, RoomAdmin)

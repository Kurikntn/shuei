from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from chat.models import Room

import datetime
import redis

JST = datetime.timezone(datetime.timedelta(hours=+9), 'JST')

class Command(BaseCommand):

  def handle(self, *args, **options):
    now = datetime.datetime.now(datetime.timezone.utc)
    rooms = Room.objects.all()
    redis_cli = redis.Redis(host=settings.ALLOWED_HOSTS[0], port=settings.REDIS_PORT)
    for room in rooms:
      redis_room = redis_cli.zrange("asgi:group:room_" + str(room.id), 0, -1)    
      room.participants_num = len(redis_room)
      room.save()
      #部屋作成から10分経過　かつ　capacity未満なら削除
      if(room.participants_num < room.capacity and 
        ((room.at + datetime.timedelta(minutes=10)) < now)
      ):
        room.delete()

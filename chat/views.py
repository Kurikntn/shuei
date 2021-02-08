from django.shortcuts import render, redirect, get_object_or_404
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.conf import settings
from chat.models import Room

import datetime
import redis


def index(request):
  if(request.method == 'POST'):
    print(request.POST)
    new_room = Room(
      name = request.POST['name'],
      time = request.POST['room-time'],
      capacity = request.POST['room-capacity'],
      at = datetime.datetime.now()
    )
    new_room.save()
    return redirect('/room/' + str(new_room.id))

  rooms = Room.objects.order_by('-at')
  t = loader.get_template('index.html')
  c = {
    'rooms': rooms,
  }
  return HttpResponse(t.render(c, request))


def room(request, room_id):
  room = get_object_or_404(Room, id=room_id)
  redis_cli = redis.Redis(host=settings.ALLOWED_HOSTS[0], port=settings.REDIS_PORT)
  redis_room = redis_cli.zrange("asgi:group:room_" + str(room_id), 0, -1)

  t = loader.get_template('room.html')
  c = {
    'room': room,
    'participants_num': len(redis_room),
  }
  return HttpResponse(t.render(c, request))

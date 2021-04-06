from django.shortcuts import render, redirect, get_object_or_404
from django.template import loader
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.conf import settings
from chat.models import Room
from django.db.models import F
from django.utils import timezone
from chat.utils import connect

import datetime
import redis


def index(request):
  if(request.method == 'POST'):
    if 'name' in request.POST:  #部屋作成
      new_room = Room(
        name = request.POST['name'],
        time = request.POST['room-time'],
        capacity = request.POST['room-capacity'],
        at = timezone.now()
      )
      new_room.save()
      return redirect('/room/' + str(new_room.id))
    elif 'close-room-input' in request.POST:    #部屋を閉めた時のメッセージ
      messages.add_message(request, messages.INFO, "部屋が閉められました。")
  
  #roomの順番
  rooms_order = 'new'
  if('rooms-order' in request.GET):
    rooms_order = request.GET['rooms-order']
  if(rooms_order == 'new'):
    rooms = Room.objects.filter(participants_num__lt=F('capacity')).order_by('-at')
  elif(rooms_order == 'old'):
    rooms = Room.objects.filter(participants_num__lt=F('capacity')).order_by('at')
  elif(rooms_order == 'random'):
    rooms = Room.objects.filter(participants_num__lt=F('capacity')).order_by('?')
  t = loader.get_template('index.html')
  c = {
    'rooms': rooms,
    'rooms_order': rooms_order,
  }
  return HttpResponse(t.render(c, request))


def rule(request):
  t = loader.get_template('rule.html')
  return HttpResponse(t.render({}, request))


def privacy(request):
  t = loader.get_template('privacy.html')
  return HttpResponse(t.render({}, request))


def room(request, room_id):
  room = get_object_or_404(Room, id=room_id)
  redis_cli = connect()
  redis_room = redis_cli.zrange("asgi:group:room_" + str(room_id), 0, -1)

  if(room.participants_num >= room.capacity):
    messages.add_message(request, messages.ERROR, "部屋に入れませんでした。")
    return redirect('index')

  capacity_limit_time = room.at + datetime.timedelta(hours=9) + datetime.timedelta(minutes=11)

  t = loader.get_template('room.html')
  c = {
    'room': room,
    'participants_num': len(redis_room),
    'capacity_limit_time': capacity_limit_time.time(),
  }
  return HttpResponse(t.render(c, request))


def google(request):
  t = loader.get_template('google67811a07e1a912c4.html')
  return HttpResponse(t.render({}, request))

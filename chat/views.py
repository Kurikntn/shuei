from django.shortcuts import render, redirect
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from chat.models import Room

import datetime


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
  t = loader.get_template('room.html')
  c = {}
  return HttpResponse(t.render(c, request))

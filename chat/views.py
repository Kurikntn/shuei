from django.shortcuts import render
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse


def index(request):
  t = loader.get_template('index.html')
  c = {}
  return HttpResponse(t.render(c, request))

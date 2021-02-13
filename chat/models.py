from django.db import models
from django.utils import timezone

# Create your models here.
class Room(models.Model):
  name = models.CharField(max_length=50)
  capacity = models.IntegerField(default=3, verbose_name="制限人数")
  participants_num = models.IntegerField(default=0, verbose_name="参加人数")
  time = models.IntegerField(default=8, verbose_name="制限時間")
  at = models.DateTimeField(default=timezone.now, verbose_name='作成日時')

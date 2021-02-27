from django.conf import settings

import redis
import os


def connect():
  return redis.from_url(
    url=os.environ.get(settings.REDIS_URL),
    decode_responses=True,
  )


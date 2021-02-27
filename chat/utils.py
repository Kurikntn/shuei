from django.conf import settings

import redis
import os


def connect():
  if settings.REDIS_URL:
    return redis.from_url(
      url=os.environ.get(settings.REDIS_URL),
      decode_responses=True,
    )
  else:
    return redis.Redis(host=settings.ALLOWED_HOSTS[0], port=settings.REDIS_PORT)

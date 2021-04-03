#! /bin/sh
  
PATH=$PATH:$HOME/.local/bin:$HOME/bin:/usr/pgsql-13/bin
export PATH
source $HOME/venv/bin/activate

cd /home/server/chatjo

DAPHNE_PID=`ps -ef | grep daphne | grep -v grep | cut -d" " -f4`
kill -9 $DAPHNE_PID


#毎時のダフネ
daphne -u /home/server/run/daphne.sock chatjo.asgi:application &

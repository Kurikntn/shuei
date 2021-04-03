#! /bin/sh
  
PATH=$PATH:$HOME/.local/bin:$HOME/bin:/usr/pgsql-13/bin
export PATH
source $HOME/venv/bin/activate

cd /home/server/chatjo

#毎時のダフネ
daphne -u /home/server/run/daphne.sock chatjo.asgi:application & > /home/server/log/daphne_command.log

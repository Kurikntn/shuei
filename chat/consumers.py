import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer( AsyncWebsocketConsumer ):
  rooms = None

  def __init__( self, *args, **kwargs ):
    super().__init__( *args, **kwargs )

    if ChatConsumer.rooms is None:
        ChatConsumer.rooms = {}

    self.user_name = ''
    self.room_name = ''
    self.room_number = ''
    self.room_capacity = ''

  async def connect( self ):
    await self.accept()

  async def disconnect( self, close_code ):
    await self.leave_chat()

  async def receive( self, text_data ):
    text_data_json = json.loads( text_data )

    if( 'join' == text_data_json.get( 'data_type' ) ):
      self.user_name = text_data_json['username']
      self.room_number = text_data_json['room_number']
      self.room_capacity = text_data_json['room_capacity']
      await self.join_chat() 

    elif( 'leave' == text_data_json.get( 'data_type' ) ):
      await self.leave_chat()

    else:
      strMessage = text_data_json['message']
      image = text_data_json['image']
      data = {
        'type': 'chat_message',
        'message': strMessage,
        'image' : image,
        'username': self.user_name,
      }
      await self.channel_layer.group_send( self.room_name, data )

  async def chat_message( self, data ):
    if( data['message'] != "" and data['image'] != "" ):
      data_json = {
        'message': data['message'],
        'image': data['image'],
        'username': data['username'],
      }
    elif( data['message'] != "" ):
      data_json = {
        'message': data['message'],
        'username': data['username'],
      }
    else:
      data_json = {
        'image': data['image'],
        'username': data['username'],
      }
    await self.send( text_data=json.dumps( data_json ) )

  async def join_chat( self ):
    self.room_name = 'room_%s' % self.room_number

    room = ChatConsumer.rooms.get(self.room_name)
    if( None == room ):
      ChatConsumer.rooms[self.room_name] = {'participants_count': 1}
    else:
      room['participants_count'] += 1

    if(ChatConsumer.rooms[self.room_name]['participants_count'] <= int(self.room_capacity)):
      await self.channel_layer.group_add( self.room_name, self.channel_name )
      print("一名様入りました")
    else:
      print("これ以上は入室できません") # 退出処理をしたい

  async def leave_chat( self ):
    if( '' == self.room_name ):
      return

    del ChatConsumer.rooms[self.room_name]
    self.room_name = ''
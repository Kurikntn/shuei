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
    #チャット参加時
    if( 'join' == text_data_json.get( 'data_type' ) ):
      self.user_name = text_data_json['username']
      self.room_number = text_data_json['room_number']
      self.room_capacity = text_data_json['room_capacity']
      await self.join_chat() 
    #チャット離脱時
    elif( 'leave' == text_data_json.get( 'data_type' ) ):
      await self.leave_chat()
    #チャット送信時
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
    if('count' in data):
      print('カウント')
      data_json = {
        'count' : data['count'],
      }
    elif('error' in data):
      print('満室')
      data_json = {
        'error' : data['error'],
      }
    elif('leave' in data):
      print('退出')
      data_json = {
        'leave' : data['leave'],
        'minus_count': data['minus_count'],
      }
    else:
      print('チャット')
      data_json = {
        'message': data['message'],
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
      print(self.room_name + "に人が入りました")
      data = {
        'type': 'chat_message',
        'count': ChatConsumer.rooms[self.room_name]['participants_count'],
      }
      await self.channel_layer.group_send( self.room_name, data )
    else:
      await self.channel_layer.group_add( self.room_name, self.channel_name )
      print("これ以上は入室できません")
      data = {
        'type': 'chat_message',
        'error': '満室',
      }
      await self.channel_layer.group_send( self.room_name, data )


  async def leave_chat( self ):
    if( '' == self.room_name ):
      return
    await self.channel_layer.group_discard( self.room_name, self.channel_name)

    ChatConsumer.rooms[self.room_name]['participants_count'] -= 1

    if(ChatConsumer.rooms[self.room_name]['participants_count'] >= int(self.room_capacity)):
      data = {
        'type': 'chat_message',
        'leave': '定員以上',
        'minus_count': ChatConsumer.rooms[self.room_name]['participants_count'],
      }
      await self.channel_layer.group_send( self.room_name, data )
    else:
      data = {
        'type': 'chat_message',
        'leave': '定員割れ',
        'minus_count': ChatConsumer.rooms[self.room_name]['participants_count'],
      }
      await self.channel_layer.group_send( self.room_name, data )

    if(ChatConsumer.rooms[self.room_name]['participants_count'] == 0):
      del ChatConsumer.rooms[self.room_name]
    self.room_name = ''

# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.party_id = self.scope['url_route']['kwargs']['party_id']
            self.room_group_name = f'chat_{self.party_id}'
            query_string = self.scope['query_string'].decode()

            self.pseudo = query_string.split('=')[1] if '=' in query_string else 'Unknown'

            print(f"New connection attempt for party {self.party_id}")

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            print(f"WebSocket connected to party {self.party_id}")
            print("query_string:", self.scope['query_string'])
            # Optional: notify the room that someone joined
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f"{self.pseudo} joined the chat",
                    'pseudo': 'System'
                }
            )
        except Exception as e:
            print(f"Error in connect: {e}")
            await self.close()

    async def disconnect(self, close_code):
        try:
            print(f"Disconnecting from party {self.party_id}, code: {close_code}")
            # Leave room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f"{self.pseudo} left the chat",
                    'pseudo': 'System'
                }
            )
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            print(f"Error in disconnect: {e}")

    async def receive(self, text_data):
        try:
            print(f"Received message: {text_data}")
            data = json.loads(text_data)
            message = data.get('message', '')
            pseudo = data.get('pseudo', '')
            if not message:
                print("Empty message received")
                return

            # Broadcast message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'pseudo': pseudo
                }   
            )


        except json.JSONDecodeError as e:
            print(f"Invalid JSON: {e}")
        except Exception as e:
            print(f"Error in receive: {e}")

    async def chat_message(self, event):
        try:
            message = event['message']

            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'message': message,
                'pseudo': event['pseudo']
            }))
            print(f"Sent message: {message}")
        except Exception as e:
            print(f"Error in chat_message: {e}")
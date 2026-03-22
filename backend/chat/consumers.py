import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.party_id = self.scope['url_route']['kwargs']['party_id']
            self.room_group_name = f'chat_{self.party_id}'
            query_string = self.scope['query_string'].decode()
            self.pseudo = query_string.split('=')[1] if '=' in query_string else 'Unknown'

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'chat_message',
                'message': f"{self.pseudo} joined the chat",
                'pseudo': 'System'
            })
        except Exception as e:
            print(f"Error in connect: {e}")
            await self.close()

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'chat_message',
                'message': f"{self.pseudo} left the chat",
                'pseudo': 'System'
            })
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        except Exception as e:
            print(f"Error in disconnect: {e}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get('message', '')
            pseudo = data.get('pseudo', '')

            if not message:
                return
       
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'chat_message',
                'message': message,
                'pseudo': pseudo
            })
        except Exception as e:
            print(f"Error in receive: {e}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'pseudo': event['pseudo']
        }))


# Shared room state per party_id
draw_rooms = {}


class DrawConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.party_id = self.scope['url_route']['kwargs']['party_id']
            self.room_group_name = f'draw_{self.party_id}'
            query_string = self.scope['query_string'].decode()
            self.pseudo = query_string.split('=')[1] if '=' in query_string else 'Unknown'

            # Initialize room state if not exists
            if self.party_id not in draw_rooms:
                draw_rooms[self.party_id] = {
                    "players": set(),
                    "strokes": {},  # {pseudo: [strokes]}
                    "phase": "waiting",  # waiting, drawing, guessing
                    "round": 0,
                    "total_rounds": 1,
                    "round_duration": 60,
                    "current_drawing_index": 0,
                    "drawings": [],  # list of {player, strokes}
                    "game_task": None,
                }

            draw_rooms[self.party_id]["players"].add(self.pseudo)

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

            # Send current state to newly connected user
            room = draw_rooms[self.party_id]
            await self.send(text_data=json.dumps({
                "type": "init",
                "players": list(room["players"]),
                "phase": room["phase"],
                "round": room["round"],
                "totalRounds": room["total_rounds"],
            }))

            # Notify others
            await self.channel_layer.group_send(self.room_group_name, {
                "type": "player_joined",
                "pseudo": self.pseudo,
                "players": list(room["players"]),
            })
        except Exception as e:
            print(f"DrawConsumer connect error: {e}")
            await self.close()

    async def disconnect(self, close_code):
        try:
            if self.party_id in draw_rooms:
                draw_rooms[self.party_id]["players"].discard(self.pseudo)
                
                # Clean up empty rooms
                if not draw_rooms[self.party_id]["players"]:
                    if draw_rooms[self.party_id].get("game_task"):
                        draw_rooms[self.party_id]["game_task"].cancel()
                    del draw_rooms[self.party_id]
                else:
                    await self.channel_layer.group_send(self.room_group_name, {
                        "type": "player_left",
                        "pseudo": self.pseudo,
                        "players": list(draw_rooms[self.party_id]["players"]),
                    })

            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        except Exception as e:
            print(f"DrawConsumer disconnect error: {e}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            msg_type = data.get("type")

            if msg_type == "stroke":
                # Store stroke for this player (private drawing - no broadcast)
                pseudo = data.get("pseudo")
                stroke = data.get("stroke")
                room = draw_rooms.get(self.party_id)
                
                if room and room["phase"] == "drawing":
                    if pseudo not in room["strokes"]:
                        room["strokes"][pseudo] = []
                    room["strokes"][pseudo].append(stroke)
                    # No broadcasting - each player draws privately

            elif msg_type == "start_game":
                room = draw_rooms.get(self.party_id)
                if room and room["phase"] == "waiting":
                    room["round_duration"] = data.get("round_duration", 60)
                    room["total_rounds"] = data.get("total_rounds", 1)
                    
                    # Start game loop in background
                    room["game_task"] = asyncio.create_task(self.game_loop())

        except Exception as e:
            print(f"DrawConsumer receive error: {e}")

    async def game_loop(self):
        """Main game loop: drawing phase -> guessing phase for each round"""
        room = draw_rooms[self.party_id]
        total_rounds = room["total_rounds"]
        round_duration = room["round_duration"]

        for round_num in range(1, total_rounds + 1):
            room["round"] = round_num
            room["strokes"] = {}
            room["phase"] = "drawing"

            # DRAWING PHASE - all players draw simultaneously
            await self.channel_layer.group_send(self.room_group_name, {
                "type": "phase_message",
                "phase": "drawing",
                "round": round_num,
                "totalRounds": total_rounds,
            })

            # Countdown for drawing phase
            for t in range(round_duration, 0, -1):
                await self.channel_layer.group_send(self.room_group_name, {
                    "type": "timer_message",
                    "timeLeft": t,
                })
                await asyncio.sleep(1)

            # GUESSING PHASE - show each drawing one by one, 30s each
            room["phase"] = "guessing"
            drawings = [{"player": p, "strokes": s} for p, s in room["strokes"].items()]
            room["drawings"] = drawings

            for idx, drawing in enumerate(drawings):
                room["current_drawing_index"] = idx
                
                await self.channel_layer.group_send(self.room_group_name, {
                    "type": "phase_message",
                    "phase": "guessing",
                    "round": round_num,
                    "totalRounds": total_rounds,
                    "drawing": drawing,
                    "drawingIndex": idx,
                    "totalDrawings": len(drawings),
                })

                # 30 seconds per drawing to guess
                for t in range(30, 0, -1):
                    await self.channel_layer.group_send(self.room_group_name, {
                        "type": "timer_message",
                        "timeLeft": t,
                    })
                    await asyncio.sleep(1)

        # Game over
        room["phase"] = "game_over"
        await self.channel_layer.group_send(self.room_group_name, {
            "type": "game_over_message",
        })

    # Message handlers for channel layer
    async def stroke_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "stroke",
            "stroke": event["stroke"],
            "pseudo": event["pseudo"],
        }))

    async def phase_message(self, event):
        msg = {
            "type": "phase",
            "phase": event["phase"],
            "round": event["round"],
            "totalRounds": event["totalRounds"],
        }
        if "drawing" in event:
            msg["drawing"] = event["drawing"]
            msg["drawingIndex"] = event.get("drawingIndex", 0)
            msg["totalDrawings"] = event.get("totalDrawings", 0)
        await self.send(text_data=json.dumps(msg))

    async def timer_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "timer",
            "timeLeft": event["timeLeft"],
        }))

    async def game_over_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "game_over",
        }))

    async def player_joined(self, event):
        await self.send(text_data=json.dumps({
            "type": "player_joined",
            "pseudo": event["pseudo"],
            "players": event["players"],
        }))

    async def player_left(self, event):
        await self.send(text_data=json.dumps({
            "type": "player_left",
            "pseudo": event["pseudo"],
            "players": event["players"],
        }))
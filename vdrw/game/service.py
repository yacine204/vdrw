#models
from users.models import User
from .models import Party, PartyMember
from .models import PartyStatus
#types
from users.models import UserStatus
from typing import Optional, List
from datetime import datetime
from time import timezone
#helpers
from .helpers import generate_random_string

#serializers
from .serializers import CreatePartySerializer, CreatePartyMemberSerializer


from asgiref.sync import sync_to_async
import asyncio
class ServiceException(Exception):
    def __init__(self, message, status=400):
        self.message = message
        self.status = status
        super().__init__(message)

async def schedule_party_deletion(party_id: int):
    #get total time
    party = await sync_to_async(lambda: Party.objects.filter(id=party_id).first())()
    if not party:
        return 
    # Convert minutes to seconds (round_time is in minutes)
    total_time_seconds = ((party.round_time * party.total_rounds)+1) * 60
    print(f"Party {party_id} will be deleted in {total_time_seconds} seconds")
    await asyncio.sleep(total_time_seconds)
    try:
        await DeleteParty(party.owner_id)
        print(f"party {party_id} deleted automatically")
    except Exception as e:
        print(f"failed to delete party {party_id}: {e}")

#create a party by a user
async def CreateParty(user_id: int, data: dict)->Optional[Party]:
    #verify if the user exists and whether he's online or not
    user = await User.objects.filter(id=user_id, status=UserStatus.online).afirst()
    if user:

        party_code = generate_random_string(5)
        data = {
            **data,
            "owner": user_id,
            "code": party_code
        }

        party_serializer = CreatePartySerializer(data=data)
        is_valid = await sync_to_async(party_serializer.is_valid)()
        if is_valid:
            saved_party = await sync_to_async(party_serializer.save)()
            await JoinPrivateParty(user_id, party_code)
            asyncio.create_task(schedule_party_deletion(saved_party.id))
            return saved_party
        raise ServiceException(party_serializer.errors, status=400)
    raise ServiceException("user not found or not online", status=401) 

#join a private party
async def JoinPrivateParty(user_id: int, code: str) -> Optional[PartyMember]:
    user = await User.objects.filter(id=user_id).afirst()
    if user:
        party = await Party.objects.filter(code=code).afirst()
        if party:

            data = {
                "user": user_id,
                "party": party.id
            }
            
            print("data:",data)

            partyMember = CreatePartyMemberSerializer(data=data)
            is_valid = await sync_to_async(partyMember.is_valid)()
            if is_valid:
                saved_member = await sync_to_async(partyMember.save)()
                return saved_member
            raise ServiceException(partyMember.errors, status=400)
        raise ServiceException("wrong code", status=403)
    raise ServiceException("user must be online", status=403)

async def JoinPublicParty(user_id, party_id):
    user = await User.objects.filter(id=user_id).afirst()
    if not user:
        raise ServiceException({"user not found"}, status=404)
    user_in_party = await PartyMember.objects.filter(user_id = user_id).afirst()
    if user_in_party: 
        raise ServiceException({"user already in the game"}, status=403)
    
    party = await Party.objects.filter(id=party_id).afirst()
    if not party:
        raise ServiceException("party not found", status=404)
    if party.max_players - party.current_players == 0 :
        raise ServiceException("Party is full", status=403)
    data = {"user": user_id, "party": party_id}
    new_player = CreatePartyMemberSerializer(data=data)
    is_valid = await sync_to_async(new_player.is_valid)()
    if is_valid:
        saved_member = await sync_to_async(new_player.save)()
        return saved_member
    raise ServiceException(new_player.errors, status=400)


async def DeleteParty(user_id)-> Optional[Party]:
    user = await User.objects.filter(id=user_id).afirst()
    if user is None:
        raise ServiceException("user doesnt exist", status=404)
    
    party = await Party.objects.filter(owner_id = user_id).afirst()
    if party is None:
        raise ServiceException("party doesnt exist", status=404)
    await party.adelete()
    return party


async def GetPublicParties()->Optional[List[Party]]:
    return await sync_to_async(list)(Party.objects.filter(party_status=PartyStatus.public, current_players__lt=6))
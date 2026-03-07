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

class ServiceException(Exception):
    def __init__(self, message, status=400):
        self.message = message
        self.status = status
        super().__init__(message)

async def schedule_party_deletion(party_id: int):
    #get total time
    party = Party.objects.filter(id=party_id).first()
    total_time = party.round_time * party.round_time
    

#create a party by a user
async def CreateParty(user_id: int, data: CreatePartyMemberSerializer)->Optional[Party]:
    #verify if the user exists and whether he's online or not
    user = await User.objects.filter(id=user_id, status=UserStatus.online).afirst()
    if user:

        data = {
            **data,
            "owner": user_id,
            "code": generate_random_string(5)
        }

        party = CreatePartySerializer(data=data)
        if party.is_valid():
            await JoinPrivateParty(user_id, data["code"])
            await party.asave()
            return party
        raise ServiceException(party.errors, status=400)
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
            if partyMember.is_valid():
                await partyMember.asave()
                return partyMember
            raise ServiceException(partyMember.errors, status=400)
        raise ServiceException("wrong code", status=403)
    raise ServiceException("user must be online", status=403)

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
#models
from users.models import User
from .models import Party, PartyMember
from .models import PartyStatus
#types
from users.models import UserStatus
from typing import Optional, List
from datetime import datetime
#helpers
from .helpers import generate_random_string

#serializers
from .serializers import CreatePartySerializer, CreatePartyMemberSerializer


from asgiref.sync import sync_to_async
import asyncio
import logging

logger = logging.getLogger(__name__)
class ServiceException(Exception):
    def __init__(self, message, status=400):
        self.message = message
        self.status = status
        super().__init__(message)

async def schedule_party_deletion(party_id: int):
    #get total time
    party = await sync_to_async(lambda: Party.objects.filter(id=party_id).values("round_time", "total_rounds").first())()
    if not party:
        logger.info("Party %s already deleted before scheduling", party_id)
        return
    # Convert minutes to seconds (round_time is in minutes)
    total_time_seconds = (((party["round_time"]+0.3)*party["total_rounds"])+0.3)*60
    logger.info("Party %s will be deleted in %s seconds", party_id, total_time_seconds)
    await asyncio.sleep(total_time_seconds)
    try:
        deleted = await DeletePartyById(party_id)
        if deleted:
            logger.info("Party %s deleted automatically", party_id)
        else:
            logger.info("Party %s was already gone when scheduler ran", party_id)
    except Exception as e:
        logger.exception("failed to delete party %s: %s", party_id, e)

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
        user_in_party = await PartyMember.objects.filter(user_id = user_id).afirst()
        if user_in_party:
            raise ServiceException("user already in game", status=403)
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

    deleted_count, _ = await Party.objects.filter(owner_id=user_id).adelete()
    if deleted_count == 0:
        raise ServiceException("party doesnt exist", status=404)
    return None


async def DeletePartyById(party_id: int) -> Optional[Party]:
    deleted_count, _ = await Party.objects.filter(id=party_id).adelete()
    if deleted_count == 0:
        return False
    return True


async def GetPublicParties()->Optional[List[Party]]:
    return await sync_to_async(list)(Party.objects.filter(party_status=PartyStatus.public, current_players__lt=6))

async def GetPartyMembers(party_id: int)->Optional[list[PartyMember]]:
    party_members = await sync_to_async(lambda: list(PartyMember.objects.filter(party_id = party_id).all()))()
    return party_members

async def GetUserInGameMembers(user_id)->Optional[PartyMember]:
    return await sync_to_async(lambda: PartyMember.objects.filter(user_id=int(user_id)).first())()

async def GetParty(party_id: int)->Optional[Party]:
    party= await sync_to_async(lambda: (Party.objects.filter(id=party_id).first()))()
    if party :
        return party
    raise ServiceException("no party with that id found", status=404)
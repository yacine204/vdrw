from adrf.decorators import api_view
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from .service import CreateParty, ServiceException, JoinPrivateParty, DeleteParty, GetPublicParties, JoinPublicParty, GetPartyMembers, GetUserInGameMembers, GetParty
from .serializers import PartySerializer, PartyMemberSerializer
from django.views.decorators.csrf import csrf_exempt

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
async def HostParty(request: Request):
    try:
        user_id = request.data["user_id"]
        data = request.data.get("data", {})
        party = await CreateParty(user_id, data)
        return Response({"message": "party created successfully"}, status=200)
    except KeyError:
        return Response({"error": "missing required fields"}, status=400)
    except ServiceException as e:
        return Response({"error": e.message}, status=e.status)
    except Exception as e:
        print("ERROR:", e)
        return Response({"error": "internal server error"}, status=500)
    

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
async def EnterPrivateParty(request: Request):
    try:
        user_id = request.data["user_id"]
        code = request.data["code"]

        joined = await JoinPrivateParty(user_id, code)
        serializer = PartyMemberSerializer(joined)
        if joined: 
            return Response({"message":"Joined party successfully",
                             "party_member":serializer.data}, status=200)
        else: 
            return Response({"message":"Permission Denied"}, status=500)
    except KeyError:
        return Response({"error": "missing required fields"}, status=400)
    except ServiceException as e:
        return Response({"error": e.message}, status=e.status)
    except Exception as e:
        print("ERROR:", e)
        return Response({"error": "internal server error"}, status=500)
   
@api_view(["DELETE"])
@authentication_classes([])
@permission_classes([AllowAny])
async def TerminateParty(request:Request):
    try:
        user_id = request.data["user_id"]
        await DeleteParty(user_id)
        return Response({"message":"Party deleted"}, status=200)
    except KeyError:
        return Response({"error": "missing required fields"}, status=400)
    except ServiceException as e:
        return Response({"error": e.message}, status=e.status)
    except Exception as e:
        print("ERROR:", e)
        return Response({"error": "internal server error"}, status=500)

@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
async def GetAllPublicParties(request: Request): 
    public_parties = await GetPublicParties()
    if len(public_parties)>0:
        serializer = PartySerializer(public_parties, many=True)
        return Response(serializer.data, status=200)
    return Response("no parties available", status=404)

@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
async def JoinPublic(request: Request):
    try:
        user_id = request.data.get("user_id")
        party_id = request.data.get("party_id")
        joined_public = await JoinPublicParty(user_id, party_id)
        return Response({"message":"joined"}, status=200)
    except ServiceException as e:
        return Response({"error": e.message}, status=e.status)
    

@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
async def GetPM(request: Request):
    try:
        party_id = request.query_params.get("party_id")
        party_members = await GetPartyMembers(int(party_id))
        serializer = PartyMemberSerializer(party_members, many=True)
        return Response({"party_members":serializer.data}, status=200)
    except ServiceException as e:
        return Response({"error":e.message}, status=e.status)
    
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
async def GetUserInGame(request: Request):
    try:
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=400)
        party_member = await GetUserInGameMembers(user_id)
        if party_member is None:
            return Response({"error": "user not in any game"}, status=404)
        serializer = PartyMemberSerializer(party_member)
        return Response({"user_in_game": serializer.data}, status=200)
    except ServiceException as e:
        return Response({"error": e.message}, status=e.status)
    except Exception as e:
        print("ERROR:", e)
        return Response({"error": "internal server error"}, status=500)
    

@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
async def GetPartyInfo(request: Request):
    try:
        party_id = request.query_params.get("party_id")
        if not party_id:
            return Response({"error": "party_id is required"}, status=400)
        party = await GetParty(int(party_id))
        res = PartySerializer(party)
        return Response({"party":res.data}, status=200)
    except ServiceException as e:
        return Response({"error":e.message}, status=e.status)
from adrf.decorators import api_view
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from .service import CreateParty, ServiceException, JoinPrivateParty, DeleteParty, GetPublicParties
from .serializers import PartySerializer

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
        if joined: 
            return Response({"message":"Joined party successfully"}, status=200)
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
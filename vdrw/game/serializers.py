from rest_framework import serializers
from .models import Party, PartyMember

class CreatePartySerializer(serializers.ModelSerializer):
    class Meta:
        model = Party
        fields = ["code","owner","party_status","current_round","round_time", "total_rounds","created_at"]

class CreatePartyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyMember
        fields = ["user", "party", "joined_at"]

class PartySerializer(serializers.ModelSerializer):
    class Meta:
        model = Party
        fields = ["id", "code", "party_status", "max_players", "current_players"]
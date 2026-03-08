from rest_framework import serializers
from .models import Party, PartyMember

class CreatePartySerializer(serializers.ModelSerializer):
    class Meta:
        model = Party
        fields = ["max_players","name","code","owner","party_status","round_time", "total_rounds","created_at"]

class CreatePartyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyMember
        fields = ["user", "party", "joined_at"]

class PartySerializer(serializers.ModelSerializer):
    class Meta:
        model = Party
        fields = ["id", "name", "code", "party_status", "max_players", "current_players"]

class PartyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyMember
        fields = ["id", "joined_at", "user_id", "party_id"]
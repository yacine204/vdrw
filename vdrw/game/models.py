from django.db import models
from users.models import User
from time import timezone

class RoundStatus(models.TextChoices):
    init_context = 'INITIALIZING CONTEXT', 'Initializing context'
    drawing = "DRAWING", "Drawing"
    guessing = "GUESSING", "Guessing"

class EntryType(models.TextChoices):
    context = "A CONTEXT", "A context"
    guess = "A GUESS", "A guess"
    drawing = "A DRAWING", "A drawing"

class PartyStatus(models.TextChoices):
    public = "PUBLIC", "Public"
    private = "PRIVATE", "Private"

class Party(models.Model):
    code = models.CharField(max_length=5)
    owner = models.OneToOneField(User,on_delete=models.CASCADE,related_name="party")
    party_status = models.CharField(choices=PartyStatus.choices, default=PartyStatus.public)
    current_round = models.IntegerField(default=1)
    # minutes in integer format (1 minute, 2 minutes,..etc)
    round_time = models.IntegerField(default=1)
    total_rounds = models.IntegerField(default=1)
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(null=True, blank=True)


class Round(models.Model):
    party = models.ForeignKey(Party,on_delete=models.CASCADE, related_name="round")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="round")
    round_index = models.IntegerField(default=1)
    round_status = models.CharField(choices=RoundStatus.choices, default=RoundStatus.init_context)
    started_at = models.TimeField(auto_now_add=True)
    finished_at = models.TimeField(auto_now=True)

class PartyMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="party_member")
    party = models.ForeignKey(User, on_delete=models.CASCADE, related_name="party_member")
    joined_at = models.TimeField(auto_now_add=True)
    left_at = models.TimeField(auto_now=False)

class Entry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="entry")
    in_round = models.ForeignKey(Round, on_delete=models.CASCADE, related_name="entry")
    type_of_entry = models.CharField(choices=EntryType.choices)
    content = models.CharField(max_length=255)
    created_at = models.TimeField(auto_now=True)


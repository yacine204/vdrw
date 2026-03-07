from django.test import TestCase
from .service import createParty
# Create your tests here.


class PartTests(TestCase):
    user_id = 14
    def test_create_party(user_id):
        result = createParty(14)
        print(result)
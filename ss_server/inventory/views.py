from django.conf import settings
from rest_framework.response import Response
import jwt
from .models import Category, Item
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView

secret_key = settings.HASH_SECRET
def handleCustomerToken(request):
    token = request.COOKIES.get('customer_jwt')

    if not token:
        return None
    
    try:
        payload = jwt.decode(token, secret_key, algorithm=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    
    return payload
    
    return payload
class InitActions(APIView):
    def __init__(self, request) -> None:
        self.customer_token = handleCustomerToken(request)

class CategoryActions(APIView):
    def get(self, request, storeId):
        # super()
        categories = Category.objects.filter(store_id = storeId)
        return Response

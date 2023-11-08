from django.conf import settings
from rest_framework.response import Response
import jwt
from .serializers import CategorySerializer
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
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.customer_token = handleCustomerToken(request)

class CategoryActions(InitActions):
    def get(self, request, storeId):
        categories = Category.objects.filter(store_id = storeId).all()
        cat_ser = CategorySerializer(categories, many=True)
        return Response(cat_ser.data)


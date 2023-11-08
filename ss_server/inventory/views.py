from django.conf import settings
from rest_framework.response import Response
import jwt
from .serializers import CategorySerializer
from .models import Category, Item
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework import status

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
class InitActions(APIView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.customer_token = handleCustomerToken(request)

class CategoryActions(InitActions):
    def get(self, request, storeId):
        categories = Category.objects.filter(store_id = storeId).all()
        cat_ser = CategorySerializer(categories, many=True)
        return Response(cat_ser.data)
    
    def post(self, request):
        data = request.data
        serializer = CategorySerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def put(self, request):
        
        category = CategorySerializer.objects.filter(category_id=request.data.get('category_id'), store_id=request.data.get('category_id')).first()
        if not category:
            raise AuthenticationFailed("Invalid Category")
        
        data = request.data
        profile_picture = request.data.get('category_picture')
        if not data:
            raise AuthenticationFailed("Payload missing")
        
        #Changing name of image so that it is unique per customer
        if profile_picture:
            ext = profile_picture.name.split('.')[-1]
            profile_picture.name = 'category_'+str(request.data.get('category_id'))+"_"+str(category.category_id)+'.'+ext
            category.category_picture = profile_picture
        
        category_record = Category(category, data=request.data, partial=True)
        if category_record.is_valid():
            category_record.save()
            return Response(category_record.data)
        return Response(category_record.errors, status=status.HTTP_400_BAD_REQUEST)


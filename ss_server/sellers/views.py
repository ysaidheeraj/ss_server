from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SellerSerializer
from .models import Seller
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import MultiPartParser, FormParser
import jwt, datetime

def handleSellerToken(request):
    token = request.COOKIES.get('seller_jwt')

    if not token:
        raise AuthenticationFailed("Unauthenticated")
    
    try:
        payload = jwt.decode(token, 'secret', algorithm=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Login Expired')
    
    return payload
class RegisterSellerView(APIView):
    def post(self, request):
        serializer = SellerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
class LoginSellerView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        store_id = request.data['store_id']

        seller = Seller.objects.filter(email=email, store_id=store_id).first()

        if seller is None:
            raise AuthenticationFailed('User Not Found')
        
        if not seller.check_password(password):
            raise AuthenticationFailed("Incorrect Password")
        
        payload = {
            'id': seller.seller_id, #Seller id
            'store_id': store_id, #Store id of the seller
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24), #Token expiry time
            'iat': datetime.datetime.utcnow() #Token created time
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response = Response()
        response.set_cookie(key='seller_jwt', value=token, httponly=True)
        response.data = {
            'seller_jwt': token
        }
        return response

class SellerView(APIView):

    def get(self, request):
        user_info = handleSellerToken(request)
        seller = Seller.objects.filter(seller_id=user_info['id']).first()
        serializer = SellerSerializer(seller)
        return Response(serializer.data)

class SellerUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request):
        user_info = handleSellerToken(request)
        
        seller = Seller.objects.filter(seller_id=user_info['id'], store_id=user_info['store_id']).first()
        if not seller:
            raise AuthenticationFailed("User not found")
        
        data = request.data
        profile_picture = request.data.get('profile_picture')
        if not data:
            raise AuthenticationFailed("Payload missing")
        
        #Changing name of image so that it is unique per seller
        if profile_picture:
            ext = profile_picture.name.split('.')[-1]
            profile_picture.name = 'seller_'+str(user_info['store_id'])+"_"+str(seller.seller_id)+'.'+ext
            seller.profile_picture = profile_picture
        
        serializer = SellerSerializer(seller, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('seller_jwt')
        response.data = {
            'message': 'success'
        }
        return response
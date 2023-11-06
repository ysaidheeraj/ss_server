from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import StoreUserSerializer
from .models import Store_User, User_Role
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import MultiPartParser, FormParser
import jwt, datetime

def handleCustomerToken(request):
    token = request.COOKIES.get('customer_jwt')

    if not token:
        raise AuthenticationFailed("Unauthenticated")
    
    try:
        payload = jwt.decode(token, 'secret', algorithm=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Login Expired')
    
    return payload

def handleSellerToken(request):
    token = request.COOKIES.get('seller_jwt')

    if not token:
        raise AuthenticationFailed("Unauthenticated")
    
    try:
        payload = jwt.decode(token, 'secret', algorithm=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Login Expired')
    
    return payload

def authenticateUser(email, password, store_id, user_role):

    user_obj = Store_User.objects.filter(email=email, store_id=store_id, user_role=user_role).first()

    if user_obj is None:
        raise AuthenticationFailed('User Not Found')
    
    if not user_obj.check_password(password):
        raise AuthenticationFailed("Incorrect Password")
    
    return user_obj

def generate_token(user_obj, store_id, user_role):
    payload = {
        'id': user_obj.user_id, #Customer id
        'store_id': store_id, #Store id of the customer
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24), #Token expiry time
        'iat': datetime.datetime.utcnow() #Token created time
    }

    token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')
    key = 'customer_jwt' if user_role == User_Role.CUSTOMER else 'seller_jwt'
    response = Response()
    response.set_cookie(key=key, value=token, httponly=True)
    response.data = {
        key: token
    }
    return response

class RegisterCustomerView(APIView):
    def post(self, request):
        data = request.data
        data['user_role'] = User_Role.CUSTOMER
        data['username'] = 'customer_'+data['email']+"_"+str(data['store_id'])
        serializer = StoreUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginCustomerView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        store_id = request.data['store_id']

        customer = authenticateUser(email, password, store_id, User_Role.CUSTOMER)

        return generate_token(customer, store_id, User_Role.CUSTOMER)

class CustomerView(APIView):

    def get(self, request):
        user_info = handleCustomerToken(request)
        customer = Store_User.objects.filter(user_id=user_info['id'], user_role = User_Role.CUSTOMER).first()
        serializer = StoreUserSerializer(customer)
        return Response(serializer.data)

class CustomerUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request):
        user_info = handleCustomerToken(request)
        
        customer = Store_User.objects.filter(user_id=user_info['id'], store_id=user_info['store_id'], user_role=User_Role.CUSTOMER).first()
        if not customer:
            raise AuthenticationFailed("User not found")
        
        data = request.data
        profile_picture = request.data.get('profile_picture')
        if not data:
            raise AuthenticationFailed("Payload missing")
        
        #Changing name of image so that it is unique per customer
        if profile_picture:
            ext = profile_picture.name.split('.')[-1]
            profile_picture.name = 'customer_'+str(user_info['store_id'])+"_"+str(customer.user_id)+'.'+ext
            customer.profile_picture = profile_picture
        
        serializer = Store_User(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

class LogoutCustomerView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('customer_jwt')
        response.data = {
            'message': 'success'
        }
        return response

class RegisterSellerView(APIView):
    def post(self, request):
        data = request.data
        data['user_role'] = User_Role.SELLER
        data['username'] = 'seller_'+data['email']+"_"+str(data['store_id'])
        serializer = StoreUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginSellerView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        store_id = request.data['store_id']

        seller = authenticateUser(email, password, store_id, User_Role.SELLER)

        return generate_token(seller, store_id, User_Role.SELLER)

class SellerView(APIView):

    def get(self, request):
        user_info = handleSellerToken(request)
        seller = Store_User.objects.filter(user_id=user_info['id'], user_role=User_Role.SELLER).first()
        serializer = StoreUserSerializer(seller)
        return Response(serializer.data)

class SellerUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request):
        user_info = handleSellerToken(request)
        
        seller = Store_User.objects.filter(user_id=user_info['id'], store_id=user_info['store_id'], user_role=User_Role.SELLER).first()
        if not seller:
            raise AuthenticationFailed("User not found")
        
        data = request.data
        profile_picture = request.data.get('profile_picture')
        if not data:
            raise AuthenticationFailed("Payload missing")
        
        #Changing name of image so that it is unique per seller
        if profile_picture:
            ext = profile_picture.name.split('.')[-1]
            profile_picture.name = 'seller_'+str(user_info['store_id'])+"_"+str(seller.user_id)+'.'+ext
            seller.profile_picture = profile_picture
        
        serializer = StoreUserSerializer(seller, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

class LogoutSellerView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('seller_jwt')
        response.data = {
            'message': 'success'
        }
        return response



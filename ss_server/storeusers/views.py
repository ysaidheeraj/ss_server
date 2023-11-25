from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import StoreUserSerializer
from .models import Store_User, User_Role
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import jwt, datetime
from functools import wraps
from django.conf import settings
from .utils import create_model_response
from  django.contrib.auth.hashers import make_password

secret_key = settings.HASH_SECRET
def handleCustomerToken(request):
    token = request.COOKIES.get('customer_jwt')

    if not token:
        raise AuthenticationFailed("Unauthenticated")
    
    try:
        payload = jwt.decode(token, secret_key, algorithm=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Login Expired')
    
    return payload

def handleSellerToken(request):
    token = request.COOKIES.get('seller_jwt')

    if not token:
        raise AuthenticationFailed("Unauthenticated")
    
    try:
        payload = jwt.decode(token, secret_key, algorithm=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Login Expired')
    
    return payload

def authorizeUser(user_id, store_id, user_role):

    user_obj = Store_User.objects.filter(user_id=user_id, store_id=store_id, user_role=user_role).first()

    if user_obj is None:
        raise AuthenticationFailed('User Not Found')
    return user_obj

#Custom wrapper to authenticate seller
def authorize_seller(view_func):
    @wraps(view_func)
    def wrapper(self, request, *args, **kwargs):
        #Extract the storeId from the request url
        storeId = kwargs.get('storeId')
        
        #Checking for the seller token
        seller_payload = handleSellerToken(request)
        self.seller_payload = seller_payload
        
        #Authorizing the seller if found
        authorizeUser(seller_payload['id'], storeId, User_Role.SELLER)
        return view_func(self, request, *args, **kwargs)

    return wrapper

def authorize_customer(view_func):
    @wraps(view_func)
    def wrapper(self, request, *args, **kwargs):
        #Extract the storeId from the request url
        storeId = kwargs.get('storeId')
        
        #Checking for the seller token
        customer_payload = handleCustomerToken(request)

        self.customer_payload = customer_payload
        
        #Authorizing the seller if found
        authorizeUser(customer_payload['id'], storeId, User_Role.CUSTOMER)
        return view_func(self, request, *args, **kwargs)

    return wrapper

def authenticateUser(email, password, store_id, user_role):

    user_obj = Store_User.objects.filter(email=email, store_id=store_id, user_role=user_role).first()

    if user_obj is None:
        raise AuthenticationFailed('User Not Found')
    
    if not user_obj.check_password(password):
        raise AuthenticationFailed("Incorrect Password")
    
    return user_obj

def generate_token(user_obj, store_id, user_role):
    currentTime = datetime.datetime.utcnow()
    payload = {
        'id': user_obj.user_id, #Customer id
        'store_id': store_id, #Store id of the customer
        'exp': currentTime + datetime.timedelta(hours=24), #Token expiry time
        'iat': currentTime #Token created time
    }

    token = jwt.encode(payload, secret_key, algorithm='HS256').decode('utf-8')
    key = 'customer_jwt' if user_role == User_Role.CUSTOMER else 'seller_jwt'
    user_type = 'customer' if user_role == User_Role.CUSTOMER else 'seller'
    response = Response()
    response.set_cookie(key=key, value=token, httponly=True, expires=currentTime + datetime.timedelta(hours=24)) #, domain="127.0.0.1") , samesite='Lax')
    response["Access-Control-Allow-Credentials"] = "true"
    response.data = {
        key: token,
        user_type: StoreUserSerializer(user_obj).data
    }
    return response

class RegisterCustomerView(APIView):
    def post(self, request, storeId):
        data = request.data
        data['user_role'] = User_Role.CUSTOMER
        data['store_id'] = storeId
        data['username'] = 'customer_'+data['email']+"_"+str(data['store_id'])
        serializer = StoreUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        customer = Store_User.objects.filter(email=data['email'], store_id=storeId, user_role=User_Role.CUSTOMER).first()
        return generate_token(customer, storeId, User_Role.CUSTOMER)

class LoginCustomerView(APIView):
    def post(self, request, storeId):
        email = request.data['email']
        password = request.data['password']

        customer = authenticateUser(email, password, storeId, User_Role.CUSTOMER)

        return generate_token(customer, storeId, User_Role.CUSTOMER)

class CustomerView(APIView):

    @authorize_customer
    def get(self, request, storeId):
        user_info = self.customer_payload
        customer = Store_User.objects.filter(user_id=user_info['id'], user_role = User_Role.CUSTOMER, store_id=storeId).first()
        serializer = StoreUserSerializer(customer)
        return Response(create_model_response(Store_User, serializer.data))

class CustomerUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser,JSONParser)

    @authorize_customer
    def put(self, request, storeId):
        user_info = self.customer_payload
        
        customer = Store_User.objects.filter(user_id=user_info['id'], store_id=storeId, user_role=User_Role.CUSTOMER).first()
        
        data = request.data
        profile_picture = request.data.get('profile_picture')
        if not data:
            raise AuthenticationFailed("Payload missing")
        
        #Changing name of image so that it is unique per customer
        if profile_picture:
            ext = profile_picture.name.split('.')[-1]
            profile_picture.name = 'customer_'+str(user_info['store_id'])+"_"+str(customer.user_id)+'.'+ext
            customer.profile_picture = profile_picture
        
        if data.get('password'):
            data['password'] = make_password(data['password'])
        
        customer_record = StoreUserSerializer(customer, data=request.data, partial=True)
        if customer_record.is_valid():
            customer_record.save()
            return Response(create_model_response(Store_User, customer_record.data))
        return Response(customer_record.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

class LogoutCustomerView(APIView):
    def post(self, request, storeId):
        response = Response()
        response.delete_cookie('customer_jwt')
        response.data = {
            'message': 'success'
        }
        return response

class RegisterSellerView(APIView):
    def post(self, request, storeId):
        data = request.data
        data['user_role'] = User_Role.SELLER
        data['store_id'] = storeId
        data['username'] = 'seller_'+data['email']+"_"+str(data['store_id'])
        serializer = StoreUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(create_model_response(Store_User, serializer.data), status=status.HTTP_201_CREATED)

class LoginSellerView(APIView):
    def post(self, request, storeId):
        email = request.data['email']
        password = request.data['password']
        store_id = storeId

        seller = authenticateUser(email, password, store_id, User_Role.SELLER)

        return generate_token(seller, store_id, User_Role.SELLER)

class SellerView(APIView):

    @authorize_seller
    def get(self, request, storeId):
        user_info = self.seller_payload
        seller = Store_User.objects.filter(user_id=user_info['id'], user_role=User_Role.SELLER, store_id=storeId).first()
        serializer = StoreUserSerializer(seller)
        return Response(create_model_response(Store_User, serializer.data))

class SellerUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @authorize_seller
    def put(self, request, storeId):
        user_info = self.seller_payload
        
        seller = Store_User.objects.filter(user_id=user_info['id'], store_id=storeId, user_role=User_Role.SELLER).first()
        
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
            return Response(create_model_response(Store_User, serializer.data))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

class LogoutSellerView(APIView):
    def post(self, request, storeId):
        response = Response()
        response.delete_cookie('seller_jwt')
        response.data = {
            'message': 'success'
        }
        return response



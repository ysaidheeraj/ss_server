from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import StoreUserSerializer
from .models import Store_User, User_Role
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from inventory.models import Order, OrderStatus
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

def authorizeUser(user_id, store_id, user_role):
    if user_role > -1:
        user_obj = Store_User.objects.filter(user_id=user_id, store_id=store_id, user_role=user_role).first()
    else:
        user_obj = Store_User.objects.filter(user_id=user_id, store_id=store_id).first()

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
        seller_payload = handleCustomerToken(request)
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
        
        #Checking for the customer token
        customer_payload = handleCustomerToken(request)

        self.customer_payload = customer_payload
        
        #Authorizing the customer if found
        authorizeUser(customer_payload['id'], storeId, User_Role.CUSTOMER)
        return view_func(self, request, *args, **kwargs)

    return wrapper

def authorize_storeuser(view_func):
    @wraps(view_func)
    def wrapper(self, request, *args, **kwargs):
        #Extract the storeId from the request url
        storeId = kwargs.get('storeId')
        
        customer_payload = handleCustomerToken(request)

        self.customer_payload = customer_payload
        
        #Authorizing the seller if found
        authorizeUser(customer_payload['id'], storeId, -1)
        return view_func(self, request, *args, **kwargs)

    return wrapper

def authenticateUser(email, password, store_id):

    user_obj = Store_User.objects.filter(email=email, store_id=store_id).first()

    if user_obj is None:
        raise AuthenticationFailed('User Not Found')
    
    if not user_obj.check_password(password):
        raise AuthenticationFailed("Incorrect Password")
    
    return user_obj

def generate_token(user_obj, store_id):
    currentTime = datetime.datetime.utcnow()
    payload = {
        'id': user_obj.user_id, #Customer id
        'store_id': store_id, #Store id of the customer
        'exp': currentTime + datetime.timedelta(hours=24), #Token expiry time
        'iat': currentTime #Token created time
    }

    token = jwt.encode(payload, secret_key, algorithm='HS256').decode('utf-8')
    key = 'customer_jwt'
    user_type = 'customer'
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
        return generate_token(customer, storeId)

class LoginCustomerView(APIView):
    def post(self, request, storeId):
        email = request.data['email']
        password = request.data['password']

        customer = authenticateUser(email, password, storeId)

        return generate_token(customer, storeId)

class CustomerView(APIView):

    @authorize_storeuser
    def get(self, request, storeId):
        user_info = self.customer_payload
        customer = Store_User.objects.filter(user_id=user_info['id'], store_id=storeId).first()
        serializer = StoreUserSerializer(customer)
        return Response(create_model_response(Store_User, serializer.data))

class CustomerUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser,JSONParser)

    @authorize_storeuser
    def put(self, request, storeId):
        user_info = self.customer_payload
        
        customer = Store_User.objects.filter(user_id=user_info['id'], store_id=storeId).first()
        
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

 
class ListAllCustomersView(APIView):
    @authorize_seller
    def get(self, request, storeId):
        customers = Store_User.objects.filter(store_id=storeId, user_role=User_Role.CUSTOMER).all()
        customerSerData = StoreUserSerializer(customers, many=True).data

        #Also sending some sales data
        for customer in customerSerData:
            customerOrders = Order.objects.filter(customer_id=customer['user_id']).all()
            customer['num_orders'] = len(customerOrders)
            totalVal = 0
            fulfilled = 0
            inProgress = 0
            unfulfilled = 0
            for order in customerOrders:
                if order.order_status == OrderStatus.DELIVERED:
                    fulfilled += 1
                    totalVal += order.total_price
                elif order.order_status == OrderStatus.SHIPPED or order.order_status == OrderStatus.CONFIRMED or order.order_status ==OrderStatus.PAID:
                    inProgress += 1
                else:
                    unfulfilled += 1
            customer['total_sales'] = round(totalVal, 2)
            customer['fulfilled_orders'] = fulfilled
            customer['inprogress_orders'] = inProgress
            customer['unfulfilled_orders'] = unfulfilled
        return Response(create_model_response(Store_User, customerSerData))

class LogoutCustomerView(APIView):
    def post(self, request, storeId):
        response = Response()
        response.delete_cookie('customer_jwt')
        response.data = {
            'message': 'success'
        }
        return response



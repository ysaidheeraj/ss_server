from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomerSerializer
from .Models.Customer import Customer
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
class RegisterCustomerView(APIView):
    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
class LoginCustomerView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        store_id = request.data['store_id']

        customer = Customer.objects.filter(email=email, store_id=store_id).first()

        if customer is None:
            raise AuthenticationFailed('User Not Found')
        
        if not customer.check_password(password):
            raise AuthenticationFailed("Incorrect Password")
        
        payload = {
            'id': customer.customer_id, #Customer id
            'store_id': store_id, #Store id of the customer
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24), #Token expiry time
            'iat': datetime.datetime.utcnow() #Token created time
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response = Response()
        response.set_cookie(key='customer_jwt', value=token, httponly=True)
        response.data = {
            'customer_jwt': token
        }
        return response

class CustomerView(APIView):

    def get(self, request):
        user_info = handleCustomerToken(request)
        customer = Customer.objects.filter(customer_id=user_info['id']).first()
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

class CustomerUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request):
        user_info = handleCustomerToken(request)
        
        customer = Customer.objects.filter(customer_id=user_info['id'], store_id=user_info['store_id']).first()
        if not customer:
            raise AuthenticationFailed("User not found")
        
        data = request.data
        profile_picture = request.data.get('profile_picture')
        if not data:
            raise AuthenticationFailed("Payload missing")
        
        #Changing name of image so that it is unique per customer
        if profile_picture:
            ext = profile_picture.name.split('.')[-1]
            profile_picture.name = 'customer_'+str(user_info['store_id'])+"_"+str(customer.customer_id)+'.'+ext
            customer.profile_picture = profile_picture
        
        serializer = CustomerSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('customer_jwt')
        response.data = {
            'message': 'success'
        }
        return response



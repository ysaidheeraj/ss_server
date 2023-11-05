from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CustomerSerializer
from .Models.Customer import Customer
from rest_framework.exceptions import AuthenticationFailed
import jwt, datetime

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
        token = request.COOKIES.get('customer_jwt')

        if not token:
            raise AuthenticationFailed("Unauthenticated")
        
        try:
            payload = jwt.decode(token, 'secret', algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Login Expired')
        
        customer = Customer.objects.filter(customer_id=payload['id']).first()
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

class CustomerUpdateView(APIView):

    def put(self, request):
        token = request.COOKIES.get('customer_jwt')

        if not token:
            raise AuthenticationFailed("Unauthenticated")
        
        try:
            payload = jwt.decode(token, 'secret', algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Login Expired')
        
        customer = Customer.objects.filter(customer_id=payload['id']).first()
        if not customer:
            raise AuthenticationFailed("User not found")
        
        data = request.data
        if not data:
            raise AuthenticationFailed("Payload missing")
        
        if data['first_name']:
            customer.first_name = data['first_name']
        
        customer.save()

        return Response({
            'message': 'success'
        })
        
        

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('customer_jwt')
        response.data = {
            'message': 'success'
        }
        return response



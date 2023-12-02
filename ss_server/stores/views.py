from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Store
from storeusers.models import Store_User, User_Role
from .serializers import StoreSerializer
from .utils import create_model_response
from .emailservice import send_customer_ticket_to_seller
from storeusers.views import authorize_customer
# Create your views here.

class StoreActions(APIView):

    def get(self, request, storeId):
        store = Store.objects.filter(store_id=storeId).first()
        store = StoreSerializer(store)
        return Response(create_model_response(Store,store.data))
    
    def post(self, request):
        data = request.data
        serializer = StoreSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(create_model_response(Store, serializer.data), status=status.HTTP_201_CREATED)
    
class StoreTickets(APIView):

    @authorize_customer
    def post(self, request, storeId):
        data = request.data
        subject = data['subject']
        body = data['body']
        seller = Store_User.objects.filter(store_id=storeId, user_role=User_Role.SELLER).first()
        customer = Store_User.objects.filter(store_id=storeId, user_id=self.customer_payload['id']).first()
        send_customer_ticket_to_seller(seller.store_id, seller, customer, subject, body)
        return Response({"Message": "Ticket sent successfully"}, status=status.HTTP_200_OK)



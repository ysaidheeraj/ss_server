from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Store
from .serializers import StoreSerializer
from .utils import create_model_response
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

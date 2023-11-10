from django.conf import settings
from rest_framework.response import Response
import jwt
from functools import wraps
from .serializers import CategorySerializer, ItemSerializer, OrderItemSerializer, OrderSerializer
from .models import Category, Item, OrderItem, Order
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework import status
from storeusers.models import Store_User, User_Role

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
        
        #Authorizing the seller if found
        authorizeUser(customer_payload['id'], storeId, User_Role.CUSTOMER)
        return view_func(self, request, *args, **kwargs)

    return wrapper

def authorize_seller_or_customer(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        try:
            # Try seller authorization
            authorize_seller(request, *args, **kwargs)
        except AuthenticationFailed:
            try:
                # Try customer authorization if seller authorization fails
                authorize_customer(request, *args, **kwargs)
            except AuthenticationFailed:
                # If both fail, raise AuthenticationFailed
                raise AuthenticationFailed("Unauthorized")

        # If any of the authorizations succeed, proceed to the original view function
        return view_func(request, *args, **kwargs)

    return wrapper

class InitActions(APIView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        # self.customer_token = handleCustomerToken(request)

class CategoryActions(InitActions):
    def get(self, request, storeId, categoryId):
        many = False
        categories = []
        if categoryId:
            categories = Category.objects.filter(category_id=categoryId, store_id = storeId).first()
        else:
            many = True
            categories = Category.objects.filter(store_id = storeId).all()
        cat_ser = CategorySerializer(categories, many=many)
        return Response(cat_ser.data)
    
    @authorize_seller
    def post(self, request, storeId):
        data = request.data
        data['store_id'] = storeId
        serializer = CategorySerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @authorize_seller
    def put(self, request, storeId, categoryId):
        category = Category.objects.filter(category_id=categoryId, store_id=storeId).first()
        if not category:
            raise AuthenticationFailed("Invalid Category")
        
        data = request.data
        if not data:
            raise AuthenticationFailed("Payload missing")
        
        profile_picture = request.data.get('category_picture')
        #Changing name of image so that it is unique per customer
        if profile_picture:
            ext = profile_picture.name.split('.')[-1]
            profile_picture.name = 'category_'+str(storeId)+"_"+str(categoryId)+'.'+ext
            category.category_picture = profile_picture
        
        category_record = CategorySerializer(category, data=request.data, partial=True)
        if category_record.is_valid():
            category_record.save()
            return Response(category_record.data)
        else:
            return Response(category_record.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @authorize_seller
    def delete(self, request, storeId, categoryId):
        try:
            category = Category.objects.filter(category_id=categoryId, store_id=storeId).first()
            category.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class ItemActions(APIView):

    def get(self, request, storeId, itemId):
        many = False
        items = []
        if itemId:
            items = Item.objects.filter(item_id=itemId, store_id=storeId).first()
        else:
            items = Item.objects.filter(store_id=storeId).all()
            many = True
        items_serializer = ItemSerializer(items, many=many)
        return Response(items_serializer.data, status=status.HTTP_200_OK)
    
    @authorize_seller
    def post(self, request, storeId):
        data = request.data
        data['store_id'] = storeId
        item = ItemSerializer(data=data)
        item.is_valid(raise_exception=True)
        item.save()
        return Response(item.data)

    @authorize_seller
    def put(self, request, storeId, itemId):
        item = Item.objects.filter(item_id=itemId, store_id=storeId).first()
        if not item:
            raise AuthenticationFailed("Invalid Item")
        
        data = request.data
        if not data:
            raise AuthenticationFailed("Payload missing")
        
        profile_picture = request.data.get('item_image')
        #Changing name of image so that it is unique per item
        if profile_picture:
            ext = profile_picture.name.split('.')[-1]
            profile_picture.name = 'item_'+str(storeId)+"_"+str(itemId)+'.'+ext
            item.item_image = profile_picture
        
        item_record = ItemSerializer(item, data=request.data, partial=True)
        if item_record.is_valid():
            item_record.save()
            return Response(item_record.data)
        else:
            return Response(item_record.errors, status=status.HTTP_400_BAD_REQUEST)

    @authorize_seller
    def delete(self, request, storeId, itemId):
        try:
            item = Item.objects.filter(item_id=itemId, store_id=storeId).first()
            #Getting all the categories that have this item
            categories = Category.objects.filter(items=item)
            #removing item from each category
            for category in categories:
                category.items.remove(item)
                category.save()
            #Finally deleting the item
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class OrderItemActions(APIView):

    @authorize_seller_or_customer
    def get(self, request, storeId, orderItemId):
        orderItem = OrderItem.objects.filter(order_item_id=orderItemId, store_id=storeId).first()
        orderItemSerializer = OrderItemSerializer(orderItem)
        return Response(orderItemSerializer.data)
    
    @authorize_seller_or_customer
    def post(self, request, storeId):
        data = request.data
        data['store_id'] = storeId
        orderItemSerializer = OrderItemSerializer(data=data)
        orderItemSerializer.is_valid(raise_exception=True)
        orderItemSerializer.save()
        return Response(orderItemSerializer.data)
    
    @authorize_seller_or_customer
    def put(self, request, storeId, orderItemId):
        data = request.data
        orderItem = OrderItem.objects.filter(order_item_id = orderItemId, store_id = storeId).first()
        orderItemSer = OrderItemSerializer(orderItem, data=data, partial=True)
        orderItemSer.is_valid(raise_exception=True)
        orderItemSer.save()
        return Response(orderItemSer.data)
    
    @authorize_seller_or_customer
    def delete(self, request, storeId, orderItemId):
        try:
            orderItem = OrderItem.objects.filter(order_item_id = orderItemId, store_id = storeId).first()
            orderItem.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


from django.conf import settings
from rest_framework.response import Response
from django.db import transaction
from functools import wraps
from .serializers import CategorySerializer, ItemSerializer, OrderItemSerializer, OrderSerializer, ShippingAddressSerializer
from .models import Category, Item, OrderItem, Order, OrderStatus
from rest_framework.exceptions import AuthenticationFailed, APIException
from rest_framework.views import APIView
from rest_framework import status
from django.db import transaction
from storeusers.views import authorize_customer, authorize_seller
from django.utils import timezone
from .utils import create_model_response

class InitActions(APIView):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        # self.customer_token = handleCustomerToken(request)

class CategoryActions(APIView):
    def get(self, request, storeId, categoryId=None):
        many = False
        categories = []
        if categoryId:
            categories = Category.objects.filter(category_id=categoryId, store_id = storeId).first()
        else:
            many = True
            categories = Category.objects.filter(store_id = storeId).all()
        cat_ser = CategorySerializer(categories, many=many)
        return Response(create_model_response(Category, cat_ser.data))
    
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

    def get(self, request, storeId, itemId=None):
        many = False
        items = []
        if itemId:
            items = Item.objects.filter(item_id=itemId, store_id=storeId).first()
            if not items:
                raise APIException("Invalid Item")
        else:
            items = Item.objects.filter(store_id=storeId).all()
            many = True
        items_serializer = ItemSerializer(items, many=many)
        return Response(create_model_response(Item, items_serializer.data))
    
    @authorize_seller
    def post(self, request, storeId):
        data = request.data
        data['store_id'] = storeId
        item = ItemSerializer(data=data)
        item.is_valid(raise_exception=True)
        item.save()
        return Response(create_model_response(Item, item.data), status=status.HTTP_201_CREATED)

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
            return Response(create_model_response(Item, item_record.data))
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

    @authorize_customer
    def get(self, request, storeId, orderItemId=None, orderId=None):
        many = True
        orderItems = []
        if orderId:
            orderItems = OrderItem.objects.filter(order=orderId, store_id=storeId).all()
        else:
            orderItems = OrderItem.objects.filter(order_item_id=orderItemId, store_id=storeId).first()
            many = False
        orderItemSerializer = OrderItemSerializer(orderItems, many=many)
        return Response(orderItemSerializer.data)
    
    def validate_item_quantity(self, data, item):
        if data['item_quantity']:
            if data['item_quantity'] > item.item_available_count:
                raise APIException("Order Item quantity cannot exceed available stock")
        return
    
    @authorize_customer
    def post(self, request, storeId):
        data = request.data
        data['store_id'] = storeId
        data['customer_id'] = self.customer_payload['id']
        item = Item.objects.filter(item_id=data['item'], store_id=storeId).first()
        if not item:
            raise APIException("Item does not exist in the store")
        self.validate_item_quantity(data, item)
        orderItemSerializer = OrderItemSerializer(data=data)
        orderItemSerializer.is_valid(raise_exception=True)
        orderItemSerializer.save()
        return Response(orderItemSerializer.data)
    
    @authorize_customer
    def put(self, request, storeId, orderItemId):
        data = request.data
        orderItem = OrderItem.objects.filter(order_item_id = orderItemId, store_id = storeId).first()
        self.validate_item_quantity(data, orderItem.item)
        orderItemSer = OrderItemSerializer(orderItem, data=data, partial=True)
        orderItemSer.is_valid(raise_exception=True)
        orderItemSer.save()
        return Response(orderItemSer.data)
    
    @authorize_customer
    def delete(self, request, storeId, orderItemId):
        try:
            orderItem = OrderItem.objects.filter(order_item_id = orderItemId, store_id = storeId).first()
            orderItem.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class OrderActions(APIView):
    
    @authorize_customer
    def get(self, request, storeId, orderId=None):
        orders = []
        order_status = request.GET.get('order_status')
        many = False
        if orderId:
            orders = Order.objects.filter(order_id=orderId, customer_id = self.customer_payload['id'], store_id=storeId).first()
        #For returning current customer cart
        elif order_status is not None and order_status == OrderStatus.CART:
            orders = Order.objects.filter(customer_id = self.customer_payload['id'], store_id=storeId, order_status=OrderStatus.CART).first()
        else:
            orders = Order.objects.filter(customer_id=self.customer_payload['id'], store_id=storeId).all()
            many = True
        if orders is not None:
            ser = OrderSerializer(orders, many=many)
            return Response(create_model_response(Order, ser.data))
        return Response(orders)
    
    @authorize_customer
    @transaction.atomic
    def post(self, request, storeId):
        data = request.data

        orderItems = data.pop('orderItems')
        shippingAddress = data.pop('shippingAddress')
        if not orderItems:
            raise APIException('Order Items missing in the request')
        
        #Creating order object
        current_time = timezone.now()
        data['store_id'] = storeId
        data['customer_id'] = self.customer_payload['id']
        data['order_status'] = OrderStatus.PAID
        data['order_paid_time'] = current_time
        ser = OrderSerializer(data = data)
        ser.is_valid(raise_exception=True)
        ser.save()
        order = Order.objects.filter(customer_id=self.customer_payload['id'], store_id=storeId, order_paid_time=current_time).first()
        
        #Creating the shipping address object
        shippingAddress['order'] = order.order_id
        shippingAddress['postalCode'] = shippingAddress.pop('pinCode')
        shippingAddressSer = ShippingAddressSerializer(data=shippingAddress)
        shippingAddressSer.is_valid(raise_exception=True)
        shippingAddressSer.save()

        for orderItem in orderItems:
            item = Item.objects.get(item_id=orderItem['item'])
            orderItemSer = OrderItemSerializer(data={
                'store_id': storeId,
                'customer_id': self.customer_payload['id'],
                'item': item.item_id,
                'item_quantity' : orderItem['quantity'],
                'order': order.order_id,
                'item_price': orderItem['price']
            })
            orderItemSer.is_valid(raise_exception=True)
            orderItemSer.save()

        order = OrderSerializer(order).data
        order_status = order['order_status']
        if order_status == OrderStatus.PAID or order_status == OrderStatus.CANCELLED or order_status == OrderStatus.RETURNED:
            orderItems = order['order_items']
            if isinstance(orderItems, list) and len(orderItems) > 0:
                # Update available quantity for each item
                with transaction.atomic():
                    for order_item in orderItems:
                        self.update_item_and_order_item(order_item, deduct=data['order_status'] == OrderStatus.PAID)
            else:
                raise APIException("There are no items in this order")
        
        return Response(create_model_response(Order, order))
    
    def update_item_and_order_item(self, order_item, deduct=True):
        # Assuming 'item' is the OneToOneField relationship to the Item model
        item = order_item['Item']
        item = Item.objects.filter(item_id=item['item_id'], store_id=item['store_id']).first()
        order_item = OrderItem.objects.filter(order_item_id=order_item['order_item_id'], store_id=order_item['store_id']).first()
        # Assuming 'item_quantity' is the field to be updated
        new_quantity = item.item_available_count + order_item.item_quantity
        if deduct:
            new_quantity = item.item_available_count - order_item.item_quantity
        if new_quantity >= 0:
            itemdata = {'item_available_count' : new_quantity}
            orderItemData = {'item_price' : item.item_price}

            item_ser = ItemSerializer(item, data=itemdata, partial=True)
            item_ser.is_valid(raise_exception=True)
            item_ser.save()

            order_item_ser = OrderItemSerializer(order_item, data=orderItemData, partial=True)
            order_item_ser.is_valid(raise_exception=True)
            order_item_ser.save()
        else:
            raise APIException("Invalid Order Quantity")

    @authorize_customer
    def put(self, request, storeId, orderId):
        order = Order.objects.filter(order_id = orderId, store_id=storeId, customer_id=self.customer_payload['id']).first()
        data = request.data
        if data['order_status'] == OrderStatus.PAID or data['order_status'] == OrderStatus.CANCELLED or data['order_status'] == OrderStatus.RETURNED:
            order = OrderSerializer(order)
            orderItems = order.data['order_items']
            if isinstance(orderItems, list) and len(orderItems) > 0:
                # Update available quantity for each item
                with transaction.atomic():
                    for order_item in orderItems:
                        self.update_item_and_order_item(order_item, deduct=data['order_status'] == OrderStatus.PAID)
            else:
                raise APIException("There are no items in this order")
        if data['order_status'] == OrderStatus.DELIVERED:
            data['order_paid_time'] = timezone.now()
        orderSer = OrderSerializer(order, data=request.data)
        orderSer.is_valid(raise_exception=True)
        orderSer.save()
        return Response(orderSer.data)
    
class SellerOrderActions(APIView):

    @authorize_seller
    def get(self, request, storeId, customerId, orderId):
        if customerId and orderId:
            orders = Order.objects.filter(customer_id = customerId, order_id = orderId, store_id=storeId).all()
        elif customerId:
            orders = Order.objects.filter(customer_id = customerId, store_id=storeId).all()
        else:
            orders = Order.objects.filter(store_id=storeId).all()
        ser = OrderSerializer(orders, many=True)
        order_items = OrderItem.objects.filter(order=orderId, customer_id=customerId, store_id=storeId).all()
        order_items = OrderItemSerializer(order_items, many=True)
        return Response({
            "order": ser.data,
            "order_items": order_items.data
            })
    
    @authorize_seller
    def put(self, request, storeId, orderId):
        order = Order.objects.filter(order_id = orderId, store_id=storeId).first()
        orderSer = OrderSerializer(order, data=request.data)
        orderSer.is_valid(raise_exception=True)
        orderSer.save()
        return Response(orderSer.data)
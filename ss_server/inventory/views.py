from django.conf import settings
from rest_framework.response import Response
from django.db import transaction
from functools import wraps
from .serializers import CategorySerializer, ItemSerializer, OrderItemSerializer, OrderSerializer, ShippingAddressSerializer, ReviewSerializer
from storeusers.models import Store_User, User_Role
from storeusers.serializers import StoreUserSerializer
from .models import Category, Item, OrderItem, Order, OrderStatus, OrderPaymentMethod, Reviews
from rest_framework.exceptions import AuthenticationFailed, APIException
from rest_framework.views import APIView
from rest_framework import status
from django.db import transaction
from storeusers.views import authorize_customer, authorize_seller, authorize_storeuser, handleCustomerToken
from django.utils import timezone
from .utils import create_model_response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .emailservice import send_order_status_update_email

class CategoryActions(APIView):
    parser_classes = (MultiPartParser, FormParser,JSONParser)
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
        data = request.data
        if len(data) == 0:
            data['category_name'] = 'Sample category'
        data['store_id'] = storeId
        serializer = CategorySerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(create_model_response(Category, serializer.data))
    
    @authorize_seller
    def put(self, request, storeId, categoryId):
        category = Category.objects.filter(category_id=categoryId, store_id=storeId).first()
        if not category:
            raise AuthenticationFailed("Invalid Category")
        
        profile_picture = request.data.get('category_picture')
        #Changing name of image so that it is unique per customer
        if profile_picture:
            ext = profile_picture.name.split('.')[-1]
            profile_picture.name = 'category_'+str(storeId)+"_"+str(categoryId)+'.'+ext
            category.category_picture = profile_picture
        
        category_record = CategorySerializer(category, data=request.data, partial=True)
        if category_record.is_valid():
            category_record.save()
            return Response(create_model_response(Category, category_record.data))
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
    parser_classes = (MultiPartParser, FormParser,JSONParser)

    def canCustomerReview(self, item, customer, storeId):
        orderItems = OrderItem.objects.filter(customer_id=customer.user_id, item=item['item_id'], store_id=storeId).all()
        if len(orderItems) > 0:
            for orderItem in orderItems:
                order = Order.objects.filter(store_id=storeId, order_id=orderItem.order.order_id).first()
                if order.order_status >= OrderStatus.DELIVERED:
                    review = Reviews.objects.filter(customer = customer.user_id, item=item['item_id'], store_id=storeId).first()
                    if not review:
                        item['canReview'] = True
        return item
    
    def get(self, request, storeId, itemId=None):
        many = False
        items = []
        if itemId:
            items = Item.objects.filter(item_id=itemId, store_id=storeId).first()
            if not items:
                raise APIException("Invalid Item")
            
            try:
                items_serializer_data = ItemSerializer(items, many=False).data
                reviews = Reviews.objects.filter(item=itemId, store_id=storeId).all()
                reviewsSer = ReviewSerializer(reviews, many=True)
                items_serializer_data['reviews'] = reviewsSer.data

                customer_token = handleCustomerToken(request)
                customer = Store_User.objects.filter(user_id = customer_token['id'], store_id=storeId, user_role=User_Role.CUSTOMER).first()
                #Checking if customer can review
                if customer:
                    items_serializer_data['canReview'] = False
                    items_serializer_data = self.canCustomerReview(items_serializer_data, customer, storeId)
            except Exception as ex:
                print('Exception', ex)
            return Response(create_model_response(Item, items_serializer_data))

        searchQuery = request.query_params.get('search')
        category = request.query_params.get('category')
        response_obj = {}

        if searchQuery == None:
            searchQuery = ''

        if category != None and int(category) > -1:
            category = Category.objects.filter(category_id=category, store_id=storeId).first()
            if not category:
                raise APIException("Invalid Category")

            items = category.items.order_by('item_created_time')
            items = items.filter(item_name__icontains=searchQuery)
            many = True
        else:
            items = Item.objects.filter(store_id=storeId, item_name__icontains=searchQuery).order_by('item_created_time').all()

        page = request.query_params.get('page')
        paginator = Paginator(items, 10)

        try:
            items = paginator.page(page)
        except PageNotAnInteger:
            items = paginator.page(1)
        except EmptyPage:
            items = paginator.page(paginator.num_pages)
        
        if page == None:
            page = 1
        page = int(page)
        many = True

        response_obj['page'] = page
        response_obj['pages'] = paginator.num_pages
        items_serializer_data = ItemSerializer(items, many=many).data
        
        if many ==True:
            response_obj[Item.__name__] = items_serializer_data
            return Response(response_obj)
        return Response(create_model_response(Item, items_serializer_data))
    
    @authorize_seller
    def post(self, request, storeId):
        data = request.data
        if len(data) == 0:
            data['item_name'] = 'Sample item'
            data['item_price'] = 0
            data['item_available_count'] = 0
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
        
        categories = request.data.pop('categories') if request.data.get('categories') else None
        if categories:
            item.category_set.clear()
            for categoryId in categories:
                category = Category.objects.filter(store_id=storeId, category_id=categoryId).first()
                if category:
                    category.items.add(item)
                else:
                    raise APIException('Invalid Category')
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

# class OrderItemActions(APIView):

#     @authorize_customer
#     def get(self, request, storeId, orderItemId=None, orderId=None):
#         many = True
#         orderItems = []
#         if orderId:
#             orderItems = OrderItem.objects.filter(order=orderId, store_id=storeId).all()
#         else:
#             orderItems = OrderItem.objects.filter(order_item_id=orderItemId, store_id=storeId).first()
#             many = False
#         orderItemSerializer = OrderItemSerializer(orderItems, many=many)
#         return Response(orderItemSerializer.data)
    
#     def validate_item_quantity(self, data, item):
#         if data['item_quantity']:
#             if data['item_quantity'] > item.item_available_count:
#                 raise APIException("Order Item quantity cannot exceed available stock")
#         return
    
#     @authorize_customer
#     def post(self, request, storeId):
#         data = request.data
#         data['store_id'] = storeId
#         data['customer_id'] = self.customer_payload['id']
#         item = Item.objects.filter(item_id=data['item'], store_id=storeId).first()
#         if not item:
#             raise APIException("Item does not exist in the store")
#         self.validate_item_quantity(data, item)
#         orderItemSerializer = OrderItemSerializer(data=data)
#         orderItemSerializer.is_valid(raise_exception=True)
#         orderItemSerializer.save()
#         return Response(orderItemSerializer.data)
    
#     @authorize_customer
#     def put(self, request, storeId, orderItemId):
#         data = request.data
#         orderItem = OrderItem.objects.filter(order_item_id = orderItemId, store_id = storeId).first()
#         self.validate_item_quantity(data, orderItem.item)
#         orderItemSer = OrderItemSerializer(orderItem, data=data, partial=True)
#         orderItemSer.is_valid(raise_exception=True)
#         orderItemSer.save()
#         return Response(orderItemSer.data)
    
#     @authorize_customer
#     def delete(self, request, storeId, orderItemId):
#         try:
#             orderItem = OrderItem.objects.filter(order_item_id = orderItemId, store_id = storeId).first()
#             orderItem.delete()

#             return Response(status=status.HTTP_204_NO_CONTENT)
#         except:
#             return Response(status=status.HTTP_404_NOT_FOUND)

class OrderActions(APIView):
    
    @authorize_storeuser
    def get(self, request, storeId, orderId=None):
        orders = []
        order_status = request.GET.get('order_status')
        many = False
        if orderId:
            orders = Order.objects.filter(order_id=orderId, store_id=storeId).first()
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
        data['store_id'] = storeId
        data['customer_id'] = self.customer_payload['id']
        data['order_status'] = OrderStatus.CONFIRMED
        ser = OrderSerializer(data = data)
        ser.is_valid(raise_exception=True)
        ser.save()
        order = Order.objects.filter(order_id=ser.instance.order_id, customer_id=self.customer_payload['id'], store_id=storeId).first()
        
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

    @authorize_storeuser
    @transaction.atomic
    def put(self, request, storeId, orderId):
        order = Order.objects.filter(order_id = orderId, store_id=storeId).first()
        data = request.data
        if data['order_status'] == OrderStatus.PAID or data['order_status'] == OrderStatus.CANCELLED or data['order_status'] == OrderStatus.RETURNED:
            orderSerObj = OrderSerializer(order)
            orderItems = orderSerObj.data['order_items']
            if isinstance(orderItems, list) and len(orderItems) > 0:
                # Update available quantity for each item
                with transaction.atomic():
                    for order_item in orderItems:
                        self.update_item_and_order_item(order_item, deduct=data['order_status'] == OrderStatus.PAID)
            else:
                raise APIException("There are no items in this order")
        if data['order_status'] == OrderStatus.DELIVERED and order.payment_method == OrderPaymentMethod.COD:
            data['order_paid_time'] = timezone.now()
        orderSer = OrderSerializer(order, data=request.data, partial=True)
        orderSer.is_valid(raise_exception=True)
        orderSer.save()
        send_order_status_update_email(orderSer.data)
        return Response(create_model_response(Order, orderSer.data))
    
class SellerOrderActions(APIView):

    @authorize_seller
    def get(self, request, storeId):
        orders = Order.objects.filter(store_id=storeId).all()
        ser = OrderSerializer(orders, many=True)
        for order in ser.data:
            customer = Store_User.objects.filter(store_id=storeId, user_id=order['customer_id']).first()
            order['customer'] = StoreUserSerializer(customer).data
        return Response(create_model_response(Order, ser.data))

class ReviewActions(APIView):

    @authorize_customer
    @transaction.atomic
    def post(self, request, storeId, itemId):
        data = request.data
        data['store_id'] = storeId
        data['customer'] = self.customer_payload['id']
        data['item'] = itemId
        ser = ReviewSerializer(data=data)
        existingReview = Reviews.objects.filter(customer=self.customer_payload['id'], item=itemId, store_id=storeId)
        if existingReview:
            raise APIException("Already Reviewed")
        
        if not data['review_rating']:
            raise APIException("Rating Missing")
        ser.is_valid(raise_exception=True)
        ser.save()

        #Updating the rating of the item
        allItemReviews = Reviews.objects.filter(item=data['item'], store_id=storeId).all()
        total = 0
        for review in allItemReviews:
            total += review.review_rating
        
        total = total/len(allItemReviews)

        item = Item.objects.filter(item_id=data['item'], store_id=storeId).first()
        updateData = {'rating': total}
        itemser = ItemSerializer(item, data=updateData, partial=True)
        itemser.is_valid()
        itemser.save()
        return Response(
            {
                Reviews.__name__: ser.data,
                Item.__name__: itemser.data
            })
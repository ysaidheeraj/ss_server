from rest_framework import serializers
from .models import Category, Item, Order, OrderItem, Review, ShippingAddress
from stores.models import Store

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        category_picture = serializers.ImageField(required=False, max_length=None, use_url=True)
        fields = ['category_id', 'category_name', 'category_picture', 'store_id', 'category_created_time', 'items']
    

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        item_image = serializers.ImageField(required=False, max_length=None, use_url=True)
        fields = ['item_id', 'item_name', 'item_price', 'item_available_count', 'item_unit', 'store_id', 'item_image', 'rating', 'num_reviews', 'item_description']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"
    def to_representation(self, instance):
        data = super(OrderItemSerializer, self).to_representation(instance)
        item_data = Item.objects.filter(item_id=data['item']).first()
        items_serializer = ItemSerializer(item_data)
        data[Item.__name__] = items_serializer.data
        return data

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['order_id', 'customer_id', 'store_id', 'order_created_time', 'order_last_updated_time', 'order_status', 'order_items']
    def to_representation(self, instance):
        data = super(OrderSerializer, self).to_representation(instance)
        order_items = OrderItem.objects.filter(order=instance)
        order_items_serializer = OrderItemSerializer(order_items, many=True)
        data[OrderItem.__name__] = order_items_serializer.data
        return data

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"
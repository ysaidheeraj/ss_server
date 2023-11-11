from rest_framework import serializers
from .models import Category, Item, Order, OrderItem
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
        fields = ['item_id', 'item_name', 'item_price', 'item_available_count', 'item_unit', 'store_id', 'item_image']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['order_id', 'customer_id', 'store_id', 'order_created_time', 'order_last_updated_time', 'order_status', 'order_items']
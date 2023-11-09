from rest_framework import serializers
from .models import Category, Item
from stores.models import Store

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        category_picture = serializers.ImageField(required=False, max_length=None, use_url=True)
        fields = ['category_id', 'category_name', 'category_picture', 'store_id', 'category_created_time']

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        item_image = serializers.ImageField(required=False, max_length=None, use_url=True)
        fields = ['item_id', 'item_name', 'item_price', 'item_available_count', 'item_unit', 'store_id', 'item_image']
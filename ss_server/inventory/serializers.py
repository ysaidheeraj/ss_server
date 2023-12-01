from rest_framework import serializers
from .models import Category, Item, Order, OrderItem, Reviews, ShippingAddress
from storeusers.serializers import StoreUserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        category_picture = serializers.ImageField(required=False, max_length=None, use_url=True)
        fields = ['category_id', 'category_name', 'category_picture', 'store_id', 'category_created_time', 'items', 'category_last_updated_time']
    

class ItemSerializer(serializers.ModelSerializer):
    item_image = serializers.ImageField(required=False, max_length=None, use_url=True)
    class Meta:
        model = Item
        fields = ['item_id', 'item_name', 'item_price', 'item_available_count', 'item_unit', 'store_id', 'item_image', 'rating', 'num_reviews', 'item_description', 'item_updated_time']
    def to_representation(self, instance):
        data = super(ItemSerializer, self).to_representation(instance)
        categories = Category.objects.filter(store_id=instance.store_id)
        item_categories = []
        for category in categories:
            category_item = category.items.filter(item_id=instance.item_id)
            if(category_item):
                item_categories.append(CategorySerializer(category).data)
        data['categories'] = item_categories
        return data


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

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)
    class Meta:
        model = Order
        fields = ['order_id', 'customer_id', 'store_id', 'order_created_time', 'order_last_updated_time', 'order_status', 'order_items', 'total_price', 'tax_price', 'order_paid_time', 'payment_method', 'shipping_price', 'items_price', 'shipping_address']
    def to_representation(self, instance):
        data = super(OrderSerializer, self).to_representation(instance)
        order_items = OrderItem.objects.filter(order=instance)
        order_items_serializer = OrderItemSerializer(order_items, many=True)
        data['order_items'] = order_items_serializer.data

        data['customer'] = StoreUserSerializer(instance.customer_id).data

        shippingAddress = ShippingAddress.objects.filter(order=instance.order_id).first()
        data['shipping_address'] = ShippingAddressSerializer(shippingAddress).data
        return data

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviews
        fields = "__all__"
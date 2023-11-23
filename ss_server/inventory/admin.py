from django.contrib import admin
from .models import Category, Item, Order, OrderItem, Review, ShippingAddress
# Register your models here.

admin.site.register(Item)
admin.site.register(Category)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Review)
admin.site.register(ShippingAddress)
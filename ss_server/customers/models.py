from django.db import models
from stores.models import Store
from sellers.models import Seller
from inventory.models import Item

from .Models import Customer, Shopping_Cart, WishList
# Create your models here.

class Sale_Status(models.IntegerChoices):
    ORDERED = 1,
    SHIPPED = 2,
    DELIVERED = 3,
    CANCELLED = 4,
    RETURNED = 5
class Customer_Sales(models.Model):
    sale_id = models.AutoField(primary_key=True)
    customer_id = models.ForeignKey(Customer.Customer, on_delete=models.SET_NULL, null=True, blank=True)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    total_price = models.FloatField(default=0.0)
    date_of_sale = models.DateTimeField(auto_now_add=True)
    last_updated_time = models.DateTimeField(auto_now=True)
    item_id = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True, blank=True)
    item_quantity = models.SmallIntegerField(default=1)
    status = models.IntegerField(choices=Sale_Status.choices, default=Sale_Status.ORDERED)
    seller_id = models.ForeignKey(Seller, on_delete=models.CASCADE)

class Item_Sale_Mapping(models.Model):
    item_sale_mapping_id = models.AutoField(primary_key=True)
    sale_id = models.ForeignKey(Customer_Sales, on_delete=models.CASCADE)
    item_id = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True, blank=True)
    item_count = models.SmallIntegerField(default=1)
    item_price_per_unit = models.FloatField()
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    seller_id = models.ForeignKey(Seller, on_delete=models.CASCADE)

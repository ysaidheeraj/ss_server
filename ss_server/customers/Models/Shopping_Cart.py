from django.db import models
from .Customer import Customer
from stores.models import Store
from inventory.models import Item
from django.core.validators import MinValueValidator

class Shopping_Cart(models.Model):
    shopping_cart_id = models.AutoField(primary_key=True)
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE)
    item_quantity = models.IntegerField(MinValueValidator(1))
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    wishlist_created_time = models.DateTimeField(auto_now_add=True)
    wishlist_updated_time = models.DateTimeField(auto_now=True)


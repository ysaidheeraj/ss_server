from django.db import models
from .Customer import Customer
from stores.models import Store
from inventory.models import Item

class WishList(models.Model):
    wishlist_id = models.AutoField(primary_key=True)
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    wishlist_created_time = models.DateTimeField(auto_now_add=True)
    wishlist_updated_time = models.DateTimeField(auto_now=True)
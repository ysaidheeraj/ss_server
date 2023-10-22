from django.db import models
from .Customer import Customer

class WishList(models.Model):
    wishlist_id = models.AutoField(primary_key=True)
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    # item_id
    # store_id
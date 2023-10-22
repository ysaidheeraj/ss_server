from django.db import models
from .Customer import Customer
from django.core.validators import MinValueValidator

class Shopping_Cart(models.Model):
    shopping_cart_id = models.AutoField(primary_key=True)
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    # item_id
    item_quantity = models.IntegerField(MinValueValidator(1))
    # store_id = 


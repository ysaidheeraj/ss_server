from django.db import models
from stores.models import Store

# Create your models here.

class Item_Units(models.IntegerChoices):
    QUANTITY = 1,
    WEIGHT_MG = 2,
    WEIGHT_G = 3,
    WEIGHT_KG = 4,
    WEIGHT_TONNES = 5,
    VOLUME_ML = 6,
    VOLUME_L = 7

class Item_Group(models.Model):
    item_group_id = models.AutoField(primary_key=True)
    item_group_name = models.CharField(max_length=100)
    item_group_image = models.BinaryField(null=True, blank=True)
    item_group_description = models.CharField(max_length=1000)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    item_group_unit = models.IntegerField(choices=Item_Units.choices, default=Item_Units.QUANTITY)

class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=100)
    item_price = models.FloatField()
    item_available_count = models.FloatField()
    item_group_id = models.ForeignKey(Item_Group, on_delete=models.CASCADE)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
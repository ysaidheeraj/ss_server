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

def custom_image_upload(instance, filename):
    old_instance = Item.objects.get(pk=instance.pk)
    old_instance.image.delete()  # Delete the old image
    return 'inventory/item_images/{}'.format(filename)

# class Item_Group(models.Model):
#     item_group_id = models.AutoField(primary_key=True)
#     item_group_name = models.CharField(max_length=100)
#     item_group_image = models.BinaryField(null=True, blank=True)
#     item_group_description = models.CharField(max_length=1000)
#     store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
#     item_group_unit = models.IntegerField(choices=Item_Units.choices, default=Item_Units.QUANTITY)
#     item_group_created_time = models.DateTimeField(auto_now_add=True)
#     item_group_updated_time = models.DateTimeField(auto_now=True)
class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=100)
    item_price = models.FloatField()
    item_available_count = models.FloatField()
    # item_group_id = models.ForeignKey(Item_Group, on_delete=models.CASCADE)
    item_unit = models.IntegerField(choices=Item_Units.choices, default=Item_Units.QUANTITY)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    item_created_time = models.DateTimeField(auto_now_add=True)
    item_updated_time = models.DateTimeField(auto_now=True)
    item_image = models.ImageField(upload_to=custom_image_upload, null=True, blank=True)

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)
    category_picture = models.BinaryField()
    category_last_updated_time = models.DateTimeField(auto_now=True)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    category_created_time = models.DateTimeField(auto_now_add=True)
    category_last_updated_time = models.DateTimeField(auto_now=True)
    items = models.ManyToManyField(Item)
# class Item_Group_Category_Mapping(models.Model):
#     item_group_category_mapping_id = models.AutoField(primary_key=True)
#     item_group_id = models.ForeignKey(Item_Group, on_delete=models.CASCADE)
#     category_id = models.ForeignKey(Category, on_delete=models.CASCADE)
#     created_time = models.DateTimeField(auto_now_add=True)
#     store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
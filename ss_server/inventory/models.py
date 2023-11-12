from django.db import models
from stores.models import Store
from storeusers.models import Store_User
from django.core.validators import MinValueValidator

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
    old_instance.item_image.delete()  # Delete the old image
    return 'inventory/item_images/{}'.format(filename)

def custom_category_image_upload(instance, filename):
    old_instance = Category.objects.get(pk=instance.pk)
    old_instance.category_picture.delete()  # Delete the old image
    return 'inventory/category_images/{}'.format(filename)

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
    item_available_count = models.FloatField(validators=[MinValueValidator(0)])
    # item_group_id = models.ForeignKey(Item_Group, on_delete=models.CASCADE)
    item_unit = models.IntegerField(choices=Item_Units.choices, default=Item_Units.QUANTITY)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    item_created_time = models.DateTimeField(auto_now_add=True)
    item_updated_time = models.DateTimeField(auto_now=True)
    item_image = models.ImageField(upload_to=custom_image_upload, null=True, blank=True)

    class Meta:
        unique_together = (("item_name", "store_id"))

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)
    category_picture = models.ImageField(upload_to=custom_category_image_upload, null=True, blank=True)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    category_created_time = models.DateTimeField(auto_now_add=True)
    category_last_updated_time = models.DateTimeField(auto_now=True)
    items = models.ManyToManyField(Item, blank=True)

    class Meta:
        unique_together = (("category_name", "store_id"))

class OrderStatus(models.IntegerChoices):
    CART = 0,
    PAID = 1,
    SHIPPED = 2,
    DELIVERED = 3,
    CANCELLED = 4,
    RETURNED = 5,
    REFUND = 6
    
class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer_id = models.ForeignKey(Store_User, on_delete=models.CASCADE)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    order_created_time = models.DateTimeField(auto_now_add=True)
    order_last_updated_time = models.DateTimeField(auto_now=True)
    order_status = models.IntegerField(choices=OrderStatus.choices, default=OrderStatus.CART)
    total_price = models.FloatField(null=True)

class OrderItem(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    item = models.OneToOneField(Item, on_delete=models.CASCADE)
    item_quantity = models.FloatField(null=True)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    item_price = models.FloatField(null=True),
    customer_id = models.ForeignKey(Store_User, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('item', 'order', 'store_id', 'customer_id'))
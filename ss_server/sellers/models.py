from django.db import models
from django.core.validators import RegexValidator
from stores.models import Store
from django.contrib.auth.models import AbstractUser

# Create your models here.
phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$'
)

def custom_image_upload(instance, filename):
    old_instance = Seller.objects.get(pk=instance.pk)
    old_instance.profile_picture.delete()  # Delete the old image
    return 'sellers/profile_pictures/{}'.format(filename)
class Seller(AbstractUser):
    seller_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(
        max_length=15,
        validators=[phone_regex]
    )
    store_id = models.ForeignKey(Store, related_name="sellers", on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to=custom_image_upload, blank=True, null=True)
    address = models.TextField(max_length=500, null=True, blank=True)
    seller_created_time = models.DateTimeField(auto_now_add=True)
    seller_updated_time = models.DateTimeField(auto_now=True)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        unique_together = (("email", "store_id"),)

Seller._meta.get_field('groups').remote_field.related_name = 'seller_groups'
Seller._meta.get_field('user_permissions').remote_field.related_name = 'seller_user_permissions'
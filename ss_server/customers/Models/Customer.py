from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from stores.models import Store

phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$'
)

class Customer(AbstractUser):
    customer_id = models.AutoField(primary_key=True)
    phone_number = models.CharField(
        max_length=15,
        validators=[phone_regex]
    )
    store_id = models.ForeignKey(Store, related_name="customers", on_delete=models.CASCADE)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    address = models.TextField(max_length=500, null=True, blank=True)
    customer_created_time = models.DateTimeField(auto_now_add=True)
    customer_updated_time = models.DateTimeField(auto_now=True)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        unique_together = (("email", "store_id"),)

Customer._meta.get_field('groups').remote_field.related_name = 'customer_groups'
Customer._meta.get_field('user_permissions').remote_field.related_name = 'customer_user_permissions'

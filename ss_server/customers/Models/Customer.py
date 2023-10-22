from django.db import models
from django.core.validators import RegexValidator
from stores.models import Store

phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$'
)

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100)
    email_id = models.EmailField()
    phone_number = models.CharField(
        max_length=15,
        validators=[phone_regex]
    )
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE)
    profile_picture = models.BinaryField(null=True, blank=True)
    address = models.TextField(max_length=500, null=True, blank=True)
    customer_created_time = models.DateTimeField(auto_now_add=True)
    customer_updated_time = models.DateTimeField(auto_now=True)


from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from stores.models import Store

phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$'
)

def custom_image_upload(instance, filename):
    old_instance = Store_User.objects.get(pk=instance.pk)
    old_instance.profile_picture.delete()  # Delete the old image
    return 'storeusers/profile_pictures/{}'.format(filename)
class User_Role(models.IntegerChoices):
    CUSTOMER = 0,
    SELLER = 1,
    ADMIN = 3
class Store_User(AbstractUser):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(
        max_length=15,
        validators=[phone_regex]
    )
    store_id = models.ForeignKey(Store, related_name="users", on_delete=models.CASCADE)
    password = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to=custom_image_upload, blank=True, null=True)
    address = models.TextField(max_length=500, null=True, blank=True)
    user_created_time = models.DateTimeField(auto_now_add=True)
    user_updated_time = models.DateTimeField(auto_now=True)
    user_role = models.IntegerField(choices=User_Role.choices, blank=True, null=True)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta:
        unique_together = (("email", "store_id", "user_role"),)
from django.db import models

# Create your models here.
class Store(models.Model):
    store_id = models.AutoField(primary_key=True)
    store_name = models.CharField(max_length=100)
    store_description = models.CharField(max_length=1000)
    store_description = models.BinaryField()

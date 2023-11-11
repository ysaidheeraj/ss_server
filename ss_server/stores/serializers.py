from .models import Store
from rest_framework import serializers

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = "__all__"
    # customers = CustomerSerializer(many=True)

    # def create(self, validated_data):
    #     customers_data = validated_data.pop("customers")
    #     store = Store.objects.create(**validated_data)
    #     for customer_data in customers_data:
    #         Customer.objects.create(store=store, customer=customer_data)
    #     return store
    
    # class Meta:
    #     model = Store
    #     fields = ('store_name', 'store_description')
from rest_framework import serializers
from customers.Models.Customer import Customer
from stores.models import Store

class CustomerSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, max_length=None, use_url=True)
    class Meta:
        model = Customer
        fields = ['customer_id', 'email', 'password', 'first_name', 'last_name', 'store_id', 'profile_picture']
        #To avoid returning password in the response
        extra_kwargs = {
            'password' : {'write_only': True}
        }

    def create(self, validated_data):
        # Extract the store_id from the validated data
        store_id = validated_data.pop('store_id')
        #Extract the password to hash it and then store
        password_val = validated_data.pop('password', None)

        if password_val is None:
            raise serializers.ValidationError("Invalid Password")

        # Check if the Store with the provided store_id exists
        try:
            store = Store.objects.get(store_id=store_id.store_id)
        except Store.DoesNotExist:
            raise serializers.ValidationError("Store with the provided store_id does not exist.")

        # Create the Customer record with the foreign key relationship to the Store
        customer = Customer.objects.create(store_id=store, **validated_data)
        customer.set_password(password_val)
        customer.save()
        return customer
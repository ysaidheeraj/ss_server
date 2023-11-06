from rest_framework import serializers
from .models import Seller
from stores.models import Store

class SellerSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, max_length=None, use_url=True)
    phone_number = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    class Meta:
        model = Seller
        fields = ['seller_id', 'email', 'password', 'first_name', 'last_name', 'store_id', 'profile_picture', 'address', 'phone_number']
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

        # Create the Seller record with the foreign key relationship to the Store
        seller = Seller.objects.create(store_id=store, **validated_data)
        seller.set_password(password_val)
        seller.save()
        return seller
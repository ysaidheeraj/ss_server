from rest_framework import serializers
from .models import Store_User
from stores.models import Store

class StoreUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, max_length=None, use_url=True)
    phone_number = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    # user_role = serializers.IntegerField(required=False)
    class Meta:
        model = Store_User
        fields = ['user_id', 'email', 'password', 'first_name', 'last_name', 'store_id', 'profile_picture', 'address', 'phone_number', 'user_role', 'username']
        #To avoid returning password in the response
        extra_kwargs = {
            'password' : {'write_only': True}
        }

    def create(self, validated_data):
        # Extract the store_id from the validated data
        store_id = validated_data.pop('store_id')
        #Extract the password to hash it and then store
        password_val = validated_data.pop('password', None)

        # Check if the Store with the provided store_id exists
        try:
            store = Store.objects.get(store_id=store_id.store_id)
        except Store.DoesNotExist:
            raise serializers.ValidationError("Store with the provided store_id does not exist.")

        # Create the Store User record with the foreign key relationship to the Store
        store_user = Store_User.objects.create(store_id=store, **validated_data)
        store_user.set_password(password_val)
        store_user.save()
        return store_user
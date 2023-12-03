from rest_framework import serializers
from .models import Store_User
from stores.models import Store

class StoreUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, max_length=None, use_url=True)
    address = serializers.CharField(required=False)
    store_id = serializers.PrimaryKeyRelatedField(queryset=Store.objects.all(), required=False)
    
    # user_role = serializers.IntegerField(required=False)
    class Meta:
        model = Store_User
        fields = ['user_id', 'email', 'password', 'first_name', 'last_name', 'store_id', 'profile_picture', 'address', 'user_role', 'username', 'isSeller', 'isConfirmed', 'user_updated_time']
        #To avoid returning password in the response
        extra_kwargs = {
            'password' : {'write_only': True}
        }

    def create(self, validated_data):
        #Extract the password to hash it and then store
        password_val = validated_data.pop('password', None)

        # Create the Store User record with the foreign key relationship to the Store
        store_user = Store_User.objects.create(**validated_data)
        store_user.set_password(password_val)
        store_user.save()
        return store_user
from django.test import TestCase
from stores.models import Store
from stores.serializers import StoreSerializer
from storeusers.models import Store_User, User_Role
from storeusers.views import generate_token
from inventory.models import Item, Category, Item_Units
from inventory.serializers import ItemSerializer
from rest_framework.test import APIClient
from rest_framework import status
import pdb

class InventoryTestCases(TestCase):

    def setUp(self):
        self.client = APIClient()
        
        #Creating a test store
        Store.objects.create(store_name='Test Store', store_description='Test Description')
        store = Store.objects.filter(store_name='Test Store', store_description='Test Description').first()
        self.storeId = str(StoreSerializer(store).data['store_id'])

        #Creating a test customer
        customer = Store_User.objects.create(email='newcustomer@example.com', first_name='Customer', last_name='1', store_id=store, username='abc', user_role=User_Role.CUSTOMER)
        customer.set_password('newpassword')
        customer.save()
        token = generate_token(customer, int(self.storeId))
        self.customer_token = token.data['customer_jwt']

        #Creating a test seller
        seller = Store_User.objects.create(email='newseller@example.com', first_name='Seller', last_name='1', store_id=store, username='sellerabc', user_role=User_Role.SELLER)
        seller.set_password('newpassword')
        seller.save()
        token = generate_token(seller, int(self.storeId))
        self.seller_token = token.data['customer_jwt']

        #Creating a test category
        category = Category.objects.create(category_name="Test Category", store_id=store).save()
        # self.categoryId = str()

        #Creating test Items
        item = Item.objects.create(item_name="Test Item", item_price=10.0, item_available_count=100, item_unit=Item_Units.QUANTITY, store_id=store)
        self.itemId = str(ItemSerializer(item).data['item_id'])

        item = Item.objects.create(item_name="Test Item 1", item_price=10.0, item_available_count=100, item_unit=Item_Units.QUANTITY, store_id=store)
        self.deleteItemId = str(ItemSerializer(item).data['item_id'])

    def test_create_item(self):
        url = '/store/'+self.storeId+'/items/createitem'
        data = {
            "item_name": "Test Item 2",
            "item_price": 10,
            "item_available_count": 100,
            "item_unit": 1
        }
        self.client.cookies['customer_jwt'] = self.seller_token
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_item_empty_payload(self):
        url = '/store/'+self.storeId+'/items/createitem'
        data = {}
        self.client.cookies['customer_jwt'] = self.seller_token
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_item_invalid_user_store(self):
        url = '/store/'+"1000"+'/items/createitem'
        data = {
            "item_name": "Test Item 1",
            "item_price": 10,
            "item_available_count": 100,
            "item_unit": 1
        }
        self.client.cookies['customer_jwt'] = self.seller_token
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_create_item_unauthenticated(self):
        url = '/store/'+"1000"+'/items/createitem'
        data = {
            "item_name": "Test Item 1",
            "item_price": 10,
            "item_available_count": 100,
            "item_unit": 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_item_missing_field(self):
        url = '/store/'+self.storeId+'/items/createitem'
        data = {
            "item_price": 10,
            "item_available_count": 100,
            "item_unit": 1
        }
        self.client.cookies['customer_jwt'] = self.seller_token
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_allitems(self):
        url = '/store/'+self.storeId+'/items/allitems'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_item(self):
        url = '/store/'+self.storeId+'/items/item/'+self.itemId
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_item_invalid(self):
        url = '/store/'+self.storeId+'/items/item/'+"1000"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def test_item_update(self):
        url = '/store/'+self.storeId+'/items/item/'+self.itemId
        data = {
            'item_available_count': 1005,
        }
        self.client.cookies['customer_jwt'] = self.seller_token
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_item_update_invalid_item(self):
        url = '/store/'+self.storeId+'/items/item/'+"1000"
        data = {
            'item_available_count': 1005,
        }
        self.client.cookies['customer_jwt'] = self.seller_token
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_item_update_invalid_availability(self):
        url = '/store/'+self.storeId+'/items/item/'+self.itemId
        data = {
            'item_available_count': -1,
        }
        self.client.cookies['customer_jwt'] = self.seller_token
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_item_update_unauthenticated(self):
        url = '/store/'+self.storeId+'/items/item/'+self.itemId
        data = {
            'item_available_count': 1005,
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_item_update_invalid_store_seller(self):
        url = '/store/'+"1000"+'/items/item/'+self.itemId
        data = {
            'item_available_count': 1005,
        }
        self.client.cookies['customer_jwt'] = self.seller_token
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_delete_item(self):
        url = '/store/'+self.storeId+'/items/item/'+self.deleteItemId
        self.client.cookies['customer_jwt'] = self.seller_token
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
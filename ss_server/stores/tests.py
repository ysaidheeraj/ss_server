from django.test import TestCase
from stores.models import Store
from .serializers import StoreSerializer
from rest_framework.test import APIClient
from rest_framework import status

class StoreAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        #Creating a test store
        Store.objects.create(store_name='Test Store', store_description='Test Description')
        store = Store.objects.filter(store_name='Test Store', store_description='Test Description').first()
        self.storeId = str(StoreSerializer(store).data['store_id'])
    
    def test_create_store(self):
        url = '/stores/createstore'
        data = {
            'store_name': 'Test Store 1',
            'store_description': 'Creating a test store'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_get_store(self):
        url = '/stores/'+self.storeId
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    

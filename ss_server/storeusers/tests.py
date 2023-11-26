from django.test import TestCase
from stores.models import Store
from storeusers.models import Store_User, User_Role
from rest_framework.test import APIClient
from rest_framework import status
from stores.serializers import StoreSerializer
from django.core.files.uploadedfile import SimpleUploadedFile
import os

class CustomerAPITests(TestCase):
    def setUp(self):
        # Set up the API client
        self.client = APIClient()
        
        #Creating a test store
        Store.objects.create(store_name='Test Store', store_description='Test Description')
        store = Store.objects.filter(store_name='Test Store', store_description='Test Description').first()
        self.storeId = str(StoreSerializer(store).data['store_id'])
        
        #Creating a test customer
        customer = Store_User.objects.create(email='newcustomer@example.com', first_name='Customer', last_name='3', store_id=store, username='abc', user_role=User_Role.CUSTOMER)
        customer.set_password('newpassword')
        customer.save()

        #Creating a test seller
        seller = Store_User.objects.create(email='newseller@example.com', first_name='Seller', last_name='1', store_id=store, username='sellerabc', user_role=User_Role.SELLER)
        seller.set_password('newpassword')
        seller.save()

    def test_register_customer(self):
        url = '/store/'+self.storeId+'/storeuser/customer/register'
        data = {
            'email': 'newcustomer1@example.com',
            'password': 'newpassword',
            'first_name': 'Customer',
            'last_name': '3'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_register_customer_invalid_store(self):
        url = '/store/'+"1000"+'/storeuser/customer/register'
        data = {
            'email': 'newcustomer1@example.com',
            'password': 'newpassword',
            'first_name': 'Customer',
            'last_name': '3'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    

    def test_login_customer(self):
        url = '/store/'+self.storeId+'/storeuser/customer/login'
        data = {
            'email': 'newcustomer@example.com',
            'password': 'newpassword',
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('customer_jwt', response.cookies)
        return response.cookies['customer_jwt']
    
    def test_login_customer_wrong_password(self):
        url = '/store/'+self.storeId+'/storeuser/customer/login'
        data = {
            'email': 'newcustomer@example.com',
            'password': 'wrongpassword',
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_login_wrong_store_customer(self):
        url = '/store/'+"1000"+'/storeuser/customer/login'
        data = {
            'email': 'newcustomer@example.com',
            'password': 'newpassword',
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_customer_view(self):
        url = '/store/'+self.storeId+'/storeuser/customer/customer'
        self.client.cookies['customer_jwt'] = self.test_login_customer()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_customer_wrong_store_view(self):
        url = '/store/'+"10000"+'/storeuser/customer/customer'
        self.client.cookies['customer_jwt'] = self.test_login_customer()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_customer_update(self):
        url = '/store/'+self.storeId+'/storeuser/customer/update'
        data = {
            'address': 'New address',
            'phone_number': '+1234567890'
        }
        self.client.cookies['customer_jwt'] = self.test_login_customer()
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_customer_image_update(self):
        url = '/store/'+self.storeId+'/storeuser/customer/update'
        image_path = os.path.join(os.getcwd(), 'storeusers')
        with open(image_path+'/testimage.jpeg', 'rb') as img:
            data = {
                'profile_picture': img,
            }
            self.client.cookies['customer_jwt'] = self.test_login_customer()
            response = self.client.put(url, data, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_customer_update_unauthenticated(self):
        url = '/store/'+self.storeId+'/storeuser/customer/update'
        data = {
            'address': 'New address',
            'phone_number': '+1234567890'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_customer_update_no_payload(self):
        url = '/store/'+self.storeId+'/storeuser/customer/update'
        self.client.cookies['customer_jwt'] = self.test_login_customer()
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout_customer(self):
        url = '/store/'+self.storeId+'/storeuser/customer/logout'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if the cookie has been removed
        self.assertEqual(response.cookies.get('customer_jwt').value, '')

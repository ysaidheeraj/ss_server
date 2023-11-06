from django.urls import path
from .views import RegisterCustomerView, CustomerUpdateView
from .views import LoginCustomerView, CustomerView, LogoutCustomerView
from .views import RegisterSellerView, SellerUpdateView
from .views import LoginSellerView, SellerView, LogoutSellerView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('customer/register', RegisterCustomerView.as_view()),
    path('customer/login', LoginCustomerView.as_view()),
    path('customer/customer', CustomerView.as_view()),
    path('customer/logout', LogoutCustomerView.as_view()),
    path('customer/update', CustomerUpdateView.as_view()),
    path('seller/register', RegisterSellerView.as_view()),
    path('seller/login', LoginSellerView.as_view()),
    path('seller/seller', SellerView.as_view()),
    path('seller/logout', LogoutSellerView.as_view()),
    path('seller/update', SellerUpdateView.as_view())
]+static(settings.STORE_USERS_MEDIA_URL, document_root=settings.STORE_USERS_MEDIA_ROOT)
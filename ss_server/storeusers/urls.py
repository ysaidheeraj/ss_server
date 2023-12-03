from django.urls import path
from .views import RegisterCustomerView, CustomerUpdateView
from .views import LoginCustomerView, CustomerView, LogoutCustomerView, ListAllCustomersView, accountConfirmTemplate, confirmNewCustomer, resendAccountConfirm, RegisterSellerView
from .views import sellerAccountConfirmTemplate, confirmNewSeller, GetSellerView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('customer/register', RegisterCustomerView.as_view()),
    path('customer/login', LoginCustomerView.as_view()),
    path('customer/customer', CustomerView.as_view()),
    path('customer/logout', LogoutCustomerView.as_view()),
    path('customer/update', CustomerUpdateView.as_view()),
    path('seller/allcustomers', ListAllCustomersView.as_view()),
    path('customer/accountconfirmpage', accountConfirmTemplate),
    path('customer/confirmaccount', confirmNewCustomer),
    path('customer/resendaccountconfimation', resendAccountConfirm),
    path('seller/accountconfirmpage', sellerAccountConfirmTemplate),
    path('seller/register', RegisterSellerView.as_view()),
    path('seller/confirmaccount', confirmNewSeller),
    path('seller/details', GetSellerView.as_view()),
    path('seller/logout', LogoutCustomerView.as_view()),
    path('seller/login', LoginCustomerView.as_view())
]+static(settings.STORE_USERS_MEDIA_URL, document_root=settings.STORE_USERS_MEDIA_ROOT)
from django.urls import path
from .views import RegisterCustomerView, CustomerUpdateView
from .views import LoginCustomerView, CustomerView, LogoutCustomerView, ListAllCustomersView, accountConfirmTemplate, confirmNewCustomer, resendAccountConfirm
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
    path('customer/resendaccountconfimation', resendAccountConfirm)
]+static(settings.STORE_USERS_MEDIA_URL, document_root=settings.STORE_USERS_MEDIA_ROOT)
from django.urls import path
from .views import RegisterCustomerView
from .views import LoginCustomerView, CustomerView, LogoutView

urlpatterns = [
    path('register', RegisterCustomerView.as_view()),
    path('login', LoginCustomerView.as_view()),
    path('customer', CustomerView.as_view()),
    path('logout', LogoutView.as_view())
]
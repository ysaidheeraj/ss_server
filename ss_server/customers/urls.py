from django.urls import path
from .views import RegisterCustomerView, CustomerUpdateView
from .views import LoginCustomerView, CustomerView, LogoutView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('register', RegisterCustomerView.as_view()),
    path('login', LoginCustomerView.as_view()),
    path('customer', CustomerView.as_view()),
    path('logout', LogoutView.as_view()),
    path('update', CustomerUpdateView.as_view())
]+static(settings.CUSTOMERS_MEDIA_URL, document_root=settings.CUSTOMERS_MEDIA_ROOT)
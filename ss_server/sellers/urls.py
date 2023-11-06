from django.urls import path
from .views import RegisterSellerView, SellerUpdateView
from .views import LoginSellerView, SellerView, LogoutView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('register', RegisterSellerView.as_view()),
    path('login', LoginSellerView.as_view()),
    path('seller', SellerView.as_view()),
    path('logout', LogoutView.as_view()),
    path('update', SellerUpdateView.as_view())
]+static(settings.SELLERS_MEDIA_URL, document_root=settings.SELLERS_MEDIA_ROOT)
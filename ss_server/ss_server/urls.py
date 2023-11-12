"""
URL configuration for ss_server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('stores/', include('stores.urls')),
    path('storeusers/', include('storeusers.urls')),
    path('store/<int:storeId>/storeuser/', include('storeusers.urls')),
    path('store/<int:storeId>/categories/', include('inventory.urls')),
    path('store/<int:storeId>/items/', include('inventory.urls')),
    path('inventory/', include('inventory.urls')),
    path('store/<int:storeId>/orderitems/', include('inventory.urls')),
    path('store/<int:storeId>/orders/', include('inventory.urls'))
]

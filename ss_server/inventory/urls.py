from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import CategoryActions

urlpatterns = [
    path('allcategories', view=CategoryActions.as_view())
]+static(settings.ITEMS_MEDIA_URL, document_root=settings.ITEMS_MEDIA_ROOT)
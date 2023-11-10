from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import CategoryActions, ItemActions

urlpatterns = [
    path('allcategories', view=CategoryActions.as_view()),
    path('createcategory', view=CategoryActions.as_view()),
    path('category/<int:categoryId>', view=CategoryActions.as_view()),
    path('allitems', view=ItemActions.as_view()),
    path('item/<int:itemId>', view=ItemActions.as_view()),
    path('createitem', view=ItemActions.as_view())
]+static(settings.ITEMS_MEDIA_URL, document_root=settings.ITEMS_MEDIA_ROOT)+static(settings.CATEGORY_MEDIA_URL, document_root=settings.CATEGORY_MEDIA_ROOT)
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import CategoryActions, ItemActions, OrderItemActions, OrderActions, SellerOrderActions

urlpatterns = [
    #Categories urls
    path('allcategories', view=CategoryActions.as_view()),
    path('createcategory', view=CategoryActions.as_view()),
    path('category/<int:categoryId>', view=CategoryActions.as_view()),
    #Items urls
    path('allitems', view=ItemActions.as_view()),
    path('item/<int:itemId>', view=ItemActions.as_view()),
    path('createitem', view=ItemActions.as_view()),
    #OrderItems urls
    path('orderItem/<int:orderItemId>', view=OrderItemActions.as_view()),
    path('createorderitem', view=OrderItemActions.as_view()),
    #Order urls
    path('customer/allorders', view=OrderActions.as_view()),
    path('customer/order/<int:orderId>', view=OrderActions.as_view()),
    path('seller/allorders', view=SellerOrderActions.as_view()),
    path('seller/customer/<int:customerId>/order/<int:orderId>', view=SellerOrderActions.as_view())

]+static(settings.ITEMS_MEDIA_URL, document_root=settings.ITEMS_MEDIA_ROOT)+static(settings.CATEGORY_MEDIA_URL, document_root=settings.CATEGORY_MEDIA_ROOT)
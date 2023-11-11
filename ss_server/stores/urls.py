from django.urls import path
from .views import StoreActions

urlpatterns =[
    path("createstore", view=StoreActions.as_view()),
    path("<int:storeId>", view=StoreActions.as_view())
]
from django.urls import path
from .views import StoreActions, StoreTickets

urlpatterns =[
    path("createstore", view=StoreActions.as_view()),
    path("<int:storeId>", view=StoreActions.as_view()),
    path("<int:storeId>/createticket", view=StoreTickets.as_view()),
    path("<int:storeId>/update", view=StoreActions.as_view())
]
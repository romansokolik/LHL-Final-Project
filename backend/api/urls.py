from django.urls import path
from .views import MyModelView

urlpatterns = [
    path('mymodel/', MyModelView.as_view(), name='mymodel'),
]
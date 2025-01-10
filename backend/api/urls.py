from django.urls import path
from .views import MyModelView
from . import views

urlpatterns = [
    # path('', MyModelView.as_view(), name='index'),
    path('check/', views.check, name='check'),
    path('mymodel/', MyModelView.as_view(), name='mymodel'),
    path('', views.index, name='index'),
]

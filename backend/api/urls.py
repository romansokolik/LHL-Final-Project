from django.urls import path, include
# from .views import MyModelView
from . import views

urlpatterns = [
    # path('', MyModelView.as_view(), name='index'),
    # path('mymodel/', MyModelView.as_view(), name='rmymodel'),
    path('check/', views.check, name='check'),
    path('recommenders/', include('api.recommenders.urls')),
    path('sentiments/', include('api.sentiments.urls')),
    path('', views.index, name='index'),

]

# Description: URL patterns for the recommenders
# /api/recommenders/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # path('/', include('.urls')),
    path('', views.index, name='index'),
    path('movie', views.movie, name='movie'),
]

# Description: URL patterns for the recommenders
# /api/recommenders/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # path('/', include('.urls')),
    path('', views.index, name='index'),
    path('movies/<int:tmdb_id>/', views.movies, name='movie'),
    path('contents-based/<int:tmdb_id>/', views.contents_based, name='contents_based'),
]

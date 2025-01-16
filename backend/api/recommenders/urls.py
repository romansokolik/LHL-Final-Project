# Description: URL patterns for the recommenders
# /api/recommenders/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # path('/', include('.urls')),
    path('', views.index, name='index'),
    path('movies/<int:tmdb_id>/', views.movies, name='movie'),
    path('contents-based/<int:tmdb_id>/', views.contents_based, name='contents_based'),
    path('matched-posters/<int:tmdb_id>/', views.matched_posters, name='matched_posters'),
    path('compare-poster/<int:tmdb_id>/', views.compare_poster, name='compare_poster'),
    path('poster-searches/<int:tmdb_id>/', views.poster_searches, name='poster_searches')
]

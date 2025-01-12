from django.urls import path
from . import views

urlpatterns = [
    # path('/', include('.urls')),
    path('', views.index, name='index'),
    # path('', views.movie, name='movie'),
]

from rest_framework import serializers
from .models import Movie, Link


class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie, Link
        fields = '__all__'

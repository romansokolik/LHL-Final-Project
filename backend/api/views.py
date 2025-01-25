import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.urls import app_name
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Movie, Link
from .serializers import MyModelSerializer


def index(request):
    # return render(request, 'frontend/index.html')
    # return HttpResponse("Hello, world. You're at the project/api (backend) index.", status=200)
    items = [
        {'id': 1, 'name': "Doe", 'age': 25},
        {'id': 2, 'name': "Smith", 'age': 30},
        {'id': 3, 'name': "Jones", 'age': 35},
    ]
    return HttpResponse(json.dumps({'items': items}))


# This approach disables CSRF protection for a specific view. Use it only for testing purposes or if the endpoint does not require CSRF protection.
# @csrf_exempt
# Use Django REST Framework's @api_view with CSRF Disabled
@api_view(['GET', 'POST'])
def check(request):
    print('request method:', request.method)
    # request_data = request.GET
    return JsonResponse("Hello, world. You're at the project/check index.", safe=False)


class MovieView(APIView):
    def get(self, request):
        items = Movie.objects.all()
        serializer = MyModelSerializer(items, many=True)
        return Response(serializer.data)


class LinkView(APIView):
    def get(self, request):
        items = Link.objects.all()
        serializer = MyModelSerializer(items, many=True)
        return Response(serializer.data)

import json
from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    # return render(request, 'frontend/index.html')
    # return HttpResponse("Hello, world. You're at the project (backend) index.")
    return HttpResponse(json.dumps({'item': "Hello, world. You're at the project (backend) index."}))


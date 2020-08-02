from django.shortcuts import render, get_object_or_404
from django.http import (HttpResponse, HttpRequest, JsonResponse)
from django.core import serializers
import json
from .models import PostModel
# Create your views here.


def PostCreateView(request, *args, **kwargs):
    # print(request.headers)
    # print()
    # print(request.headers['Authorization'])
    if request.method == 'POST':
        try:
            # print(request.POST['title'])
            body = json.loads(request.body.decode('utf-8'))
            post_data = PostModel(title=body['title'],
                                  content=body['content'],
                                  creator=body['creator'])
            post_data.save()
            return JsonResponse(data={'message': 'Post added Successfully'}, safe=False, status=201)
        except Exception as e:
            return JsonResponse(data={'message': 'Creation of a Post is Failed'}, safe=False, status=500)


def PostListView(request, *args, **kwargs):
    # print(request.headers)
    if request.method == 'GET':
        queryset = PostModel.objects.all().values()
        data = list(queryset)
        return JsonResponse(data=data, safe=False, status=200)


def PostDeleteView(request, id, *args, **kwargs):
    if request.method == 'DELETE':
        try:
            obj = get_object_or_404(PostModel, id=id)
            obj.delete()
            return JsonResponse(data={'message': 'Object is deleted.'}, safe=False, status=200)
        except Exception as e:
            print("Something went wrong")
            print(e.__class__)
            print(e.with_traceback())
            return JsonResponse(data={'message': 'Internal Error.'}, safe=False, status=500)

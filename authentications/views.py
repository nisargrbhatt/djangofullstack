from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpRequest
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from authlib.jose import jwt
import json
# from ..djangofullstack import settings
# Create your views here.


def SignUpView(request, *args, **kwargs):
    body = json.loads(request.body.decode('utf-8'))
    try:
        check = User.objects.get(username=body['username'])
    except:
        check = None
    if check is None:
        user = User.objects.create_user(username=body['username'],
                                        password=body['password'],
                                        email=body['email'],
                                        first_name=body['first_name'],
                                        last_name=body['last_name'])
        user.save()
        return JsonResponse(data={'message': 'User is Created'}, status=201)
    else:
        return JsonResponse(data={'message': 'User Already Exists'}, status=500)


def LogInView(request, *args, **kwargs):
    body = json.loads(request.body.decode('utf-8'))
    print(body['username'], body['password'])
    print()
    user = authenticate(
        request, username=body['username'], password=body['password'])
    if user is not None:
        try:
            login(request, user)
        except:
            pass
        user_detail = User.objects.get(username=body['username'])
        print(user_detail)
        print()
        print(user_detail.email)
        print(user_detail.pk)
        print()
        header = {
            'alg': 'HS256',
            'typ': 'JWT'
        }
        key = 'secret_code'
        payload = {
            'email': user_detail.email,
            'userId': user_detail.pk,
        }
        token = jwt.encode(header, payload, key)
        print(token)
        return JsonResponse({'token': str(token), 'expiresIn': 3600, 'userId': user_detail.pk}, status=200)
    else:
        return JsonResponse(data={'message': 'User Credential is wrong'}, status=401)


def LogOutView(request, *args, **kwargs):
    body = json.loads(request.body.decode('utf-8'))
    check = User.objects.get(pk=body['userId'])
    try:
        logout(request)
        return JsonResponse(data={'message': 'User Logged out Successfully'}, status=200)
    except Exception as e:
        print(e)
        return JsonResponse(data={'message': 'Something went wrong'}, status=401)

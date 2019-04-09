#!/usr/bin/env python
# coding=utf-8
from rest_framework import routers
from django.urls import path
from .views import RegisterView, LoginView, LogoutView

app_name = 'captcha_recognition'
router = routers.DefaultRouter()
urlpatterns = [
    path(r'reg/', RegisterView.as_view(), name='register'),
    path(r'login/', LoginView.as_view(), name='login'),
    path(r'logout/', LogoutView.as_view(), name='logout'),
]
urlpatterns += router.urls

#!/usr/bin/env python
# coding=utf-8
from rest_framework import routers
from django.urls import path
from .views import UploadBase64ContentView, CheckModelView, UploadImageView

app_name = 'captcha_recognition'
router = routers.DefaultRouter()
urlpatterns = [
    path(r'uploadbase64/', UploadBase64ContentView.as_view(), name='uploadbase64'),
    path(r'checkmodel/', CheckModelView.as_view(), name='checkmodel'),
    path(r'uploadimage/', UploadImageView.as_view(), name='uploadimage'),
]
urlpatterns += router.urls

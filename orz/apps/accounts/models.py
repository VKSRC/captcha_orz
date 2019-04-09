from django.db import models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    org = models.CharField(max_length=128, blank=True, verbose_name='Organization')
    telephone = models.CharField(max_length=50, blank=True, verbose_name='Telephone')
    mod_date = models.DateTimeField(auto_now=True, verbose_name='Last modified')
    usage_count = models.IntegerField(max_length=128, default=500, verbose_name='可使用次数')

    class Meta:
        verbose_name = 'User Profile'

    def __str__(self):
        return self.user.__str__()


class Permission(models.Model):
    value = models.CharField(max_length=32, null=False, blank=False, verbose_name='权限')
    remark = models.CharField(max_length=128, null=True, blank=True, default='', verbose_name='备注')

    class Meta:
        verbose_name = '权限'
        verbose_name_plural = '权限'

    def __str__(self):
        return self.value


class Extra(models.Model):
    user = models.OneToOneField(User, related_name='extra', on_delete=models.CASCADE, verbose_name='用户')
    permissions = models.ManyToManyField(Permission, related_name='permissions', null=True)
    has_all_permission = models.BooleanField(default=False, verbose_name='是否拥有所有权限')

    class Meta:
        verbose_name = '额外信息'
        verbose_name_plural = '额外信息'

    def save(self, *args, **kwargs):
        Token.objects.filter(user=self.user).all().delete()
        return super(Extra, self).save(*args, **kwargs)


class InvitationCode(models.Model):
    code = models.CharField(max_length=32, blank=True, verbose_name='邀请码')
    valid = models.CharField(max_length=32, blank=True, default='yes', verbose_name='是否有效')
    invalid_date = models.DateTimeField(auto_now=True, verbose_name='失效时间')

    class Meta:
        verbose_name = '邀请码'

    def __str__(self):
        return self.code

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Extra, InvitationCode, UserProfile
from django.contrib.auth import login as django_login, logout as django_logout


# Create your views here.

class RegisterView(APIView):
    permission_classes = ()
    http_method_names = ('post', 'options')

    def post(self, request):
        """
        用户注册
        """
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            username = request.data.get('username')
            code = request.data.get('code')
        except:
            return Response(
                {
                    "result": "false",
                    "commit": "注册失败，请提供正确注册信息"
                }
            )
        codeValid = InvitationCode.objects.filter(code=code, valid='no')

        if codeValid:
            try:
                user = User.objects.create_user(username=username, password=password, email=email)
                InvitationCode.objects.filter(code=code).update(valid='no')
                UserProfile.objects.update_or_create(user_id=user.id, usage_count=500)
                return Response(
                    {
                        "result": "success",
                        "commit": "请登录系统"
                    }
                )
            except Exception as e:
                print(e)
                return Response(
                    {
                        "result": "false",
                        "commit": "请修改注册信息"
                    }
                )
        else:
            return Response(
                {
                    "result": "false",
                    "commit": "邀请码无效"
                }
            )


class LoginView(APIView):
    """
    用户登录
    """
    permission_classes = ()
    http_method_names = ['post', 'options']

    def post(self, request):

        try:
            email = request.data.get('email', '')
            password = request.data.get('password', '')
        except:
            return Response(
                {
                    "result": "false",
                    "token": "None",
                    "commit": "请提供正确信息",
                },
                status=status.HTTP_200_OK
            )
        try:
            # 通过邮箱获取用户名
            username = User.objects.get(email=email)
            # 进行身份认证
            user = authenticate(username=username, password=password)
            return Response(
                self.generate_auth_data(user),
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {
                    "result": "false",
                    "token": "None",
                    "commit": "邮箱、密码不正确",
                },
                status=status.HTTP_200_OK
            )

    @staticmethod
    def generate_auth_data(user):
        token, created = Token.objects.get_or_create(user=user)

        permissions = []
        try:
            if user.extra.has_all_permission:
                permissions = ['is_superuser']
            else:
                permissions = [u.value for u in user.extra.permissions.all()]
                for perm in permissions:
                    split_perm = perm.split('.')
                    for i in range(len(split_perm)):
                        perms = '.'.join(split_perm[:i])
                        if (perms not in permissions) and perms:
                            permissions.append(perms)
        except Exception as e:
            pass
        permissions.append('is_auth')
        return {
            'result': 'success',
            'email': user.email,
            'permissions': permissions,
            'token': token.key
        }


class LogoutView(APIView):
    permission_classes = ()
    http_method_names = ['get', 'options']

    def get(self, request):
        if request.user.is_authenticated:
            Token.objects.filter(user=request.user).all().delete()
        django_logout(request)
        return Response(status=status.HTTP_200_OK)

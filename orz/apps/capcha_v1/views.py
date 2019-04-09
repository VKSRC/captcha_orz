#!/usr/bin/env python
# coding=utf-8
from io import BytesIO
import base64
import time
import logging
from PIL import Image
from PIL import ImageFile
from rest_framework import status
# from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .constants import MODELNOS
# from orz.apps.accounts.models import UserProfile
from orz.settings import REDIS

# Create your views here.
ImageFile.LOAD_TRUNCATED_IMAGES = True
logger = logging.getLogger(__file__)


class CheckModelView(APIView):
    """
    通过表单上传图片内容，然后遍历所有模型进行检测，输出检测结果
    """
    http_method_names = ['get', 'post', 'options']
    # perm = 'captcha_recognition.uploadrecords'
    # permission_classes = (permissions.IsAuthenticated,)
    permission_classes = ()

    def get(self, request):
        return Response(
            [],
            status=status.HTTP_200_OK
        )

    def post(self, request):
        """
        获取base64内容投入redis队列¬
        """

        # 首先判断可用次数是否大于0
        # try:
        #     usage_count = UserProfile.objects.get(user_id=request.user.id).usage_count
        #     if usage_count > 0:
        #         UserProfile.objects.filter(user_id=request.user.id).update(usage_count=usage_count - 1)
        #     else:
        #         return Response(
        #             {"result": "error", "message": "积分为0，请获取更多积分吧"},
        #             status=status.HTTP_504_GATEWAY_TIMEOUT
        #         )
        # except Exception as e:
        #     return Response(
        #         {"result": "error", "message": "积分处理程序出错"},
        #         status=status.HTTP_504_GATEWAY_TIMEOUT
        #     )
        file = request.data.get("file", None)

        if file:
            try:
                img = Image.open(file)
                output_buffer = BytesIO()
                img.save(output_buffer, format='png')
                byte_data = output_buffer.getvalue()
                base64_str_from_file = base64.b64encode(byte_data).decode()
                r = REDIS
                result = {}
                for no in MODELNOS:
                    taskid = str((lambda: int(round(time.time() * 1000)))())
                    # 投入redis
                    r.lpush("CheckModelNo" + str(no), "%s:%s" % (taskid, base64_str_from_file))
                    try:
                        tmp_result = r.blpop(taskid, timeout=3)
                        result[no] = tmp_result[-1].decode(encoding="utf-8")
                    except Exception as e:
                        pass
                if result:
                    return Response(
                        {"result": "success", "message": result},
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        {"result": "error", "message": "后端模型好像出错了"},
                        status=status.HTTP_504_GATEWAY_TIMEOUT
                    )
            except:
                return Response(
                    {"result": "error", "message": "图片处理程序出错了"},
                    status=status.HTTP_504_GATEWAY_TIMEOUT
                )
        else:
            return Response(
                {"status": "error", "message": "请提供图片的base64内容"},
                status=status.HTTP_200_OK
            )


class UploadBase64ContentView(APIView):
    """
    上传图片base64内容
    """
    http_method_names = ['get', 'post']
    # perm = 'captcha_recognition.uploadrecords'
    permission_classes = ()

    def get(self, request):
        return Response(
            {"content": ""},
            status=status.HTTP_200_OK
        )

    def post(self, request):
        """
        获取base64内容投入redis队列¬
        """
        base64content = request.data.get("content")
        modelNo = request.data.get("modelNo")
        if modelNo in MODELNOS:
            modelNo = 'ProdModelNo%d' % modelNo
        else:
            return Response(
                {"status": "error", "message": "请提供识别模型编号"},
                status=status.HTTP_200_OK
            )
        if base64content:
            taskid = str((lambda: int(round(time.time() * 1000)))())
            r = REDIS
            r.lpush(modelNo, "%s:%s" % (taskid, base64content))
            result = r.blpop(taskid, timeout=5)
            if result:
                result = result[-1].decode(encoding="utf-8")
                return Response(
                    {"result": "success", "message": result},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"result": "error", "message": "service timeout", "taskid": taskid},
                    status=status.HTTP_504_GATEWAY_TIMEOUT
                )
        else:
            return Response(
                {"status": "error", "message": "请提供图片的base64内容"},
                status=status.HTTP_200_OK
            )


class UploadImageView(APIView):
    """
    上传图片base64内容，然后遍历所有模型进行检测，输出检测结果
    """
    http_method_names = ['get', 'post', 'options']
    # perm = 'captcha_recognition.uploadrecords'
    permission_classes = ()

    def get(self, request):
        return Response(
            {"content": "上传图片"},
            status=status.HTTP_200_OK
        )

    def post(self, request):
        """
        获取base64内容投入redis队列¬
        """
        file = request.FILES.get('myfile', None)
        # img = Image.open(file)
        # ls_f = base64.b64encode(file.read())
        # img.save('static/test.png')
        if file:
            try:
                img = Image.open(file)
                output_buffer = BytesIO()
                img.save(output_buffer, format='png')
                byte_data = output_buffer.getvalue()
                base64_str_from_file = base64.b64encode(byte_data).decode()
                r = REDIS
                result = {}
                for no in MODELNOS:
                    taskid = str((lambda: int(round(time.time() * 1000)))())
                    r.lpush("CheckModelNo" + str(no), "%s:%s" % (taskid, base64_str_from_file))
                    try:
                        tmp_result = r.blpop(taskid, timeout=3)
                        result[no] = tmp_result[-1].decode(encoding="utf-8")
                    except Exception as e:
                        print(e)
                if result:
                    return Response(
                        {"status": "success", "commit": "检测完成", "filename": str(file), "res": result}
                    )
                else:
                    return Response(
                        {"status": "false", "commit": "检测失败"}
                    )

            except Exception as e:
                print(e)
                return Response(
                    {"status": "false", "commit": "文件内容错误"}
                )

        else:
            return Response(
                {"status": "false", "commit": "获取文件失败"}
            )

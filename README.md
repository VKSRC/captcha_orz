# captcha_orz
## 0x01 前言

   安全测试过程中经常遇到接口存在验证码的场景，很多时候我们也许是束手无策的，基于tensorflow编写了简单的应用希望可以解决普通验证码识别问题，后续还会更新基于yolo3针对物体检测识别更有意思的验证码问题，比如：
![12](https://github.com/m0l1ce/images/blob/master/org_12.jpeg?raw=true)
 

本期主要是针对普通验证码识别系统构建的说明，项目代码中已经训练好了四个模型，可直接使用


模型下载地址：

	https://pan.baidu.com/s/1GYy1_BQ_rBekBujofq7qEw  密码:l5ti
	
下载完毕解压到model_server/models文件夹下

参考样本下载地址：

	链接:https://pan.baidu.com/s/10EZ6M6mHjm-vY8_XVxDt_A  密码:joqi

样本下载完毕，解压到model_server/images/目录即可
图片样例如下：

|模型编号| 类型 | 样例 |
| --- | --- | --- |
|1 | 算术 | ![1](https://github.com/m0l1ce/images/blob/master/2995_7-4%3D%3F.png?raw=true)![1](https://github.com/m0l1ce/images/blob/master/15_9+1%3D%3F.png?raw=true)![1](https://github.com/m0l1ce/images/blob/master/16_3*4%3D%3F.png?raw=true)![1](https://github.com/m0l1ce/images/blob/master/47_4*3%3D%3F.png?raw=true) |
| 2 | 大小写字母+数字 | ![1](https://github.com/m0l1ce/images/blob/master/4910_HYRC.png?raw=true)![1](https://github.com/m0l1ce/images/blob/master/4911_xath.png?raw=true)![1](https://github.com/m0l1ce/images/blob/master/4912_ZYQF.png?raw=true)![1](https://github.com/m0l1ce/images/blob/master/4913_aa99.png?raw=true) |
| 3 | 四位大写字母+数字 | ![1](https://github.com/m0l1ce/images/blob/master/2_E93K.png?raw=true)![1](https://github.com/m0l1ce/images/blob/master/3_PTT7.png?raw=true)![1](https://github.com/m0l1ce/images/blob/master/4_L5NM.png?raw=true)![1](https://github.com/m0l1ce/images/blob/master/5_FL86.png?raw=true)|
| 7 | 五位小写字母 | ![1](https://github.com/m0l1ce/images/blob/master/25005_nufkt.jpg?raw=true)![1](https://github.com/m0l1ce/images/blob/master/25006_nvdda.jpg?raw=true)![1](https://github.com/m0l1ce/images/blob/master/25007_uwucy.jpg?raw=true)![1](https://github.com/m0l1ce/images/blob/master/25008_dmnvt.jpg?raw=true)|

model_server目录信息如下：
![11](https://github.com/m0l1ce/images/blob/master/orz_11.png?raw=true)

## 0x02 安装指南
### 0x0201 环境搭建


#### centos7
执行以下命令进行安装或者更新

```
yum install -y tkinter tk-devel
yum –y install gcc tkinter zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tcl-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel expat-devel
```
python环境

python3.6

```
pip install scipy numpy iPython jupyter pandas sympy nose scikit-learn Pillow captcha  matplotlib tensorflow==1.11 redis
```
#### mac

```
brew install pyqt
pip3 install PyQt5

```
python3

```
import matplotlib

matplotlib.matplotlib_fname()
```
编辑显示的文件
输入backend :Qt4Agg


python环境 
python3.6


### 0x0202 启动redis

下载地址：
https://redis.io/download

redis充当消息队列，安装完redis启动即可，比如mac下：

```
../redis-server
```

### 0x0303 启动django

安装依赖（requeirements.pip里已经包含了机器学习用到的库）

	pip install -r requirements.txt
	
初始化django

	python manage.py migrate

启动django

	python manage.py runserver 0.0.0.0:8000

通过修改 orz/apps/capcha_v1/constants.py 中 MODELNOS列表中的值选择检测支持的模型，当然前提是对应的模型已经在上一步中已成功启动

此时可通过api查看接口信息
http://127.0.0.1:8000/api/capcha_v1/checkmodel/
![基本架构](https://github.com/m0l1ce/images/blob/master/orz_4.png?raw=true)

### 0x0304 启动nginx
参考链接：	
[配置ng反向代理](https://www.cnblogs.com/bninp/p/5694277.html )

mac下ng配置文件目录默认为 /usr/local/etc/nginx
添加圈中部分

```
location /api {
            proxy_pass   http://127.0.0.1:8000; # 后端接口 IP:port
        }
```
![ng配置](https://github.com/m0l1ce/images/blob/master/orz_8.png?raw=true)
 
将orz_fe文件夹下的前端代码复制到 /usr/local/var/www 下

![静态文件目录](https://github.com/m0l1ce/images/blob/master/orz_5.png?raw=true)
访问 http://127.0.0.1:8001
![ng配置](https://github.com/m0l1ce/images/blob/master/orz_7.png?raw=true)

通过http://127.0.0.1:8001/#/reg 即可注册账号，邀请码：vksrc 

### 0x0305 启动模型

模型训练完成即可启动模型
为了可以实现对验证码进行模型预检测，对识别模型进行了分类,

| 参数 | 值举例 | 备注 |
| --- | --- | ---|
| m | 7 | 模型编号 |
| e | Check  | Check/Prod,Check对应模型检测模块，Prod对应批量检测模块 |
| l | 5 | 验证码长度，该参数必须和模型训练时参数匹配 |
模型训练完启动生产和测试模型即可

实例中已经训练了四个模型供大家参考，切换至model_server目录下
	
	python service.py -m 7 -e Check -l 5 # 启动测试接口
	python service.py -m 7 -e Prod -l 5  # 启动生产接口
	
其他模型以此类推

### 0x0306 api接口
 1. 检测模型接口
 
 访问http://127.0.0.1:8001/#/app/forms-models-check 上传实例验证码(位于orz/model-server/images目录下)可进行模型校验
![基本架构](https://github.com/m0l1ce/images/blob/master/orz_6.png?raw=true)

2. 通过提交base64和模型编号进行识别
	
	url：http://127.0.0.1:8000/api/capcha_v1/uploadbase64/

	post内容如下：

	```
	{"modelNo": 7,"content": "R0lGODlhRgAUAPZ9AAAAAAxfDBZbFgBkAQNoAwpqCgBvEg9tEBJvEgBxFhVwFRdyGBt0GyF3ACd9ACRWIwB3IAB7JwB+KSB3ICV6JCx+LGU7ZXU0dQCDNC+ALzOCMzmGOT6JPkSMAFCTAHCnAH2zAEGJPgDWAAD1AACMQwCRTUKMQkiNRUmPSUyRTFSVVFyaXGGdYWagZm2kbXOlbnSpdHute4SyAJW8AJ/CAKnIALnSAL3cANPhANDoAOTrAO/yAPX1AP/1AIKzfQAA9YMvg4sri4AwgJwnlqgfqLEcsckSye4D7vUA9f8A9fUA/wCwgAC2iwC8lADPvQDWtADj1gDr5ADu6QD19QD/9QD1/4Oyg4y3jI64joy3kpS7lJq/mpPBk5zDnKHAm6PEo6vJrKvJsrLNs7rNsrzUvMLXwsbZxsrbys/e19Df0NXi1dvm29/o3+fn3tjk4eLq4u/s5uru6u7x7vj77ufs8Ojt8fX19f/19fX/9f//9fX1///1//X//////wAAAAAAACH5BAAAAAAALAAAAABGABQAAAf+gABII3Z2SIU8d4WLjHhTVXZ4iot3h3qFk42MdmIxLCsuaXaKPJuFl3aEpneKqIV4eIams3alm3e2i2gUAwwmKSdijKW5SHq5mIVTyYVyc5mmSa+RrszKySkDW7Szioqxi+CbcQVkm5eH4ovLucumyxUEcdeHhXmmyJg8PHK1dmp1DA14YkvPvCmXwJFRsYkHuHqI7Kw5U2EACBgrUGhYU0hVoUPQGMlhwNAOkAEwLgUAE8mOlQE47EzBsu0OkwmIYrWZ8cbfpooDBiioQGLFC47cIkmzg2oEiwFs7MQ4cECHHQZdkEy5Q2ZAl38DCsi5A4PDJicDwFzK1IOHETT+T4U1ZKRIjcc7qEqdGbDEDgwWDHzgoTDE0pECLO6AgUCA5YoVm7YMMGNHSpF+sgrFGOBlSj5KtVRoYORu0QYGfltgMRAHQxY9qkxQcKkCBQs7JmKMWiRkQE8YA1rgQXKFAx49WgZY+fiKz247VXhUwOlTUb0vaV+8OMLAionl4DZHWWGFC2oKWhaValHg3wEGF+zIEaDbDhGU07rZKXCCx6VqzTCQggswuMTACfWNYsMANWQQxhoDlHHAGBHZkUIEdnjAggYy2HGFAvPY0RVkdvTBDYQtfHQIRMdsVkKBcSBQgAuMHEGACwNAYYcGOKrByA8VnEBGVejt0N0iaQz+0AEPU7C4iRgDXCELHkFAJw4bBBCg2x2bWVCaHRwscIAhUw2AWUsKsFCBlAp80YQCUrBiRx0DVMCcO8uAk5wYnsWhwgB5ECLOn8vZEYUIIS6y2QYImSHUJnIMMIED/RQARgOFLlIAA8uEZEgpOEKBRw4SFPDVK7jYYcQVbuzx3CZkVCDEPi7RsAmEA1BoxwAWgAjOJStYkMkySTCJCAoE7PDFAROcsYlHMm0SSz0hfbZGBx4U8kZYmfoXEhKZoDLYAx8MkAIc1dHV0ik/LJPQJHqI4ylTYClwJiqofNMSSEjIQUBQuikB2ry0QJRUfnakcYNP/nzmLjhytJCAXAA1mpKOuvR+ue5ndiSxjMAFM3KJfzwgUXJmVYiDBzHrYFIaKlSEM6W712xisEzQnrOMO8jgEQgAOw=="}```
![生产接口](https://github.com/m0l1ce/images/blob/master/orz_9.png?raw=true)

## 0x03 模型训练

在获取足够样本情况下可以进行模型训练，准备工作如下

 1. 样本目录
	
	样本目录在**./images/{modelNo}**目录下，样本数量尽可能多，一般不要少于300
 2. 样本格式

	样本格式请统一为：**{编号}_{样本属性}.[png,jpeg,jpg]**

	如：
	
		* 2_abcde.jpeg
		* 53_1zd1.jpg
		* 1_6*1=?.png

 3. 模型存储
 
	模型存储为**./models/{modelNo}**
	
	ps: 训练前请再models目录下新建模型编号对应的文件夹
	
 4. 开始训练

	当上述内容准备完毕以后，准备训练模型吧
	首先修改gen_captcha.py中的modelNo和MAX_CAPTCHA，该变量关联样本目录和模型存储目录，然后运行如下命令即可
	
	```
	python training.py
	```

## 0x04 致谢

1. 感谢好友[AnYeMoWang](https://github.com/AnYeMoWang)帮忙review代码
2. 优秀的模型需要大量有效的样本，如果大家想贡献样本可以联系我们，模型训练完会共享到github

## 0x05 参考链接
 
 * https://blog.csdn.net/imgxr/article/details/80128361
 * https://github.com/vdumoulin/conv_arithmetic
 * https://xz.aliyun.com/t/1822
 * https://www.cnblogs.com/ydf0509/p/6916435.html
 

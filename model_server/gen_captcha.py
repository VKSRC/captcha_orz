# /usr/bin/env python
#  coding=utf-8
import os
import random
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

"""
读取样本
"""
# 模型编号
modelNo = 1
MAX_CAPTCHA = 5

try:
    os.remove('./images/' + modelNo + '/.DS_Store')
except Exception as e:
    print(e)
imgs_list = os.listdir("./images/" + modelNo)


def random_captcha_text():
    i = random.randint(1, len(imgs_list) - 1)
    try:
        captcha_text = imgs_list[i].split("_")[1].split(".")[0]
    except Exception as e:
        print(e)
        i = random.randint(1, 300)
        captcha_text = imgs_list[i].split("_")[1].split(".")[0]
    return i, captcha_text


# 生成字符对应的验证码
def gen_captcha_text_and_image():
    captcha_image = None
    captcha_text = None
    while (True):
        captcha_id, captcha_text = random_captcha_text()
        captcha_image = Image.open('./images/' + modelNo + "/" + imgs_list[captcha_id]).resize((160, 60))
        captcha_image = np.array(captcha_image.convert('RGB'))
        if captcha_image.shape == (60, 160, 3):
            break
    return captcha_text, captcha_image


if __name__ == '__main__':
    # 测试
    text, image = gen_captcha_text_and_image()
    gray = np.mean(image, -1)
    f = plt.figure()
    ax = f.add_subplot(111)
    ax.text(0.1, 0.9, text, ha='center', va='center', transform=ax.transAxes)
    plt.imshow(gray)
    plt.show()

# coding=utf-8
import sys
import getopt
from io import BytesIO
import base64
from PIL import Image
from constants import REDIS, number, alphabet, ALPHABET, MATH_STRINGS, CHAR_2_POS_DICT, POS_2_CHAR
import numpy as np
import tensorflow as tf

char_set = number + alphabet + ALPHABET + MATH_STRINGS
char_set_len = len(char_set)
image_height = 60
image_width = 160


class Check(object):
    def __init__(self, modelno, env, image_height, image_width, max_capcha, char_set_len, REDIS):
        self.modelNo = str(modelno)
        self.env = env
        self.image_height = image_height
        self.image_width = image_width
        self.max_capcha = max_capcha
        self.char_set_len = char_set_len
        self.REDIS = REDIS
        self.X = tf.placeholder(tf.float32, [None, self.image_height * self.image_width])
        self.Y = tf.placeholder(tf.float32, [None, self.max_capcha * self.char_set_len])
        self.keep_prob = tf.placeholder(tf.float32)
        self.x = tf.reshape(self.X, shape=[-1, self.image_height, self.image_width, 1])

    def convert2gray(self, img):
        if len(img.shape) > 2:
            gray = np.mean(img, -1)
            return gray
        else:
            return img

    def text2vec(self, text):
        text_len = len(text)
        if text_len > self.max_capcha:
            raise ValueError('验证码最长5个字符')
        vector = np.zeros(self.max_capcha * self.char_set_len)

        def char2pos(c):
            k = CHAR_2_POS_DICT[c]
            return k

        for i, c in enumerate(text):
            idx = i * self.char_set_len + int(char2pos(c))
            vector[idx] = 1
        return vector

    def vec2text(self, vec):
        char_pos = vec.nonzero()[0]
        text = []
        for i, c in enumerate(char_pos):
            char_idx = c % self.char_set_len
            char_code = POS_2_CHAR[str(char_idx)]
            text.append(char_code)
        return ''.join(text)

    def ConvertBase64StringToPILImage(self, base64_string):
        img = Image.open(BytesIO(base64.b64decode(base64_string))).resize((160, 60))
        img = np.array(img.convert('RGB'))
        return img

    # 定义CNN
    def conv(self, w_alpha, b_alpha, array_value=[3, 3, 1, 32], len=32, x=0):
        w_c1 = tf.Variable(w_alpha * tf.random_normal(array_value))
        b_c1 = tf.Variable(b_alpha * tf.random_normal([len]))
        conv1 = tf.nn.relu(tf.nn.bias_add(tf.nn.conv2d(x, w_c1, strides=[1, 1, 1, 1], padding='SAME'), b_c1))
        conv1 = tf.nn.max_pool(conv1, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')
        conv1 = tf.nn.dropout(conv1, self.keep_prob)
        return conv1

    def crack_captcha_cnn(self, w_alpha=0.01, b_alpha=0.1):
        conv1 = self.conv(w_alpha, b_alpha, array_value=[3, 3, 1, 32], len=32, x=self.x)
        conv2 = self.conv(w_alpha, b_alpha, array_value=[3, 3, 32, 64], len=64, x=conv1)
        conv3 = self.conv(w_alpha, b_alpha, array_value=[3, 3, 64, 64], len=64, x=conv2)
        w_d = tf.Variable(w_alpha * tf.random_normal([8 * 32 * 40, 1024]))
        b_d = tf.Variable(b_alpha * tf.random_normal([1024]))
        dense = tf.reshape(conv3, [-1, w_d.get_shape().as_list()[0]])
        dense = tf.nn.relu(tf.add(tf.matmul(dense, w_d), b_d))
        dense = tf.nn.dropout(dense, self.keep_prob)
        w_out = tf.Variable(w_alpha * tf.random_normal([1024, self.max_capcha * self.char_set_len]))
        b_out = tf.Variable(b_alpha * tf.random_normal([self.max_capcha * self.char_set_len]))
        out = tf.add(tf.matmul(dense, w_out), b_out)
        return out

    def run(self):
        output = self.crack_captcha_cnn()
        saver = tf.train.Saver()
        sess = tf.Session()
        saver.restore(sess, tf.train.latest_checkpoint('./models/' + self.modelNo + '/'))
        r = REDIS
        while (True):
            task = r.blpop(self.env + "ModelNo" + str(modelNo))[-1].decode(encoding="utf-8").split(":")
            taskId = task[0]
            base64String = task[1]
            try:
                captcha_image = C.ConvertBase64StringToPILImage(base64String)
                image = C.convert2gray(captcha_image)
                image = image.flatten() / 255
                predict = tf.argmax(tf.reshape(output, [-1, self.max_capcha, self.char_set_len]), 2)
                text_list = sess.run(predict, feed_dict={C.X: [image], C.keep_prob: 1})
                predict_text = text_list[0].tolist()
                vector = np.zeros(self.max_capcha * self.char_set_len)
                i = 0
                for t in predict_text:
                    vector[i * self.char_set_len + t] = 1
                    i += 1
                imageCode = C.vec2text(vector)
                print(imageCode)
                r.lpush(taskId, imageCode)
            except Exception as e:
                print(e)
                r.lpush(taskId, '识别失败')


def usage(argv):
    try:
        opts, args = getopt.getopt(argv, "hm:e:l:", ["m=", "e=", "l="])
    except:
        print('test.py -m <模型编号> -e <Check or Prod> -l <字符长度>')
        sys.exit(2)
    try:
        for opt, arg in opts:
            if opt == '-h':
                print('test.py -m <模型编号> -e <Check or Prod> -l <字符长度>')
                sys.exit()
            elif opt in ("-m", "--model"):
                modelNo = int(arg)
            elif opt in ("-e", "--env"):
                env = arg
            elif opt in ("-l", "--len"):
                max_capcha = int(arg)
        return modelNo, env, max_capcha
    except:
        print('test.py -m <模型编号> -e <Check or Prod> -l <字符长度>')
        sys.exit(3)


if __name__ == '__main__':
    """
    用户可控参数如下：
    1. modelno 模型编号
    2. env redis任务队列环境
        a. Check 校验模型
        b. Prod  检验接口
    3. max_capcha 验证码字符长度,每个模型对应的max_capcha是固定的
    """
    modelNo, env, max_capcha = usage(sys.argv[1:])
    C = Check(modelNo, env, image_height, image_width, max_capcha, char_set_len, REDIS)
    C.run()

import logging
import os.path
import time
from threading import Thread

import requests
from bs4 import BeautifulSoup
import execjs
import urllib.parse

from logging import Logger

# noinspection HttpUrlsUsage
from src.main.core import ksdemo


class Auth(Thread):
    def __init__(self, userid, password, retry):
        super().__init__()
        # self.userid = userid
        # self.password = password
        self.__retry = retry
        self.code = ''
        self.verify_code_url = 'https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/check'  # 验证码请求url
        self.lib_url = "https://zwyy.tsg.zzife.xiaoyuanling.com/home/web/f_second"
        self.auth_url = "https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/login"
        self.cookies = {
            'PHPSESSID': 's6d3hs71nf4ttojhtt87elr2n1',
            'redirect_url': '%2Fhome%2Fweb%2Fseat%2Farea%2F1',
            'access_token': '',
            'userid': userid,
            'user_name': password,
            'expire': ''
        }
        self.headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5',
            'Connection': 'keep-alive',
            # Requests sorts cookies= alphabetically
            # 'Cookie': 'PHPSESSID=s6d3hs71nf4ttojhtt87elr2n1; redirect_url=%2Fhome%2Fweb%2Fseat%2Farea%2F1',
            'Referer': 'https://zwyy.tsg.zzife.xiaoyuanling.com/home/web/seat/area/1',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36 Edg/100.0.1185.39',
            'X-Requested-With': 'XMLHttpRequest',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Microsoft Edge";v="100"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
        }

        self.lt, self.execution, self._eventId = None, None, None
        self.rsa = None

        self.session = requests.session()
        self.session.headers.update(self.headers)

        self.__already_login = False
        self.__logger: Logger = logging.getLogger()

    def yzm(self, code):
        data = {
            'username': '022300190103',
            'password': 'c6f057b86584942e415435ffb1fa93d4',
            'verify': code,
        }
        return data

    # 获取验证码
    def __gather_trivial(self):
        Ks95man = ksdemo.KSClient()
        Ks95man.GetTaken('ccccbbbb', '681201cccbbb')
        verify_code_url = self.verify_code_url
        code_response = self.session.get(url=verify_code_url, cookies=self.cookies, headers=self.headers, verify=False)
        with open('verify.png', mode='wb') as f:
            f.write(code_response.content)

        if Ks95man.GetTaken('ccccbbbb', '681201cccbbb'):
            # 获取成功,taken获取一次就可以了，taken 生成后如果不用参数"isref=1"刷新，就一直不会变。如果写死在您的软件中，就要慎用"isref=1"，否则您之前写死的软件都要改taken。
            # 开始识别
            # 获取文件二进制流
            code = Ks95man.PostPic('verify.png', 2)
            self.code = code
            print('识别结果：' + code)
            # 识别报错
            Ks95man.ReportError(88)

    def login(self):

        # 从统一身份认证界面获取必要信息
        self.__gather_trivial()

        # GET 图书馆认证界面 302 -> 统一身份认证界面
        # res = self.session.get(self.auth_url, allow_redirects=True)
        res = self.session.post(self.auth_url, cookies=self.cookies,
                                headers=self.headers, data=self.yzm(self.code))
        print(res.text)

        # # 切换HEADER绕过检查再进行重定向
        # self.session.headers.update({
        #     'Host': 'seat.lib.sdu.edu.cn'
        # })

        # 如果最终获取到这几个必要cookie则说明登陆成功
        if self.session.cookies['userid'] and self.session.cookies['user_name'] and \
                self.session.cookies['user_name'] and self.session.cookies['access_token'] is None:
            raise AuthException("登陆失败")
        else:
            self.__already_login = True
            self.__logger.info('Login successfully!')

    def success(self) -> bool:
        return self.__already_login

    def reset(self):
        self.session.close()
        self.session = requests.session()
        self.session.headers.update(self.headers)

        self.__already_login = False

    def run(self) -> None:
        # Retry until login successfully.
        count = 0
        while count < self.__retry and not self.success():
            count += 1
            try:
                self.login()
            except EnvironmentError as env:
                logging.error('系统环境导致认证进程出现异常{}，请检查'.format(env))
                time.sleep(10)
            except AuthException as e:
                logging.error(e)
                time.sleep(10)
        return


class AuthException(Exception):
    pass

import requests
import time
import re


def crawl():
    # 创建会话对象  方便访问不同页面时能保持身份
    s = requests.Session()
    # 1.获取验证码
    verify_code_url = 'https://117.136.129.120/dnv/portal/rand'

    code_response = s.get(url=verify_code_url, verify=False)

    # 保存验证码图片
    with open('verify.png', mode='wb') as f:
        f.write(code_response.content)
    # ***********************************************
    # 人工识别验证码
    # verify_code = input('请输入验证码:')
    # ************************************************
    # 调打码平台的api 识别函数 返回结果的字符串
    res = main(api_username='yeqingyun', api_password='******', file_name='verify.png',
               api_post_url='http://v1-http-api.jsdama.com/api.php?mod=php&act=upload', yzm_min='1', yzm_max='6',
               yzm_type='1001', tools_token='')
    code_str = res
    # 从打码平台返回的结果中 定位出验证码的识别结果
    code_pattern = re.compile(r'"val":"(.*?)"')
    code_res = code_pattern.search(code_str)
    verify_code = code_res.group(1)
    print('打码平台识别出来的验证码结果为:',verify_code)

    # ************************************************

    # 2.会话模拟登录
    login_url = 'https://117.136.129.120/dnv/login'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',

    }

    form_data = {
        'username': 'R+v8i94GY0Sq1wOTbsAEGA==',
        'password': 'f2TU+TvUizKA*****dcnAA==',
        'randCode': verify_code,
    }

    login_response = s.post(url=login_url, headers=headers,
                            # cookies=requests.utils.dict_from_cookiejar(code_response.cookies),
                            # 如果是session.post则不需要传递验证码的cookie
                            data=form_data,
                            verify=False)
    # 响应状态码
    print(login_response.status_code)
    # 响应内容
    print(login_response.text)

    # print(type(login_response.text))
    # 从响应对象中获取登陆状态的结果
    pattern = re.compile(r'"resultMessage":"(.*?)"')
    login_res = pattern.search(login_response.text).group(1)
    print('登录结果为：\n',login_res)

# 打码平台函数
def main(api_username, api_password, file_name, api_post_url, yzm_min, yzm_max, yzm_type, tools_token):
    '''
            main() 参数介绍
            api_username    （API账号）             --必须提供 yeqingyun
            api_password    （API账号密码）         --必须提供 Eccom@2019
            file_name       （需要识别的图片路径）   --必须提供
            api_post_url    （API接口地址）         --必须提供
            yzm_min         （识别结果最小长度值）        --可空提供
            yzm_max         （识别结果最大长度值）        --可空提供
            yzm_type        （识别类型）          --可空提供
            tools_token     （V1软件Token）     --可空提供
    '''
    # api_username =
    # api_password =
    # file_name = 'c:/temp/lianzhong_vcode.png'
    # api_post_url = "http://v1-http-api.jsdama.com/api.php?mod=php&act=upload"
    # yzm_min = '1'
    # yzm_max = '8'
    # yzm_type = '1303'
    # tools_token = api_username

    # proxies = {'http': 'http://127.0.0.1:8888'}
    headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0',
        # 'Content-Type': 'multipart/form-data; boundary=---------------------------227973204131376',
        'Connection': 'keep-alive',
        'Host': 'v1-http-api.jsdama.com',
        'Upgrade-Insecure-Requests': '1'
    }

    files = {
        'upload': (file_name, open(file_name, 'rb'), 'image/png')
    }

    data = {
        'user_name': api_username,
        'user_pw': api_password,
        'yzm_minlen': yzm_min,
        'yzm_maxlen': yzm_max,
        'yzmtype_mark': yzm_type,
        'zztool_token': tools_token
    }
    s = requests.session()
    # r = s.post(api_post_url, headers=headers, data=data, files=files, verify=False, proxies=proxies)
    r = s.post(api_post_url, headers=headers, data=data, files=files, verify=False)
    print(r.text)
    return r.text

if __name__ == '__main__':
	crawl()


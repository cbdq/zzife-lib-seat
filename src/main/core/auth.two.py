import requests
import ksdemo



session = requests.session()

cookies = {
    'PHPSESSID': 's6d3hs71nf4ttojhtt87elr2n1',
    'redirect_url': '%2Fhome%2Fweb%2Fseat%2Farea%2F1',
    'access_token': '',
    'userid': '',
    'user_name': '',
    'expire': ''
}

headers = {
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

verify_code_url = 'https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/check'
code_response = session.get(url=verify_code_url, cookies=cookies, headers=headers, verify=False)
with open('verify.png', mode='wb') as f:
    f.write(code_response.content)

Ks95man = ksdemo.KSClient()
Ks95man.GetTaken('ccccbbbb', '681201cccbbb')
if Ks95man.GetTaken('ccccbbbb', '681201cccbbb'):
    # 获取成功,taken获取一次就可以了，taken 生成后如果不用参数"isref=1"刷新，就一直不会变。如果写死在您的软件中，就要慎用"isref=1"，否则您之前写死的软件都要改taken。
    # 开始识别
    # 获取文件二进制流
    code = Ks95man.PostPic('verify.png', 2)
    print('识别结果：' + code)
    # 识别报错
    Ks95man.ReportError(88)
# code=input('请输入验证码：')
data = {
    'username': '022300190103',
    'password': 'c6f057b86584942e415435ffb1fa93d4',
    'verify': code,
}

response = session.post('https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/login', cookies=cookies, headers=headers, data=data)
session.encoding = 'utf-8'
print(response.text)

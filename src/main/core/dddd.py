
import requests
from bs4 import BeautifulSoup
session = requests.session()
cookies = {
    'PHPSESSID': 's6d3hs71nf4ttojhtt87elr2n1',
    'redirect_url': '%2Fhome%2Fweb%2Fseat%2Farea%2F1',
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




cookies1 = {
    'PHPSESSID': 's6d3hs71nf4ttojhtt87elr2n1',
    'redirect_url': '%2Fhome%2Fweb%2Fseat%2Farea%2F1',
}

headers1 = {
    'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5',
    'Connection': 'keep-alive',
    # Requests sorts cookies= alphabetically
    # 'Cookie': 'PHPSESSID=s6d3hs71nf4ttojhtt87elr2n1; redirect_url=%2Fhome%2Fweb%2Fseat%2Farea%2F1',
    'Referer': 'https://zwyy.tsg.zzife.xiaoyuanling.com/home/web/seat/area/1',
    'Sec-Fetch-Dest': 'image',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36 Edg/100.0.1185.39',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Microsoft Edge";v="100"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}
data = {
	"username": "022300190103",
	"password": "",
    "verify" :""
}
response = requests.get("https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/", verify = False)
print (response.text)
# response = requests.get('https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/check', cookies=cookies1, headers=headers1)
# # 以防乱码 此处将其编码设置为utf-8 因为有中文
#
#
#
#
# # response = requests.get('https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/check', cookies=cookies, headers=headers)
# # response.encoding = 'utf-8'
# # print(response.text)
# # 使用的解析器是html.parser 注意是.奥
# soup = BeautifulSoup(response.text, 'html.parser')
# # 打印解析后的结果
# print(soup.prettify())

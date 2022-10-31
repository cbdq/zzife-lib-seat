import itertools
import logging
from typing import Tuple
import urllib.parse

import requests


# noinspection HttpUrlsUsage
class Worker:
    def __init__(self, date, cookies: requests.sessions.RequestsCookieJar,
                 preferred_seats, seat_info, segment):
        self.headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5',
            'Connection': 'keep-alive',
            "Origin": "https://zwyy.tsg.zzife.xiaoyuanling.com/home/web/f_second",
            'Referer': 'https://zwyy.tsg.zzife.xiaoyuanling.com/',
            "Host": "zwyy.tsg.zzife.xiaoyuanling.com",
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36 Edg/100.0.1185.39',
            'X-Requested-With': 'XMLHttpRequest',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Microsoft Edge";v="100"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
        }

        self.date = date
        self.cookies = cookies
        self.cookies['redirect_url'] = "/home/web/seat2/area/3/day/" + self.date

        self.preferred_seats = preferred_seats
        self.seat_info = seat_info
        self.segment = segment

        self.__logger = logging.getLogger()

    def __book(self, seat_id) -> bool:
        data = {
            "access_token": self.cookies["access_token"],
            "userid": self.cookies["userid"],
            "segment": self.segment,
            "type": "1",
            "operateChannel": "2"
        }
        res = requests.post("https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/spaces/{}/book".format(seat_id),
                            headers=self.headers, cookies=self.cookies, data=data)
        self.__logger.info('Book response {}'.format(res.json()['msg']))
        return res.json()['status'] == 1

    def book(self) -> Tuple[bool, str]:
        # 先挑选参数给出的座位，如果没有再遍历所有空闲的
        for seat in itertools.chain(self.preferred_seats, self.seat_info):
            if seat in self.seat_info:
                # 空闲
                if self.seat_info[seat]['status'] == 1 and self.__book(self.seat_info[seat]['id']):
                    # success
                    self.__logger.info('Seat {} has been occupied by {}-{} on date {}'.
                                       format(seat, self.cookies['userid'],
                                              urllib.parse.unquote(self.cookies['user_name']), self.date))
                    return True, seat
            else:
                self.__logger.warning('参数给出的座位名字【{}】对应有误'.format(seat))
        return False, 'No seat has been booked.'

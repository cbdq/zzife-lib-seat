import datetime
import logging
import time
from threading import Thread
import requests
from bs4 import BeautifulSoup

from logging import Logger


# noinspection HttpUrlsUsage
class Spider(Thread):
    def __init__(self, query_area: list, date: datetime.date, retry, start_time, end_time):
        super().__init__()
        # self.headers = {
        #     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) "
        #                   "Chrome/95.0.4638.69 Safari/537.36",
        #     'Referer': 'https://zwyy.tsg.zzife.xiaoyuanling.com/',
        #     'Host': 'zwyy.tsg.zzife.xiaoyuanling.com'
        # }
        self.headers ={
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

        self.query_area = query_area
        self.date = date.strftime('%Y-%m-%d')
        self.__retry = retry

        self.areas = {}
        self.seats = {}
        self.final_area = None
        self.segment = None
        self.start_time = start_time
        self.end_time = end_time

        self.session = requests.session()
        self.session.headers.update(self.headers)

        self.__gathered_enough = False
        self.__logger: Logger = logging.getLogger()

    def get_lib(self):
        res = self.session.get(
            "https://zwyy.tsg.zzife.xiaoyuanling.com/home/web/f_second", headers=self.headers)
        soup = BeautifulSoup(res.text, 'html.parser')
        keys = [e.string for e in soup.select(
            '.x_panel > div > .rooms > div:nth-child(2) > b')]
        values = [e['href'].split(
            '/')[-1] for e in soup.select('.x_panel > div > .rooms > .seat > a')]
        self.areas = dict(zip(keys, values))
        self.__logger.debug(
            'Library dict is generated as {}'.format(self.areas))

    def get_area(self, area, date):
        # res = self.session.get("http://seat.lib.sdu.edu.cn/api.php/v3areas/{}".format(area))
        res = self.session.get(
            "https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/v3areas/{}/date/{}".format(area, date))
        status = res.json()['status']
        if status != 1:
            raise SpiderException('Cannot gather area info.')

        data: dict = res.json()['data']['list']
        for child in data['childArea']:
            self.areas[child['name']] = child['id']
        self.__logger.debug('Area info is {}'.format(self.areas))
        return res

    def get_seat(self, area, segment, date, start_time, end_time):
        url = "https://zwyy.tsg.zzife.xiaoyuanling.com/api.php/spaces_old?area={area}&segment={segment}&day={day}&"\
              "startTime={start_time}&endTime={end_time}".format(area=area, segment=segment, day=date,
                                                                 start_time=start_time, end_time=end_time)
        res = self.session.get(url)
        status = res.json()['status']
        if status != 1:
            raise SpiderException('Cannot gather seat info.')

        data = res.json()['data']['list']
        for seat in data:
            self.seats[seat['name']] = {
                'id': seat['id'], 'no': seat['no'],
                'status': seat['status'],               # 1     3   4   6
                'status_name': seat['status_name'],     # 空闲  锁定 维护 使用中
            }
        self.__logger.debug('Seat info is {}'.format(self.seats))
        return status

    def gather_info(self):

        size = len(self.areas)
        while len(self.areas) == size:  # Yet to gather info.
            self.get_lib()

        res = None
        for area in self.query_area[:-1]:
            # Cannot get specific area.
            if area in self.areas:
                size = len(self.areas)
                while len(self.areas) == size:
                    res = self.get_area(self.areas[area], self.date)
            else:
                raise SpiderException('无法查找到对应的区域，请检查提供的区域信息')

        if self.query_area[-1] in self.areas:
            self.final_area = self.areas[self.query_area[-1]]

            if res.json()["status"] == 1:
                areas = res.json()["data"]["list"]["childArea"]
                for area in areas:
                    if area["id"] != self.final_area:
                        continue

                    # Only one available book time.
                    if len(area["area_times"]["data"]["list"]) == 1:
                        self.segment = area["area_times"]["data"]["list"][0]["bookTimeId"]
                        break
                    else:
                        # Find the appropriate book time.
                        for book_time in area["area_times"]["data"]["list"]:
                            if self.start_time == book_time["startTime"]:
                                self.segment = book_time["bookTimeId"]
                        break

                if self.segment is None:
                    raise SpiderException('获取segment失败')
            else:
                raise SpiderException('选择的区域状态不正常')

            self.__logger.debug('Final area info {}: {}'.format(
                self.query_area[-1], self.final_area))
            self.get_seat(self.final_area, self.segment,
                          self.date, self.start_time, self.end_time)

            if self.final_area and self.segment is not None and len(self.seats) > 0:
                self.__gathered_enough = True
        else:
            raise SpiderException('无法查找到对应的座位，请检查提供的座位信息')

    def success(self) -> bool:
        return self.__gathered_enough

    def reset(self):
        self.session.close()
        self.session = requests.session()
        self.session.headers.update(self.headers)
        self.__gathered_enough = False

    def run(self) -> None:
        count = 0
        while count < self.__retry and not self.success():
            count += 1
            try:
                self.gather_info()
            except EnvironmentError as env:
                self.__logger.error('系统环境导致爬虫进程出现异常{}，请检查'.format(env))
                time.sleep(10)
            except SpiderException as e:
                self.__logger.error(e)
                time.sleep(10)

        if self.final_area and self.segment is not None and len(self.seats) > 0:
            self.__logger.info('Spider process works! Selected area is {final_area}, '
                               'and segment is {segment}'.format(final_area=self.final_area, segment=self.segment))
        else:
            self.__logger.warning('Spider process cannot find sufficient info')


class SpiderException(Exception):
    pass

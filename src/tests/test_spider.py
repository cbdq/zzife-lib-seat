import logging
import datetime
from unittest import TestCase
from core.spider import Spider
import re


class TestSpider(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        date = datetime.datetime.today()+datetime.timedelta(0)
        cls.spider = Spider(re.split(r'-(?![^()]*\))', "图书馆-四楼-4F环廊"), date=date, retry=1,
                            start_time="06:00", end_time="21:00")
        logging.basicConfig(format='%(asctime)s  %(filename)s : %(message)s', level=logging.DEBUG)

    def test_get_lib(self):
        self.spider.get_lib()
        self.assertIn('图书馆', self.spider.areas)

    def test_get_area(self):
        date = (datetime.datetime.today()).strftime('%Y-%m-%d')
        self.spider.get_area(1, date)  # 蒋震
        self.assertIn('四楼', self.spider.areas)

    def test_gather_info(self):
        self.spider.gather_info()
        self.assertIsNotNone(self.spider.final_area)
        self.assertIsNotNone(self.spider.segment)

    def test_run(self):
        self.spider.start()
        self.spider.join()
        self.assertTrue(self.spider.success())

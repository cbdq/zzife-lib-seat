import json
import logging
import os
from datetime import datetime
from unittest import TestCase

from lib import *
from src.main.core.worker import Worker
from src.main.lib import prepare


class TestWorker(TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        os.chdir(os.path.join(os.path.dirname(__file__), "../resrc/"))
        logging.basicConfig(format='%(asctime)s  %(filename)s : %(message)s', level=logging.DEBUG)
        with open('../resrc/user.json', 'rt', encoding='UTF-8') as file:
            info = json.loads(file.read())

        date = datetime.datetime.today() + datetime.timedelta(days=1)
        cls.auth, cls.spider = prepare(info['userid'], info['passwd'], '青岛馆-七楼-青岛馆七楼北阅览区', date, retry=1,
                                       start_time='08:00', end_time='22:30')

    def setUp(self) -> None:
        self.worker = Worker(self.spider.date, self.auth.session.cookies,
                             ['N105', 'N049', 'N041'],
                             self.spider.seats, self.spider.segment)

    def test_book(self):
        success, seat = self.worker.book()
        self.assertTrue(success)
        self.assertIs(seat, 'N105')

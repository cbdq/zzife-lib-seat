import logging
import os
import json
import urllib.parse
from logging import Logger
from unittest import TestCase
# from core.auth import Auth
from src.main.core.auth import Auth


class TestAuth(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        logging.basicConfig(format='%(asctime)s  %(filename)s : %(message)s', level=logging.DEBUG)
        with open('../resrc/user.json', 'rt', encoding='UTF-8') as file:
            info = json.loads(file.read())
            cls.info = info
        cls.auth = Auth(info['userid'], info['passwd'], retry=1)

    def test_login(self):
        self.auth.login()
        self.assertIsNotNone(self.auth.session.cookies['userid'] and self.auth.session.cookies['user_name'] and
                             self.auth.session.cookies['user_name'] and self.auth.session.cookies['access_token'])
        self.assertEqual(self.auth.session.cookies['userid'], self.auth.userid)
        self.assertEqual(urllib.parse.unquote(self.auth.session.cookies['user_name']), self.info["username"])

    def test_run(self):
        self.auth.start()
        self.auth.join()
        self.assertTrue(self.auth.success())

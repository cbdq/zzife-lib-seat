import logging
import os
import json
import urllib.parse
from logging import Logger
from unittest import TestCase
from core.auth import Auth


class TestAuth(TestCase):

    @classmethod
    def setUpClass(cls) -> None:
        os.chdir(os.path.join(os.path.dirname(__file__), "../resrc/"))
        logging.basicConfig(format='%(asctime)s  %(filename)s : %(message)s', level=logging.DEBUG)
        with open('../resrc/info.json', 'rt') as file:
            info = json.loads(file.read())
            cls.info = info
        cls.auth = Auth(info['userid'], info['passwd'])

    def test_login(self):
        self.auth.login()
        self.assertIsNotNone(self.auth.session.cookies['userid'] and self.auth.session.cookies['user_name'] and
                             self.auth.session.cookies['user_name'] and self.auth.session.cookies['access_token'])
        self.assertEqual(self.auth.session.cookies['userid'], self.auth.userid)
        self.assertEqual(urllib.parse.unquote(self.auth.session.cookies['user_name']), self.info["username"])

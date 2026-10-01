"""Regression tests for durable folder storage (standard library only)."""
import importlib.util
import json
from pathlib import Path
import tempfile
import threading
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

spec = importlib.util.spec_from_file_location('tara_server', Path(__file__).resolve().parents[1] / 'scripts/server.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def analysis(name='Test', identifier='a1'):
    return {'id': identifier, 'name': name, 'metadata': {'author': 'Tester'}, 'assets': [], 'history': [{'note': 'keep me'}]}


class FolderStorageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.directory = Path(self.temp.name)
        self.start()

    def start(self):
        self.server = module.create_server(self.directory, port=0)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.url = f'http://127.0.0.1:{self.server.server_port}'

    def stop(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()

    def tearDown(self):
        self.stop()
        self.temp.cleanup()

    def request(self, path='/api/analyses', method='GET', data=None, headers=None):
        body = json.dumps(data).encode() if data is not None else None
        request = Request(self.url + path, body, {'Content-Type': 'application/json', **(headers or {})}, method=method)
        try:
            response = urlopen(request, timeout=5)
        except HTTPError as error:
            response = error
        raw = response.read()
        return response.status, json.loads(raw) if raw and response.headers.get('Content-Type') == 'application/json' else raw

    def save(self, data, revision='new'):
        return self.request(method='PUT', data={'analyses': data, 'revision': revision})

    def test_save_load_restart_and_backups(self):
        self.assertEqual(self.request()[1], {'analyses': None, 'revision': 'new'})
        code, first = self.save([analysis()])
        self.assertEqual(code, 200)
        self.assertEqual(self.save([analysis('Changed')], first['revision'])[0], 200)
        backup = next((self.directory / 'backups').glob('*.json'))
        self.assertEqual(json.loads(backup.read_text()), [analysis()])
        self.stop()
        self.start()
        self.assertEqual(self.request()[1]['analyses'], [analysis('Changed')])

    def test_failed_atomic_replace_preserves_previous_file(self):
        revision = self.save([analysis()])[1]['revision']
        with patch.object(module.os, 'replace', side_effect=OSError('disk failure')):
            self.assertEqual(self.save([analysis('Lost write')], revision)[0], 500)
        self.assertEqual(self.request()[1]['analyses'], [analysis()])
        self.assertFalse(list(self.directory.glob('*.tmp')))

    def test_stale_browser_cannot_overwrite(self):
        self.save([analysis()])
        self.assertEqual(self.save([analysis('Stale')])[0], 409)
        self.assertEqual(self.request()[1]['analyses'], [analysis()])

    def test_corrupt_disk_never_reset(self):
        file = self.directory / 'analyses.json'
        file.write_text('{broken')
        self.assertEqual(self.request()[0], 500)
        self.assertEqual(self.save([])[0], 500)
        self.assertEqual(file.read_text(), '{broken')

    def test_invalid_payload_and_duplicate_ids(self):
        for data in [{}, [None], [{'id': 'bad'}], [analysis(), analysis()]]:
            self.assertEqual(self.save(data)[0], 400)
        self.assertFalse((self.directory / 'analyses.json').exists())

    def test_delete_persists_empty_collection(self):
        revision = self.save([analysis()])[1]['revision']
        self.assertEqual(self.save([], revision)[0], 200)
        self.assertEqual(self.request()[1]['analyses'], [])

    def test_migration_preserves_conflicts_and_checks_token(self):
        self.save([analysis('Disk')])
        headers = {'Origin': 'null', 'X-Tara-Migration': self.server.migration_token}
        self.assertEqual(self.request('/api/migrate', 'POST', {'analyses': [analysis()]}, {'Origin': 'null'})[0], 403)
        self.assertEqual(self.request('/api/migrate', 'POST', {'analyses': [analysis()]}, headers)[0], 200)
        data = self.request()[1]['analyses']
        self.assertEqual(data[0]['name'], 'Disk')
        self.assertEqual(data[1]['name'], 'Test (browser copy)')
        self.assertNotEqual(data[0]['id'], data[1]['id'])
        self.assertEqual(self.request('/api/migrate', 'POST', {'analyses': [data[0]]}, headers)[0], 200)
        self.assertEqual(len(self.request()[1]['analyses']), 2)

    def test_reject_foreign_origin_and_private_files(self):
        self.assertEqual(self.request(headers={'Origin': 'https://example.com'})[0], 403)
        self.assertEqual(self.request(headers={'Host': 'example.com'})[0], 403)
        for path in ['/analyses/analyses.json', '/.git/config', '/js/%2e%2e/analyses/analyses.json', '/scripts/server.py']:
            self.assertEqual(self.request(path)[0], 404)
        code, html = self.request('/')
        self.assertEqual(code, 200)
        self.assertIn(b'window.TARA_FOLDER_STORAGE = true', html)

    def test_backup_rotation(self):
        revision = 'new'
        for i in range(24):
            code, saved = self.save([analysis(str(i))], revision)
            self.assertEqual(code, 200)
            revision = saved['revision']
        self.assertEqual(len(list((self.directory / 'backups').glob('*.json'))), 20)
        self.assertFalse(list(self.directory.glob('*.tmp')))


if __name__ == '__main__':
    unittest.main()

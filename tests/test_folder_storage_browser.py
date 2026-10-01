"""Folder persistence integration tests; requires Playwright and Chromium.

Run: python -m unittest discover -s tests -p test_folder_storage_browser.py
Set TARA_TEST_BROWSER to use an existing Chromium executable.
"""
import json
import os
from pathlib import Path
import tempfile
import threading
import unittest

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sync_playwright = None
from test_folder_storage import module


@unittest.skipIf(sync_playwright is None, 'Playwright is optional; install it for browser tests')
class FolderBrowserTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.directory = Path(self.temp.name)
        self.server = module.create_server(self.directory, port=0)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.url = f'http://127.0.0.1:{self.server.server_port}'
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(
            executable_path=os.environ.get('TARA_TEST_BROWSER'),
            args=['--no-sandbox'],
        )

    def tearDown(self):
        self.browser.close()
        self.playwright.stop()
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.temp.cleanup()

    def page(self, url=None, blocked_storage=False):
        context = self.browser.new_context()
        context.route('https://**', lambda route: route.abort())
        if blocked_storage:
            context.add_init_script('for (const key of ["getItem", "setItem", "removeItem"]) Storage.prototype[key] = () => { throw new Error("blocked"); };')
        page = context.new_page()
        page.goto(url or self.url)
        page.wait_for_function('typeof getActiveAnalysis === "function" && !!getActiveAnalysis()')
        return page

    def saved(self, page):
        self.assertTrue(page.evaluate('window.folderStorage.flush()'))
        self.assertEqual(page.locator('#folderStorageStatus').inner_text(), 'Saved to analyses/')

    def data(self):
        return json.loads((self.directory / 'analyses.json').read_text())

    def test_autosave_new_browser_and_cleared_browser_data(self):
        page = self.page()
        page.locator('#inputAnalysisName').fill('Durable analysis')
        page.locator('[data-overview-list="functions"] textarea').first.fill('Saved function')
        self.saved(page)
        self.assertEqual(self.data()[0]['functions'], ['Saved function'])
        page.evaluate('localStorage.clear()')
        page.reload()
        page.wait_for_function('getActiveAnalysis()?.name === "Durable analysis"')
        second = self.page()
        self.assertEqual(second.locator('#inputAnalysisName').input_value(), 'Durable analysis')
        self.assertEqual(second.locator('[data-overview-list="functions"] textarea').first.input_value(), 'Saved function')

    def test_file_browser_migration_without_export(self):
        page = self.page((module.ROOT / 'index.html').as_uri())
        page.locator('#inputAnalysisName').fill('Existing browser analysis')
        page.goto((module.ROOT / 'index.html').as_uri() + f'#tara-migrate={self.server.server_port}:{self.server.migration_token}')
        page.wait_for_url(self.url + '/')
        page.wait_for_function('getActiveAnalysis()?.name === "Existing browser analysis"')
        self.assertEqual(self.data()[0]['name'], 'Existing browser analysis')

    def test_failed_save_reports_error_then_recovers(self):
        page = self.page()
        page.route('**/api/analyses', lambda route: route.abort())
        page.locator('#inputAnalysisName').fill('Pending edits')
        self.assertFalse(page.evaluate('window.folderStorage.flush()'))
        self.assertIn('Folder save failed', page.locator('#folderStorageStatus').inner_text())
        self.assertNotEqual(self.data()[0]['name'], 'Pending edits')
        page.unroute('**/api/analyses')
        self.saved(page)
        self.assertEqual(self.data()[0]['name'], 'Pending edits')

    def test_stale_browser_edits_recovered_as_copy(self):
        first = self.page()
        second = self.page()
        first.locator('#inputAnalysisName').fill('First browser saved')
        self.saved(first)
        second.locator('#inputAnalysisName').fill('Second browser unsaved')
        self.assertFalse(second.evaluate('window.folderStorage.flush()'))
        self.assertEqual(self.data()[0]['name'], 'First browser saved')
        second.reload()
        second.wait_for_function('analysisData.length === 2')
        self.assertEqual([a['name'] for a in self.data()], ['First browser saved', 'Second browser unsaved (recovered browser copy)'])

    def test_browser_storage_blocked_still_saves_to_disk(self):
        page = self.page(blocked_storage=True)
        page.locator('#inputAnalysisName').fill('Disk without localStorage')
        self.saved(page)
        self.assertEqual(self.data()[0]['name'], 'Disk without localStorage')

    def test_disk_failure_on_start_disables_editing(self):
        (self.directory / 'analyses.json').write_text('{bad')
        context = self.browser.new_context()
        context.route('https://**', lambda route: route.abort())
        page = context.new_page()
        page.goto(self.url)
        page.wait_for_function('document.querySelector("#btnNewAnalysis").disabled')
        self.assertIn('Cannot load analyses', page.locator('#folderStorageStatus').inner_text())
        self.assertEqual((self.directory / 'analyses.json').read_text(), '{bad')


if __name__ == '__main__':
    unittest.main()

"""Installer transaction, update-policy, archive safety and launcher regression tests."""
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import stat
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import URLError
from urllib.request import Request
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('tara_installer', ROOT / 'install.py')
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)


class InstallerTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        self.source = self.base / 'approved source'
        self.source.mkdir()
        for directory in ['js', 'css', 'config', 'scripts', 'analyses']:
            (self.source / directory).mkdir()
        (self.source / 'css/style.css').write_text('body {}')
        (self.source / 'config/assessment_config.json').write_text('{}')
        html = '<html><head><script type="module">import { Graphviz } from "' + next(
            url for url in installer.HTML_URLS if 'hpcc' in url) + '";</script></head></html>'
        (self.source / 'index.html').write_text(html)
        for name in ['LICENSE', 'NOTICE.md']:
            (self.source / name).write_text('notice')
        shutil.copyfile(ROOT / 'scripts/server.py', self.source / 'scripts/server.py')
        (self.source / 'analyses/analyses.json').write_text('private source data')
        self.root = self.base / 'installed app'
        self.root.mkdir()
        self.payload = b'verified asset'
        self.asset = {'path': 'js/vendor/test.js', 'url': 'https://cdn.jsdelivr.net/test.js',
                      'sha256': hashlib.sha256(self.payload).hexdigest()}
        self.dependencies = patch.object(installer, 'DEPENDENCIES', [self.asset])
        self.dependencies.start()
        self.addCleanup(self.dependencies.stop)
        self.addCleanup(self.temp.cleanup)
        cache = self.root / 'cache'
        cache.mkdir()
        (cache / self.asset['sha256']).write_bytes(self.payload)

    def install(self, state=None, **kwargs):
        return installer.install(self.root, state, source=self.source, offline=True, **kwargs)

    def release(self, identifier=42):
        return {'id': identifier, 'tag_name': 'v.2.0.0', 'draft': False, 'prerelease': False}

    def test_source_install_isolated_with_local_assets_and_launchers(self):
        state = self.install(auto_update=False)
        app = self.root / 'releases' / state['current']
        self.assertFalse(state['auto_update'])
        self.assertEqual(installer.load_state(self.root), state)
        self.assertFalse((app / 'analyses').exists())
        self.assertFalse((self.root / 'analyses').exists())
        html = (app / 'index.html').read_text()
        self.assertIn('from "./js/vendor/hpcc/graphviz.js"', html)
        self.assertIn('connect-src \'self\'', html)
        self.assertNotIn('https://', html)
        self.assertIn('https://', (self.source / 'index.html').read_text())
        self.assertEqual((app / self.asset['path']).read_bytes(), self.payload)
        self.assertTrue((self.root / 'launcher.py').is_file())
        self.assertIn('"$@"', (self.root / 'Launch TARA Tool.sh').read_text())
        self.assertIn('%~dp0launcher.py', (self.root / 'Launch TARA Tool.cmd').read_text())

    def test_prepared_source_can_be_installed_offline_with_one_network_policy(self):
        first = self.install(auto_update=False)
        prepared = self.root / 'releases' / first['current']
        second = installer.install(self.root, first, source=prepared, offline=True)
        html = (self.root / 'releases' / second['current'] / 'index.html').read_text()
        self.assertEqual(html.count('http-equiv="Content-Security-Policy"'), 1)
        self.assertIn('from "./js/vendor/hpcc/graphviz.js"', html)
        self.assertFalse(second['auto_update'])

    def test_update_preserves_preference_analyses_and_previous_release(self):
        old = self.install(auto_update=False)
        data = self.root / 'analyses/analyses.json'
        data.parent.mkdir()
        data.write_text('[{"id":"keep"}]')
        new = self.install(old)
        self.assertNotEqual(new['current'], old['current'])
        self.assertFalse(new['auto_update'])
        self.assertEqual(data.read_text(), '[{"id":"keep"}]')
        self.assertTrue((self.root / 'releases' / old['current']).is_dir())
        backup = self.root / 'update-backups' / (new['current'] + '.json')
        self.assertEqual(backup.read_text(), data.read_text())

    def test_dependency_failure_preserves_active_release(self):
        old = self.install()
        (self.root / 'cache' / self.asset['sha256']).write_bytes(b'corrupt')
        with self.assertRaisesRegex(installer.InstallError, 'missing or damaged'):
            self.install(old)
        self.assertEqual(installer.load_state(self.root), old)
        self.assertFalse(list((self.root / 'releases').glob('.staging-*')))

    def test_atomic_settings_failure_preserves_active_release(self):
        old = self.install()
        original = installer.write_json

        def fail_settings(path, value):
            if path.name == 'settings.json':
                raise OSError('disk full')
            return original(path, value)

        with patch.object(installer, 'write_json', side_effect=fail_settings):
            with self.assertRaises(OSError):
                self.install(old)
        self.assertEqual(installer.load_state(self.root), old)

    def test_incompatible_server_never_replaces_working_release(self):
        old = self.install()
        for code in ['def create_server(): pass', 'import nonexistent_tara_runtime_package']:
            (self.source / 'scripts/server.py').write_text(code)
            with self.subTest(code=code), self.assertRaisesRegex(installer.InstallError, 'incompatible'):
                self.install(old)
            self.assertEqual(installer.load_state(self.root), old)

    def test_missing_active_application_can_be_repaired(self):
        old = self.install(auto_update=False)
        shutil.rmtree(self.root / 'releases' / old['current'])
        with self.assertRaises(installer.InstallError):
            installer.load_state(self.root)
        self.assertEqual(installer.main(['install', '--install-dir', str(self.root),
                                         '--source', str(self.source), '--offline']), 0)
        self.assertFalse(installer.load_state(self.root)['auto_update'])

    def test_new_remote_dependency_rejected(self):
        (self.source / 'index.html').write_text(
            '<head><script src="https://unreviewed.example/lib.js"></script></head>')
        with self.assertRaisesRegex(installer.InstallError, 'unreviewed remote dependency'):
            self.install()
        self.assertFalse((self.root / 'settings.json').exists())

    def test_unknown_remote_module_rejected(self):
        (self.source / 'index.html').write_text(
            '<head><script type="module">import x from "https://example.com/x.js";</script></head>')
        with self.assertRaisesRegex(installer.InstallError, 'unreviewed remote module'):
            self.install()

    def test_opt_out_launch_never_checks_github(self):
        state = self.install(auto_update=False)
        with patch.object(installer, 'latest_release') as network, patch.object(installer, 'launch') as launch:
            self.assertEqual(installer.main(['launch', '--install-dir', str(self.root)]), 0)
        network.assert_not_called()
        self.assertEqual(launch.call_args.args[1], state)

    def test_offline_launch_suppresses_enabled_updates(self):
        self.install(auto_update=True)
        with patch.object(installer, 'latest_release') as network, patch.object(installer, 'launch'):
            self.assertEqual(installer.main(['launch', '--offline', '--install-dir', str(self.root)]), 0)
        network.assert_not_called()
        self.assertTrue(installer.load_state(self.root)['auto_update'])

    def test_opt_out_persists_and_can_be_enabled_again(self):
        self.install()
        with patch.object(installer, 'latest_release') as network:
            for flag, value in [('--no-auto-update', False), ('--auto-update', True)]:
                self.assertEqual(installer.main(['configure', flag, '--install-dir', str(self.root)]), 0)
                self.assertEqual(installer.load_state(self.root)['auto_update'], value)
        network.assert_not_called()

    def test_failed_automatic_update_launches_installed_release(self):
        old = self.install()
        for failure in [URLError('offline'), installer.InstallError('hash mismatch')]:
            with self.subTest(failure=failure), patch.object(installer, 'latest_release', side_effect=failure), \
                    patch.object(installer, 'launch') as launch:
                self.assertEqual(installer.main(['launch', '--install-dir', str(self.root)]), 0)
                self.assertEqual(launch.call_args.args[1], old)

    def test_manual_update_allowed_when_automatic_updates_disabled(self):
        old = self.install(auto_update=False)
        with patch.object(installer, 'latest_release', return_value=self.release()), \
                patch.object(installer, 'install', return_value=old) as update:
            self.assertEqual(installer.main(['update', '--install-dir', str(self.root)]), 0)
        self.assertFalse(update.call_args.args[1]['auto_update'])
        self.assertEqual(update.call_args.kwargs['release']['id'], 42)

    def test_latest_release_uses_stable_endpoint_and_rejects_prerelease(self):
        release = self.release()

        def metadata(url, destination, **kwargs):
            self.assertTrue(url.endswith('/releases/latest'))
            Path(destination).write_text(json.dumps(release))

        with patch.object(installer, 'download', side_effect=metadata):
            self.assertEqual(installer.latest_release()['tag_name'], 'v.2.0.0')
            release['prerelease'] = True
            with self.assertRaises(installer.InstallError):
                installer.latest_release()

    def test_release_id_comparison_handles_non_semver_tags_and_prevents_downgrade(self):
        self.assertTrue(installer.newer_release({'release_id': 1}, self.release()))
        self.assertFalse(installer.newer_release({'release_id': 42}, self.release()))
        self.assertFalse(installer.newer_release({'release_id': 43}, self.release()))

    def test_archive_root_and_approved_digest(self):
        archive = self.base / 'source.zip'
        with zipfile.ZipFile(archive, 'w') as output:
            for file in self.source.rglob('*'):
                if file.is_file():
                    output.write(file, 'github-source/' + file.relative_to(self.source).as_posix())
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        state = installer.install(self.root, None, source=archive, expected=digest, offline=True)
        self.assertEqual(state['archive_sha256'], digest)
        with self.assertRaisesRegex(installer.InstallError, 'SHA-256'):
            installer.install(self.root, state, source=archive, expected='0' * 64, offline=True)
        self.assertEqual(installer.load_state(self.root), state)

    def test_reject_unsafe_archives_before_extraction(self):
        for name in ['../outside', '/absolute', 'C:/windows', 'root/../../escape', 'root\\escape']:
            with self.subTest(name=name):
                archive = self.base / 'unsafe.zip'
                with zipfile.ZipFile(archive, 'w') as output:
                    output.writestr('safe-first', 'should never be extracted')
                    output.writestr(name, 'unsafe')
                target = self.base / 'extract'
                with self.assertRaises(installer.InstallError):
                    installer.extract_source(archive, target)
                self.assertFalse(target.exists())

    def test_reject_archive_symlinks_and_zip_bombs(self):
        archive = self.base / 'link.zip'
        link = zipfile.ZipInfo('root/link')
        link.create_system = 3
        link.external_attr = (stat.S_IFLNK | 0o777) << 16
        with zipfile.ZipFile(archive, 'w') as output:
            output.writestr(link, '../../outside')
        with self.assertRaises(installer.InstallError):
            installer.extract_source(archive, self.base / 'extract')
        with zipfile.ZipFile(archive, 'w') as output:
            output.writestr('large', '12345')
        with patch.object(installer, 'MAX_EXTRACTED', 4), self.assertRaises(installer.InstallError):
            installer.extract_source(archive, self.base / 'extract')

    def test_download_hosts_and_redirects_are_restricted(self):
        for url in ['http://github.com/x', 'https://evil.example/x', 'https://github.com.evil.example/x',
                    'https://user:pass@github.com/x', 'https://github.com:8080/x', 'file:///tmp/x']:
            with self.subTest(url=url), self.assertRaises(installer.InstallError):
                installer.checked_url(url)
        with self.assertRaises(installer.InstallError):
            installer.SafeRedirects().redirect_request(Request('https://github.com/x'), None,
                                                       302, '', {}, 'http://evil.example/')

    def test_download_checks_content_digest(self):
        response = io.BytesIO(self.payload)
        response.geturl = lambda: 'https://cdn.jsdelivr.net/test.js'
        with patch.object(installer, 'build_opener') as opener:
            opener.return_value.open.return_value = response
            with self.assertRaisesRegex(installer.InstallError, 'SHA-256'):
                installer.download(self.asset['url'], self.base / 'download', expected='0' * 64)

    def test_lock_prevents_parallel_install_or_update_while_running(self):
        with installer.installation_lock(self.root):
            with self.assertRaisesRegex(installer.InstallError, 'already running'):
                with installer.installation_lock(self.root):
                    self.fail('Second lock acquired')
        with installer.installation_lock(self.root):
            pass

    def test_launch_uses_external_analysis_directory_and_respects_no_browser(self):
        state = self.install(auto_update=False)
        from unittest.mock import MagicMock
        server = MagicMock()
        server.server_port = 8080
        module = MagicMock()
        module.create_server.return_value = server
        with patch.object(installer.importlib.util, 'module_from_spec', return_value=module), \
                patch.object(installer.importlib.util, 'spec_from_file_location'), \
                patch.object(installer.webbrowser, 'open') as browser:
            installer.launch(self.root, state, browser=False)
        module.create_server.assert_called_once_with(directory=self.root / 'analyses', port=8080)
        server.serve_forever.assert_called_once()
        server.server_close.assert_called_once()
        browser.assert_not_called()


if __name__ == '__main__':
    unittest.main()

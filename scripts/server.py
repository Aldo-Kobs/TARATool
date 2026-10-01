#!/usr/bin/env python3
"""Local folder persistence. Aldo-Kobs, 22 September 2026. GPL-3.0-or-later."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import secrets
import shutil
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit
import webbrowser

ROOT = Path(__file__).resolve().parent.parent


class StorageError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status


def validate(data):
    if (not isinstance(data, list) or any(
        not isinstance(a, dict) or not isinstance(a.get('id'), str) or not a['id']
        or not isinstance(a.get('name'), str) or not isinstance(a.get('metadata'), dict)
        for a in data
    ) or len({a['id'] for a in data}) != len(data)):
        raise StorageError(400, 'Invalid analysis data')
    return data


def create_server(directory=None, port=8080):
    directory = Path(directory) if directory else ROOT / 'analyses'
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    file = directory / 'analyses.json'
    lock = threading.Lock()
    token = secrets.token_hex(32)

    def read():
        try:
            raw = file.read_bytes()
        except FileNotFoundError:
            return {'analyses': None, 'revision': 'new'}
        try:
            data = validate(json.loads(raw))
        except (ValueError, StorageError):
            raise StorageError(500, 'Stored analyses are damaged. Restore a backup before saving.')
        return {'analyses': data, 'revision': hashlib.sha256(raw).hexdigest()}

    def save(data):
        raw = (json.dumps(validate(data), ensure_ascii=False, indent=2) + '\n').encode()
        temp = directory / ('.' + secrets.token_hex(8) + '.tmp')
        backups = directory / 'backups'
        if file.exists():
            backups.mkdir(exist_ok=True, mode=0o700)
            shutil.copyfile(file, backups / f'{time.time_ns()}-{secrets.token_hex(4)}.json')
        try:
            fd = os.open(temp, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(fd, 'wb') as stream:
                stream.write(raw)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temp, file)
        finally:
            temp.unlink(missing_ok=True)
        # Retain the most recent 20 complete previous states.
        for old in sorted(backups.glob('*.json'))[:-20]:
            old.unlink()
        return {'revision': hashlib.sha256(raw).hexdigest()}

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_args):
            pass

        def reply(self, status, value):
            raw = json.dumps(value).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(raw) if status != 204 else 0))
            if getattr(self, 'migration', False):
                self.send_header('Access-Control-Allow-Origin', 'null')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Tara-Migration')
                self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.end_headers()
            if self.command != 'HEAD' and status != 204:
                self.wfile.write(raw)

        def handle_request(self):
            self.connection.settimeout(20)
            try:
                self.route()
            except StorageError as error:
                self.reply(error.status, {'error': str(error)})
            except (OSError, ValueError, TypeError):
                self.reply(500, {'error': 'Cannot access analysis storage or requested file.'})

        def route(self):
            origin = f'http://127.0.0.1:{self.server.server_port}'
            if self.headers.get('Host') != urlsplit(origin).netloc:
                raise StorageError(403, 'Use ' + origin)
            pathname = urlsplit(self.path).path
            self.migration = pathname == '/api/migrate' and self.headers.get('Origin') == 'null'
            if pathname.startswith('/api/'):
                if self.migration:
                    if self.command == 'OPTIONS':
                        return self.reply(204, None)
                    if not secrets.compare_digest(self.headers.get('X-Tara-Migration', ''), token):
                        raise StorageError(403, 'Invalid migration token')
                elif self.headers.get('Origin', origin) != origin:
                    raise StorageError(403, 'Foreign origin denied')
                if pathname == '/api/analyses' and self.command == 'GET':
                    with lock:
                        return self.reply(200, read())
                if (pathname, self.command) not in [('/api/analyses', 'PUT'), ('/api/migrate', 'POST')]:
                    raise StorageError(404, 'Not found')
                if not self.headers.get('Content-Type', '').startswith('application/json'):
                    raise StorageError(415, 'JSON required')
                size = int(self.headers.get('Content-Length', '0'))
                if size < 0 or size > 50 * 1024 * 1024:
                    raise StorageError(413, 'Analysis store exceeds 50 MB')
                try:
                    data = json.loads(self.rfile.read(size))
                except ValueError:
                    raise StorageError(400, 'Invalid JSON')
                if not isinstance(data, dict):
                    raise StorageError(400, 'Invalid request')
                validate(data.get('analyses'))
                with lock:
                    current = read()
                    if pathname == '/api/migrate':
                        merged = current['analyses'] or []
                        for analysis in data['analyses']:
                            existing = next((a for a in merged if a['id'] == analysis['id']), None)
                            if existing == analysis:
                                continue
                            if existing:
                                analysis['id'] = 'migrated-' + secrets.token_hex(12)
                                analysis['name'] += ' (browser copy)'
                            merged.append(analysis)
                        return self.reply(200, save(merged))
                    if data.get('revision') != current['revision']:
                        raise StorageError(409, 'Another window saved changes. Reload before editing again. Your unsaved changes remain in this browser.')
                    return self.reply(200, save(data['analyses']))
            if self.command not in ['GET', 'HEAD']:
                raise StorageError(405, 'Method not allowed')
            relative = unquote('/index.html' if pathname == '/' else pathname).lstrip('/')
            target = (ROOT / relative).resolve()
            if not target.is_relative_to(ROOT):
                raise StorageError(404, 'Not found')
            resolved = target.relative_to(ROOT).as_posix()
            if resolved != 'index.html' and resolved.split('/')[0] not in ['js', 'css', 'config']:
                raise StorageError(404, 'Not found')
            if not target.is_file():
                raise StorageError(404, 'Not found')
            content = target.read_bytes()
            if resolved == 'index.html':
                content = content.replace(b'<head>', b'<head><script>window.TARA_FOLDER_STORAGE = true;</script>')
            types = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json'}
            self.send_response(200)
            self.send_header('Content-Type', types.get(target.suffix, 'application/octet-stream') + '; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(content)

        do_GET = do_HEAD = do_PUT = do_POST = do_OPTIONS = handle_request

    server = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    server.migration_token = token
    return server


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8080)
    parser.add_argument('--migrate', action='store_true', help='Transfer existing file-mode browser analyses')
    args = parser.parse_args()
    server = create_server(port=args.port)
    print(f'TARA Tool: http://127.0.0.1:{server.server_port}\nAnalyses: {ROOT / "analyses"}\nKeep this terminal open while using the app.', flush=True)
    if args.migrate:
        url = (ROOT / 'index.html').as_uri() + f'#tara-migrate={server.server_port}:{server.migration_token}'
        print(f'Open this link in the browser/profile containing your existing analyses:\n{url}', flush=True)
        threading.Thread(target=webbrowser.open, args=(url,), daemon=True).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

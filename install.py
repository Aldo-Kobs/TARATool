#!/usr/bin/env python3
"""Install and launch TARA Tool. Python 3.10+, standard library only.

Aldo-Kobs, 6 November 2026. GPL-3.0-or-later; see LICENSE.
"""
import argparse
from contextlib import contextmanager
import hashlib
import importlib.util
import inspect
import json
import os
from pathlib import Path, PurePosixPath
import re
import secrets
import shlex
import shutil
import stat
import sys
import tempfile
import threading
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
import webbrowser
import zipfile

REPOSITORY = "Aldo-Kobs/TARATool"
API = "https://api.github.com/repos/" + REPOSITORY
MAX_DOWNLOAD = 100 * 1024 * 1024
MAX_EXTRACTED = 300 * 1024 * 1024
ALLOWED_HOSTS = {
    "api.github.com", "github.com", "codeload.github.com",
    "release-assets.githubusercontent.com", "objects.githubusercontent.com",
    "cdn.jsdelivr.net", "cdnjs.cloudflare.com",
}
# Pinned runtime files and their license texts. Hashes checked before activation.
DEPENDENCIES = [
  {
    "url": "https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@2.33.2/dist/graphviz.js",
    "path": "js/vendor/hpcc/graphviz.js",
    "sha256": "b392d9e2c9aebb69e04085f9625a3c4ed0660f5ce30e5a018f4410f2fd2e4811"
  },
  {
    "url": "https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@2.33.2/LICENSE",
    "path": "js/vendor/hpcc/LICENSE",
    "sha256": "1eb85fc97224598dad1852b5d6483bbcf0aa8608790dcc657a5a2a761ae9c8c6"
  },
  {
    "url": "https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js",
    "path": "js/vendor/jspdf/jspdf.umd.min.js",
    "sha256": "e6551fcdc32f09d6853b2c5126d18d01d9447e0da618a41a11ebeee0f6c20d54"
  },
  {
    "url": "https://cdn.jsdelivr.net/npm/jspdf@4.2.1/LICENSE",
    "path": "js/vendor/jspdf/LICENSE",
    "sha256": "dc388ec35ff463288cdde3588a36fd4ed12a45deff053243b37309acc9ef583b"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    "path": "js/vendor/jszip/jszip.min.js",
    "sha256": "acc7e41455a80765b5fd9c7ee1b8078a6d160bbbca455aeae854de65c947d59e"
  },
  {
    "url": "https://cdn.jsdelivr.net/npm/jszip@3.10.1/LICENSE.markdown",
    "path": "js/vendor/jszip/LICENSE.markdown",
    "sha256": "566c953c6090b1218ca6217dd7359d45dde46581968586dc607d59a78af6a9c4"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    "path": "css/vendor/fontawesome/css/all.min.css",
    "sha256": "c22cfb6520a7fdbb738632834019acf47c78b1279462c0eb4cb83bae83ecb5a7"
  },
  {
    "url": "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/LICENSE.txt",
    "path": "css/vendor/fontawesome/LICENSE.txt",
    "sha256": "0aa8f86525273b2efa4f40f4272a188e187704252170e979dc06879adf68d43c"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.ttf",
    "path": "css/vendor/fontawesome/webfonts/fa-brands-400.ttf",
    "sha256": "5656d596bc597165a42182f67b2b9f17d2ae47a9e3ef1b042b9a729739730705"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.woff2",
    "path": "css/vendor/fontawesome/webfonts/fa-brands-400.woff2",
    "sha256": "3a8924cd5203a28628716aedb5cef0943da4c3b44e3ffcee90ab06387b41c490"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.ttf",
    "path": "css/vendor/fontawesome/webfonts/fa-regular-400.ttf",
    "sha256": "5d02dc9b858e3c85a794f87e379857f4fedc4e26cf15001714a9a0e0b1d2294d"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.woff2",
    "path": "css/vendor/fontawesome/webfonts/fa-regular-400.woff2",
    "sha256": "2bccecf0bc7e96cd5ce4003abeb3ae9ee4a3d19158c4e6edfd2df32d2f0d5721"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.ttf",
    "path": "css/vendor/fontawesome/webfonts/fa-solid-900.ttf",
    "sha256": "fbbf06d7437aa30f3cd44c968380193545a8fc3eadfb7ad897bbb101eefec5a2"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2",
    "path": "css/vendor/fontawesome/webfonts/fa-solid-900.woff2",
    "sha256": "9fc85f3a4544ab0d570c7f8f9bbb88db8d92c359b2707580ea8b07c75673eae2"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-v4compatibility.ttf",
    "path": "css/vendor/fontawesome/webfonts/fa-v4compatibility.ttf",
    "sha256": "09663a36fc05e7190af8324b855105c5bb511ad94f94b81b34afee503279eca2"
  },
  {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-v4compatibility.woff2",
    "path": "css/vendor/fontawesome/webfonts/fa-v4compatibility.woff2",
    "sha256": "4d4a2d7fd1c6684845cb174fdd7fc073bd64cb741286fb247f8b76c2b7b852c4"
  }
]
HTML_URLS = {
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css":
        "css/vendor/fontawesome/css/all.min.css",
    "https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@2.33.2/dist/index.js":
        "js/vendor/hpcc/graphviz.js",
    "https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js":
        "js/vendor/jspdf/jspdf.umd.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js":
        "js/vendor/jszip/jszip.min.js",
}
IGNORED = {".git", "node_modules", "analyses", "__pycache__", ".venv", "test-results"}


class InstallError(Exception):
    """An actionable installation error."""


def default_directory():
    if os.name == "nt":
        return Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData/Local")) / "TARATool"
    if sys.platform == "darwin":
        return Path.home() / "Library/Application Support/TARATool"
    return Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local/share")) / "TARATool"


def checked_url(url):
    parsed = urlsplit(url)
    if (parsed.scheme != "https" or parsed.hostname not in ALLOWED_HOSTS
            or parsed.username or parsed.password or parsed.port not in (None, 443)):
        raise InstallError("Download URL is outside the approved HTTPS hosts: " + url)
    return url


class SafeRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        checked_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def download(url, destination, expected=None, limit=MAX_DOWNLOAD):
    request = Request(checked_url(url), headers={
        "User-Agent": "TARATool-Installer/1.0",
        "Accept": "application/vnd.github+json" if url.startswith(API) else "*/*",
    })
    digest = hashlib.sha256()
    count = 0
    with build_opener(SafeRedirects()).open(request, timeout=20) as response:
        checked_url(response.geturl())
        with Path(destination).open("wb") as target:
            while True:
                chunk = response.read(64 * 1024)
                if not chunk:
                    break
                count += len(chunk)
                if count > limit:
                    raise InstallError("Download exceeds the permitted size: " + url)
                digest.update(chunk)
                target.write(chunk)
    actual = digest.hexdigest()
    if expected and actual != expected.lower():
        raise InstallError("SHA-256 verification failed: " + url)
    return actual


def latest_release():
    with tempfile.TemporaryDirectory(prefix="tara-release-") as temp:
        path = Path(temp) / "release.json"
        try:
            download(API + "/releases/latest", path, limit=2 * 1024 * 1024)
        except HTTPError as error:
            if error.code == 404:
                raise InstallError("No published stable GitHub release is available. "
                                   "IT can install an approved copy with --source PATH.") from error
            raise
        release = json.loads(path.read_text(encoding="utf-8"))
    if (not isinstance(release, dict) or release.get("draft") is not False
            or release.get("prerelease") is not False
            or not isinstance(release.get("id"), int)
            or not isinstance(release.get("tag_name"), str)
            or not release["tag_name"] or len(release["tag_name"]) > 200):
        raise InstallError("GitHub returned invalid stable release metadata.")
    return release


def write_json(path, value):
    temporary = path.with_name(path.name + "." + secrets.token_hex(6) + ".tmp")
    try:
        with temporary.open("x", encoding="utf-8") as stream:
            json.dump(value, stream, indent=2)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def load_state(root, require_application=True):
    path = root / "settings.json"
    if not path.exists():
        return None
    value = json.loads(path.read_text(encoding="utf-8"))
    if (not isinstance(value, dict) or value.get("repository") != REPOSITORY
            or not isinstance(value.get("auto_update"), bool)
            or not isinstance(value.get("tag"), str)
            or (value.get("release_id") is not None and type(value["release_id"]) is not int)
            or not re.fullmatch(r"[a-f0-9]{24}", str(value.get("current", "")))):
        raise InstallError("Invalid settings.json; restore it from an approved backup.")
    if require_application and not (root / "releases" / value["current"] / "scripts/server.py").is_file():
        raise InstallError("The installed release is missing. Run the install command to repair it.")
    return value


@contextmanager
def installation_lock(root):
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    with (root / ".launcher.lock").open("a+b") as stream:
        try:
            if os.name == "nt":
                import msvcrt
                stream.seek(0, 2)
                if stream.tell() == 0:
                    stream.write(b"0")
                    stream.flush()
                stream.seek(0)
                msvcrt.locking(stream.fileno(), msvcrt.LK_NBLCK, 1)
            else:
                import fcntl
                fcntl.flock(stream, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError as error:
            raise InstallError("TARA Tool is already running or being installed here. "
                               "Close its launcher before updating or changing settings.") from error
        try:
            yield
        finally:
            if os.name == "nt":
                stream.seek(0)
                msvcrt.locking(stream.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                fcntl.flock(stream, fcntl.LOCK_UN)


def extract_source(archive, destination):
    with zipfile.ZipFile(archive) as source:
        entries = source.infolist()
        if len(entries) > 20000 or sum(item.file_size for item in entries) > MAX_EXTRACTED:
            raise InstallError("Source archive exceeds extraction limits.")
        seen = set()
        for item in entries:
            path = PurePosixPath(item.filename)
            mode = item.external_attr >> 16
            if (path.is_absolute() or ".." in path.parts or "\\" in item.filename
                    or ":" in item.filename or not path.parts
                    or (stat.S_IFMT(mode) not in (0, stat.S_IFREG, stat.S_IFDIR))):
                raise InstallError("Unsafe path in source archive: " + item.filename)
            key = path.as_posix().casefold()
            if key in seen:
                raise InstallError("Duplicate path in source archive: " + item.filename)
            seen.add(key)
        source.extractall(destination)
    candidates = [destination] + [p for p in destination.iterdir() if p.is_dir()]
    roots = [p for p in candidates if (p / "index.html").is_file()
             and (p / "scripts/server.py").is_file()]
    if len(roots) != 1:
        raise InstallError("Source must contain index.html and scripts/server.py in one project root.")
    return roots[0]


def copy_source(source, target):
    source = source.resolve()
    if not (source / "index.html").is_file() or not (source / "scripts/server.py").is_file():
        raise InstallError("Source folder must contain index.html and scripts/server.py.")
    # Installation inside the source would recursively copy itself.
    if target.resolve().is_relative_to(source):
        raise InstallError("Choose an installation directory outside the source folder.")
    total = 0
    for directory, folders, files in os.walk(source, followlinks=False):
        folders[:] = [name for name in folders if name not in IGNORED]
        base = Path(directory)
        if any((base / name).is_symlink() for name in folders + files):
            raise InstallError("Symlinks are not supported in installation sources.")
        relative = base.relative_to(source)
        output = target / relative
        output.mkdir(parents=True, exist_ok=True)
        for name in files:
            file = base / name
            total += file.stat().st_size
            if total > MAX_EXTRACTED:
                raise InstallError("Source folder exceeds installation size limit.")
            shutil.copyfile(file, output / name)


def prepare_dependencies(app, cache, offline=False):
    cache.mkdir(parents=True, exist_ok=True)
    for item in DEPENDENCIES:
        target = app / item["path"]
        expected = item["sha256"]
        cached = cache / expected
        if target.is_file() and hashlib.sha256(target.read_bytes()).hexdigest() == expected:
            continue
        if not cached.is_file() or hashlib.sha256(cached.read_bytes()).hexdigest() != expected:
            if offline:
                raise InstallError("Offline dependency is missing or damaged: " + item["path"])
            print("Downloading dependency: " + item["path"], flush=True)
            temporary = cache / (expected + ".tmp")
            try:
                download(item["url"], temporary, expected)
                os.replace(temporary, cached)
            finally:
                temporary.unlink(missing_ok=True)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(cached, target)
    path = app / "index.html"
    html = path.read_text(encoding="utf-8")
    for remote, local in HTML_URLS.items():
        html = html.replace(remote, "./" + local)
    # Refuse unknown/new remote script or stylesheet dependencies until reviewed.
    for tag in re.findall(r"<(?:script|link)\b[^>]*>", html, flags=re.I):
        if re.search(r'(?:src|href)\s*=\s*[\'"](?:https?:)?//', tag, flags=re.I):
            raise InstallError("This release introduces an unreviewed remote dependency: " + tag)
    if re.search(r'(?:from\s*|import\s*\()\s*[\'"](?:https?:)?//', html):
        raise InstallError("This release introduces an unreviewed remote module import.")
    # Prevent report-rendering fallbacks sending analysis DOT to external services.
    # A CSP applies to installed copies only; local Graphviz/WASM remains available.
    policy = ("default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
              "style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; "
              "font-src 'self'; connect-src 'self'; worker-src 'self' blob:; "
              "object-src 'none'; base-uri 'self'; form-action 'self'")
    # HPCC's embedded Graphviz loader constructs JavaScript functions dynamically.
    marker = '<meta id="tara-installed-policy" http-equiv="Content-Security-Policy" content="' + policy + '">'
    html = re.sub(r'<meta\b[^>]*\bid=[\'"]tara-installed-policy[\'"][^>]*>', '', html, flags=re.I)
    if "<head>" not in html:
        raise InstallError("The release has no supported HTML head for the local storage and network policy.")
    html = html.replace("<head>", "<head>\n    " + marker, 1)
    path.write_text(html, encoding="utf-8")


def create_launchers(root):
    source = Path(__file__).resolve()
    launcher = root / "launcher.py"
    if source != launcher:
        temporary = root / "launcher.py.tmp"
        shutil.copyfile(source, temporary)
        os.replace(temporary, launcher)
    # No shell expansion of install paths or command arguments on POSIX.
    script = "#!/bin/sh\nexec " + shlex.quote(sys.executable) + " " + shlex.quote(str(launcher))
    script += " launch --install-dir " + shlex.quote(str(root)) + ' "$@"\n'
    for name in ("Launch TARA Tool.sh", "Launch TARA Tool.command"):
        file = root / name
        file.write_text(script, encoding="utf-8")
        file.chmod(0o700)
    # Percent expansion must be escaped in batch-file literals.
    python = sys.executable.replace("%", "%%")
    batch = ('@echo off\r\nsetlocal DisableDelayedExpansion\r\nchcp 65001 >nul\r\n"' + python + '" "%~dp0launcher.py" launch '
             '--install-dir "%~dp0." %*\r\nif errorlevel 1 pause\r\n')
    (root / "Launch TARA Tool.cmd").write_bytes(batch.encode("utf-8"))


def load_server(app):
    spec = importlib.util.spec_from_file_location("tara_installed_server", app / "scripts/server.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def verify_server(app):
    try:
        module = load_server(app)
        inspect.signature(module.create_server).bind(directory=app / "analyses", port=0)
    except (ImportError, AttributeError, TypeError, ValueError) as error:
        raise InstallError("The release's Python server is incompatible with this launcher: " + str(error)) from error


def install(root, state, source=None, release=None, expected=None, offline=False, auto_update=None):
    if expected and (not source or Path(source).is_dir()):
        raise InstallError("--sha256 requires --source pointing to an approved ZIP file.")
    if offline and not source:
        raise InstallError("--offline installation requires --source PATH.")
    release = release or (None if source else latest_release())
    identifier = secrets.token_hex(12)
    releases = root / "releases"
    releases.mkdir(exist_ok=True)
    staged = releases / (".staging-" + identifier)
    final = releases / identifier
    digest = None
    try:
        with tempfile.TemporaryDirectory(prefix="tara-install-") as temp:
            work = Path(temp)
            if source and Path(source).is_dir():
                origin = Path(source)
            else:
                archive = Path(source).resolve() if source else work / "release.zip"
                if source:
                    if archive.stat().st_size > MAX_DOWNLOAD:
                        raise InstallError("Source archive exceeds download size limit.")
                    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
                    if expected and digest != expected.lower():
                        raise InstallError("SHA-256 verification failed for the approved source ZIP.")
                else:
                    print("Downloading GitHub release: " + release["tag_name"], flush=True)
                    digest = download(API + "/zipball/" + quote(release["tag_name"], safe=""), archive)
                origin = extract_source(archive, work / "source")
            copy_source(origin, staged)
        prepare_dependencies(staged, root / "cache", offline)
        # Do not activate incomplete archives or incompatible server interfaces.
        for required in ("LICENSE", "NOTICE.md", "js", "css", "config"):
            if not (staged / required).exists():
                raise InstallError("Release is missing required content: " + required)
        verify_server(staged)
        new = {
            "repository": REPOSITORY,
            "current": identifier,
            "auto_update": auto_update if auto_update is not None else (
                state["auto_update"] if state else True),
            "release_id": release["id"] if release else None,
            "tag": release["tag_name"] if release else "approved-local-source",
            "archive_sha256": digest,
            "source": "github-release" if release else "local-source",
        }
        write_json(staged / "installation.json", new)
        staged.rename(final)
        create_launchers(root)
        if state and (root / "analyses/analyses.json").is_file():
            backups = root / "update-backups"
            backups.mkdir(exist_ok=True, mode=0o700)
            shutil.copyfile(root / "analyses/analyses.json", backups / (identifier + ".json"))
        write_json(root / "settings.json", new)
        print("Installed " + new["tag"] + " in " + str(root), flush=True)
        print("Automatic updates: " + ("enabled" if new["auto_update"] else "disabled"), flush=True)
        return new
    finally:
        if staged.exists():
            shutil.rmtree(staged)


def newer_release(state, release):
    # GitHub release IDs avoid assumptions about tag spellings (e.g. v.1.0.0).
    current = state.get("release_id")
    return current is None or release["id"] > current


def launch(root, state, port=8080, browser=True):
    app = root / "releases" / state["current"]
    module = load_server(app)
    # Existing stable releases support this interface; never put user data in a release.
    server = module.create_server(directory=root / "analyses", port=port)
    url = "http://127.0.0.1:" + str(server.server_port)
    print("TARA Tool: " + url + "\nAnalyses: " + str(root / "analyses"), flush=True)
    print("Keep this window open. Press Ctrl+C to stop.", flush=True)
    if browser:
        threading.Thread(target=webbrowser.open, args=(url,), daemon=True).start()
    try:
        server.serve_forever()
    finally:
        server.server_close()


def main(argv=None):
    if sys.version_info < (3, 10):
        print("TARA Tool requires Python 3.10 or newer. Ask IT to install Python from python.org.", file=sys.stderr)
        return 1
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", nargs="?", default=None,
                        choices=["install", "launch", "update", "check-updates", "status", "configure"])
    parser.add_argument("--install-dir", type=Path, default=None, help="Installation folder (per-user by default)")
    parser.add_argument("--source", type=Path, help="IT-approved source folder or ZIP (install only)")
    parser.add_argument("--sha256", help="Required SHA-256 of an approved local source ZIP")
    parser.add_argument("--offline", action="store_true", help="Never contact download servers")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--auto-update", dest="auto_update", action="store_true", help="Persistently enable launch-time updates")
    group.add_argument("--no-auto-update", dest="auto_update", action="store_false", help="Persistently disable launch-time checks/downloads")
    parser.set_defaults(auto_update=None)
    parser.add_argument("--port", type=int, default=8080, help="Local server port (default: 8080)")
    parser.add_argument("--no-browser", action="store_true", help="Do not open the browser automatically")
    args = parser.parse_args(argv)
    command = args.command or "install"
    own_directory = Path(__file__).resolve().parent
    root = (args.install_dir or (own_directory if (own_directory / "settings.json").is_file()
                                else default_directory())).expanduser().resolve()
    if args.source and command != "install":
        parser.error("--source is only supported by install")
    if args.sha256 and not re.fullmatch(r"[0-9a-fA-F]{64}", args.sha256):
        parser.error("--sha256 must contain exactly 64 hexadecimal characters")
    if args.sha256 and not args.source:
        parser.error("--sha256 requires --source ZIP")
    if not 0 <= args.port <= 65535:
        parser.error("--port must be between 0 and 65535")
    if args.offline and command in ("update", "check-updates"):
        parser.error(command + " requires a network connection; omit --offline")
    try:
        with installation_lock(root):
            state = load_state(root, require_application=command != "install")
            if args.auto_update is not None and state:
                state["auto_update"] = args.auto_update
                write_json(root / "settings.json", state)
            if command == "install":
                state = install(root, state, args.source, expected=args.sha256,
                                offline=args.offline, auto_update=args.auto_update)
                if args.command is None:
                    launch(root, state, args.port, not args.no_browser)
            else:
                if state is None:
                    raise InstallError("TARA Tool is not installed here. Run the install command first.")
                if command in ("status", "configure"):
                    print(json.dumps(state, indent=2))
                elif command in ("update", "check-updates"):
                    release = latest_release()
                    if newer_release(state, release):
                        print("Update available: " + release["tag_name"])
                        if command == "update":
                            install(root, state, release=release)
                    else:
                        print("The latest eligible GitHub release is already installed: " + state["tag"])
                elif command == "launch":
                    if state["auto_update"] and not args.offline:
                        try:
                            release = latest_release()
                            if newer_release(state, release):
                                state = install(root, state, release=release)
                        except (InstallError, OSError, ValueError, zipfile.BadZipFile, SyntaxError) as error:
                            print("Update unavailable; starting installed release: " + str(error), file=sys.stderr)
                    launch(root, state, args.port, not args.no_browser)
        return 0
    except KeyboardInterrupt:
        print("\nTARA Tool stopped.")
        return 0
    except (InstallError, OSError, ValueError, zipfile.BadZipFile, SyntaxError, URLError) as error:
        print("TARA Tool: " + str(error), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())

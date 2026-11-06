# TARA Tool installer and IT deployment guide

Installer added by Aldo-Kobs, 6 November 2026. GPL-3.0-or-later.

Give IT the repository/source archive, root-level `install.py`, this guide, and the existing license and notice files. The installer is readable Python source and uses only the Python standard library. No administrator access, pip packages, Node.js, npm, Git client, background service, or scheduled task is required for ordinary per-user installation.

## Requirements and quick start

IT must provide Python **3.10 or newer** and a current browser (Edge, Chrome, Firefox, or Safari). The installer checks the Python version; it does not install or upgrade the operating system's Python or browser. On Windows, use `python`; on macOS/Linux, normally use `python3` in the examples below.

Download the latest published stable release, download the pinned browser dependencies, install, and immediately open the application:

```sh
python install.py
```

To install without starting the application, with **automatic updates disabled**:

```sh
python install.py install --no-auto-update
```

Choose an installation folder, for example on Windows:

```bat
python install.py install --install-dir "C:\Users\Alice\AppData\Local\TARATool" --no-auto-update
```

Defaults:

| Operating system | Installation folder |
| --- | --- |
| Windows | `%LOCALAPPDATA%\TARATool` |
| macOS | `~/Library/Application Support/TARATool` |
| Linux | `$XDG_DATA_HOME/TARATool`, or `~/.local/share/TARATool` |

Choose a folder outside the source checkout. The installer excludes source analyses, Git metadata, `node_modules`, Python bytecode, and virtual environments. Existing analyses are **not automatically imported from another checkout or browser profile**. Use the application's JSON export/import to transfer them.

## Start and stop

Open the generated launcher in the installation folder:

- Windows: **Launch TARA Tool.cmd**.
- macOS: **Launch TARA Tool.command**.
- Linux: **Launch TARA Tool.sh** (or run it from a terminal).

Alternatively, from that folder:

```sh
python launcher.py launch
```

The launcher opens `http://127.0.0.1:8080` in the default browser and runs the local persistence server. Keep its terminal open; press **Ctrl+C** to stop it. Closing the browser alone leaves the server running. A second launcher, update, or configuration command against the same installation is refused until the running launcher exits. An occupied port produces an error; it never opens an unknown server automatically.

For a different port, or to open the browser yourself:

```sh
python launcher.py launch --port 8090 --no-browser
```

Use the same port consistently because browser preferences and browser storage are tied to the URL. Server-side analyses remain in the installation's `analyses` directory.

## Automatic and manual updates

Automatic updates are **enabled by default**. On each launch, the launcher queries GitHub's `/repos/Aldo-Kobs/TARATool/releases/latest` endpoint. It accepts published stable releases, not drafts, prereleases, or a moving branch. Release IDs determine update eligibility, so tags such as `v.1.0.0` work without semantic-version parsing. An older release ID is not automatically installed, even if GitHub marks it as latest. An installation from local source has no GitHub release ID; its first automatic update will install the latest GitHub release.

Disable or re-enable updates persistently, while the application is stopped:

```sh
python launcher.py configure --no-auto-update
python launcher.py configure --auto-update
```

The same flags work on `install` and `launch`. For example, `python launcher.py launch --no-auto-update` persists the preference and launches without an update check. Disabling automatic updates means **no launch-time GitHub checks or downloads**. It does not prohibit a deliberate manual update:

```sh
python launcher.py check-updates
python launcher.py update
python launcher.py status
```

`check-updates` only reports availability. `update` installs an eligible newer release and preserves the automatic-update preference. An explicit `install` can reinstall the latest release or an approved local copy. A single offline launch can skip updates without changing the saved preference:

```sh
python launcher.py launch --offline
```

Downloads and dependency verification complete in a new release directory before an atomic settings-file replacement activates it. Failed automatic checks or downloads print a message and launch the previously active release. Previous release directories are retained. Before replacing an existing installation, the installer copies `analyses/analyses.json`, if present, to `update-backups/<new-release-id>.json`. Application updates do not replace the shared analysis directory. This snapshot is a recovery aid, not a substitute for an organization's regular backup policy.

The installed `launcher.py` remains the reviewed installer version; application updates do not silently replace it with code from the downloaded release. If a future application release changes its Python server interface or introduces new dependencies, review and distribute an updated installer. Unrecognized remote scripts/styles/module imports in `index.html` cause installation to fail instead of retaining an unexpected CDN dependency.

## Approved source and offline deployments

To install the source that IT reviewed instead of querying GitHub:

```sh
python install.py install --source . --install-dir /tmp/tara-approved --no-auto-update
```

The source can be a repository folder or a ZIP containing the project directly or inside one top-level folder. Dependencies are still downloaded and verified unless already present locally. For an approved ZIP, enforce the SHA-256 supplied independently by IT:

```sh
python install.py install --source approved-release.zip --sha256 REPLACE_WITH_64_HEX_CHARACTERS --no-auto-update
```

The placeholder must be replaced with the actual hash. A checksum mismatch aborts installation.

For a machine with no internet access:

1. On a connected staging machine, run an installation with `--no-auto-update`.
2. Run `status` to find the `current` directory identifier. Copy that installation's `releases/<current>/` directory, including `js/vendor`, `css/vendor`, source, and notices, to the disconnected machine as an approved source folder. Supply `install.py` and this guide as well. Do not copy analysis data unless separately intended.
3. On the disconnected machine, run:

```sh
python install.py install --source approved-source --offline --no-auto-update
```

The installer verifies the bundled dependency hashes and refuses to download anything in offline mode. A missing or damaged dependency fails the install. Alternatively, IT can supply the dependency cache from a staging installation as `<installation-folder>/cache` together with an approved source archive. Cache filenames are the dependency SHA-256 hashes; cached bytes are verified before reuse.

## Dependencies and network access

The installer downloads the application's existing pinned runtime dependencies and their license files. It changes references **only in the installed copy** of `index.html` to use local files. The repository source keeps its existing CDN behavior.

| Component | Version | Locally installed content |
| --- | --- | --- |
| Font Awesome Free | 6.5.1 | CSS, eight TTF/WOFF2 font files, license |
| HPCC Graphviz/WASM | 2.33.2 | Graphviz ES module with embedded WASM, license |
| jsPDF | 4.2.1 | UMD JavaScript, license |
| JSZip | 3.10.1 | JavaScript, license |

Exact download URLs and expected SHA-256 hashes are embedded in `install.py` under `DEPENDENCIES`. Each dependency is checked against its expected hash before activation. Existing HTML integrity attributes remain intact. No Python development, PDF-guide-generation, test, or vulnerability-scanning dependencies are needed to use the app.

Installation and explicit update operations may require outbound **HTTPS, TCP 443** to:

- `api.github.com` — stable release metadata and source-archive requests.
- `codeload.github.com`, `github.com`, `release-assets.githubusercontent.com`, `objects.githubusercontent.com` — permitted GitHub download/redirect hosts.
- `cdn.jsdelivr.net`, `cdnjs.cloudflare.com` — pinned browser libraries, fonts, and license texts.

Downloads use Python's normal certificate verification, default proxy handling (`HTTPS_PROXY`/`HTTP_PROXY` where applicable), a 20-second socket timeout, restricted HTTPS hosts on initial requests and redirects, and download/extraction size limits. There is no certificate-verification bypass or dependency installation shell command. Use your organization's normal Python trust-store configuration for an intercepting corporate proxy.

The installer records the SHA-256 of the downloaded source archive in `settings.json` and `installation.json`. GitHub's generated source ZIP has **no independently pinned publisher signature or checksum in this installer**: HTTPS authenticates the server, and the recorded hash is an audit fingerprint. For a release hash approved independently, use a local ZIP with `--source` and `--sha256`. Dependency hashes are independently fixed in the reviewed installer.

Installed application pages include a Content Security Policy allowing local resources, inline application scripts/styles, dynamic JavaScript execution required by the Graphviz loader (`script-src 'unsafe-eval'`), local WASM execution, and data/blob images. Browser connections are restricted to the local origin. This also blocks the application's existing Kroki/QuickChart rendering fallbacks from transmitting attack-tree DOT externally; the installed Graphviz module performs rendering locally. External links in help/About pages can still be opened deliberately. Running `index.html` directly from a checkout or running the original `scripts/server.py` is a separate deployment and retains its existing network behavior.

## Files, data and recovery

| Path inside the installation | Purpose |
| --- | --- |
| `launcher.py`, `Launch TARA Tool.*` | Reviewed launcher and platform startup scripts |
| `settings.json` | Active release, source fingerprint, repository, update preference |
| `releases/<identifier>/` | Application source, local dependencies, license and notice files |
| `releases/<identifier>/installation.json` | Metadata for that installed release |
| `cache/` | Verified dependency cache, reusable for offline installs |
| `analyses/analyses.json` | Saved analyses, shared across application releases |
| `analyses/backups/` | Up to 20 recovery copies maintained by the application's server |
| `update-backups/` | Analysis snapshots created before activating replacement releases |
| `.launcher.lock` | OS-managed lock, released automatically when the process ends |

The server binds only to **127.0.0.1**, not the LAN. It retains the existing Host/origin checks, atomic analysis writes, revision-conflict protection, and restricted static-file access. It is a per-user local application, not a multi-user hosted service. User analyses are not included in update requests. Analysis files are ordinary local files; there is no added encryption or account system. Protect the installation and backups with the normal user and IT filesystem permissions.

Back up `analyses/` and `update-backups/`. Previous releases, caches, and update snapshots are retained until IT removes them, so disk use grows with updates. Never delete the directory identified by `settings.json` as `current` while it is in use.

For recovery, stop the launcher and back up the current analyses. Restore an analysis snapshot only after reviewing which data it contains. To revert application code, reinstall an approved previous source folder/ZIP with `--source` and `--no-auto-update`; existing analysis files remain in place, and newer data formats might need a matching backup. If only the active application folder is missing, an explicit `install` repairs it while preserving settings and analyses.

To uninstall, stop the launcher, retain any required analysis backups, and remove the installation folder. The installer creates no registry entries, scheduled tasks, system services, or files outside the selected installation folder except transient operating-system temporary files. Python and the browser are separately managed prerequisites.

## Maintainer validation

Run the installer and existing persistence tests without installing test packages:

```sh
python -m unittest discover -s tests -p test_installer.py
python -m unittest discover -s tests -p test_folder_storage.py
```

Installer CI runs those tests on Windows, macOS, and Linux. A live installation and offline browser smoke test should also be performed when changing the pinned dependencies or the installed Content Security Policy. Preserve the repository's license/notice files and third-party license texts when handing the prepared source to a client; see [DISTRIBUTION.md](DISTRIBUTION.md).

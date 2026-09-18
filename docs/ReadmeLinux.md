# TARA Tool unter Linux

Diese Anleitung bezieht sich auf den von Aldo-Kobs am 10.–17. September 2026 geänderten Fork. Lizenz: GPL-3.0-or-later; siehe [Urheber- und Lizenzhinweise](../NOTICE.md) und [Weitergabe](DISTRIBUTION.md).

Das Tool ist eine reine Browser-App. **Distribution egal** (Ubuntu, Fedora, Debian, …).

## Start

```bash
git clone https://github.com/Aldo-Kobs/TARATool.git
cd TARATool
```

`index.html` im Browser öffnen (Firefox, Chrome/Chromium, Edge).

Kein Server, kein Build, keine Installation nötig.

## Bewertungsconfig syncen (JSON → JS)

Nach Änderungen an `config/assessment_config.json`:

```bash
chmod +x scripts/sync_assessment_config.sh   # einmalig
./scripts/sync_assessment_config.sh
```

oder:

```bash
python3 scripts/sync_assessment_config.py
```

Voraussetzung: **Python 3**.

Alternativ im Tool: Reiter Übersicht → **Bewertungsconfig laden** (JSON auswählen). Dann kein Sync-Skript nötig.

> Windows-Nutzer: `scripts\sync_assessment_config.bat`

## Hinweise

| Thema                 | Linux                                                                  |
| --------------------- | ---------------------------------------------------------------------- |
| Analyse Import/Export | JSON, OS-unabhängig                                                    |
| PDF-Report            | Browser-seitig (jsPDF); Graphviz lokal per WASM                        |
| CDN                   | Font Awesome, jsPDF, `@hpcc-js/wasm` – Internetzugang oder Proxy       |
| Tests                 | `tests/run_tests.bat` ist Windows-only; pytest manuell mit Python/venv |

## Schnellcheck

1. `index.html` öffnen
2. Analyse anlegen oder JSON importieren
3. Sprache DE/EN und Darkmode prüfen
4. Optional: PDF-Report erzeugen

Bei Problemen mit Baum-Visualisierung im PDF: Hard-Reload, CDN-Zugriff prüfen, Browser-Konsole auf Graphviz/WASM-Fehler.

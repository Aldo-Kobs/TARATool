"""About can be dismissed and reopened without losing the current analysis."""
import json
import re
from pathlib import Path

import pytest
from playwright.sync_api import expect

from conftest import get_active_analysis, switch_tab

pytestmark = pytest.mark.core


@pytest.mark.parametrize('language', ['en', 'de'])
@pytest.mark.parametrize('dismiss', ['button', 'backdrop', 'escape', 'keyboard'])
def test_about_dismissal_and_reopening(app, language, dismiss):
    app.evaluate('(lang) => TaraPrefs.setLang(lang)', language)
    switch_tab(app, 'assets')
    before = get_active_analysis(app)
    errors = []
    app.on('pageerror', lambda error: errors.append(str(error)))
    modal = app.locator('#aboutModal')
    for _ in range(2):
        app.locator('#btnAbout').click()
        expect(modal).to_be_visible()
        expect(modal.locator('.close-button')).to_be_focused()
        modal.locator('.about-title-row h2').click()
        expect(modal).to_be_visible()
        if dismiss == 'button':
            modal.locator('.close-button').click()
        elif dismiss == 'backdrop':
            # The shared preference header intentionally remains above modal overlays.
            modal.click(position={'x': 5, 'y': 200})
        elif dismiss == 'escape':
            app.keyboard.press('Escape')
        else:
            modal.locator('.close-button').focus()
            app.keyboard.press('Enter')
        expect(modal).to_be_hidden()
        expect(app.locator('#btnAbout')).to_be_focused()
        expect(app.locator('#tabAssets')).to_be_visible()
        assert get_active_analysis(app) == before
    switch_tab(app, 'risk_analysis')
    expect(app.locator('#tabRiskAnalysis')).to_be_visible()
    assert not errors


def test_about_language_refresh_and_sbom_download(app):
    app.locator('#btnAbout').click()
    app.evaluate("TaraPrefs.setLang('en')")
    modal = app.locator('#aboutModal')
    expect(modal.locator('.close-button')).to_have_accessible_name('Close About')
    with app.expect_download() as downloaded:
        modal.get_by_role('button', name='Export SBOM').click()
    sbom = json.loads(downloaded.value.path().read_text())
    assert sbom['bomFormat'] == 'CycloneDX'
    assert len(sbom['components']) > 0
    expect(modal).to_be_visible()
    app.keyboard.press('Escape')
    expect(modal).to_be_hidden()
    expect(app.locator('#btnAbout')).to_be_focused()


@pytest.mark.parametrize('language', ['en', 'de'])
def test_sbom_matches_shipped_runtime(app, language):
    root = Path(__file__).resolve().parent.parent
    html = (root / 'index.html').read_text()
    package = json.loads((root / 'package.json').read_text())
    app.evaluate('(lang) => TaraPrefs.setLang(lang)', language)
    sbom = app.evaluate('generateCycloneDxSbom()')
    assert sbom['metadata']['component']['version'] == package['version']
    assert sbom['metadata']['component']['licenses'] == [
        {'license': {'id': package['license']}}
    ]
    libraries = [c for c in sbom['components'] if c['type'] == 'library']
    # Check both inventory coverage and exact loaded URLs, so CDN updates cannot
    # silently leave the exported SBOM behind.
    loaded_urls = set(re.findall(r'https://(?:cdnjs|cdn\.jsdelivr)[^"\s]+', html))
    inventory_urls = {
        ref['url'] for component in libraries
        for ref in component['externalReferences'] if ref['type'] == 'distribution'
    }
    assert inventory_urls == loaded_urls
    for component in libraries:
        assert component['purl'].endswith('@' + component['version'])
        assert any(component['version'] in url for url in inventory_urls
                   if url in [r['url'] for r in component['externalReferences']])
    server = next(c for c in sbom['components'] if c['name'] == 'TARA Tool local storage server')
    assert server['scope'] == 'optional'
    assert 'scripts/server.py' in server['description']
    renderer_source = (root / 'js/report/report_pdf_helpers.js').read_text()
    assert {s['name'] for s in sbom['services']} == {'Kroki', 'QuickChart'}
    for service in sbom['services']:
        assert all(endpoint in renderer_source for endpoint in service['endpoints'])
    refs = [c['bom-ref'] for c in [sbom['metadata']['component'], *sbom['components'], *sbom['services']]]
    assert len(refs) == len(set(refs))
    assert sbom['dependencies'] == [{
        'ref': refs[0], 'dependsOn': refs[1:]
    }]
    assert sbom['compositions'][0]['aggregate'] == 'incomplete'
    app.locator('#btnAbout').click()
    expect(app.locator('.about-sbom-table')).not_to_contain_text('undefined')

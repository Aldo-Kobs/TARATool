"""About can be dismissed and reopened without losing the current analysis."""
import json

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

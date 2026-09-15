"""Risk lifecycle phase assignments follow individual risks through persistence and export."""
import json

import pytest
from playwright.sync_api import expect

from conftest import create_analysis, get_active_analysis, switch_tab
from test_asset_risks import setup_assets, create_risk

pytestmark = pytest.mark.risk_analysis


def setup_risks(page):
    page.evaluate("TaraPrefs.setLang('en')")
    setup_assets(page)
    first = create_risk(page, 'A01', 'Assembly risk', assessed=False)
    second = create_risk(page, 'A02', 'Service risk', assessed=False)
    switch_tab(page, 'risk_lifecycle')
    return first, second


def row(page, entry):
    return page.locator(f'[data-lifecycle-risk="{entry["uid"]}"]')


def set_phases(page, entry, *phases):
    picker = row(page, entry).locator('.lifecycle-phase-picker')
    if not picker.evaluate('(el) => el.open'):
        picker.locator('summary').click()
    for checkbox in picker.locator('.lifecycle-phase-checkbox').all():
        checkbox.set_checked(checkbox.input_value() in phases)


def test_tab_position_and_empty_state(app):
    app.evaluate("TaraPrefs.setLang('en')")
    tabs = app.locator('.tab-navigation .tab-button').evaluate_all('(els) => els.map(el => el.dataset.tab)')
    index = tabs.index('tabRiskLifecycle')
    assert tabs[index - 1] == 'tabRiskAnalysis'
    assert tabs[index + 1] == 'tabSecurityGoals'
    switch_tab(app, 'risk_lifecycle')
    expect(app.locator('#riskLifecycleContainer')).to_contain_text('Create risks in the Risk Analysis tab first.')


def test_assign_custom_phase_clear_and_reload(app):
    first, second = setup_risks(app)
    expect(app.locator('#riskLifecycleSummary')).to_have_text('0 of 2 risks have phases assigned')
    expect(row(app, first)).to_contain_text('A01: Low protection component')
    set_phases(app, first, 'manufacturing')
    row(app, first).locator('.lifecycle-notes').fill('Access to programming ports during assembly.')
    set_phases(app, second, 'custom')
    expect(app.locator('#riskLifecycleSummary')).to_have_text('1 of 2 risks have phases assigned')
    row(app, second).locator('.lifecycle-custom').fill('Factory reset and refurbishment')
    expect(app.locator('#riskLifecycleSummary')).to_have_text('2 of 2 risks have phases assigned')
    app.reload()
    switch_tab(app, 'risk_lifecycle')
    expect(row(app, first).locator('.lifecycle-phase-checkbox[value="manufacturing"]')).to_be_checked()
    expect(row(app, first).locator('.lifecycle-notes')).to_have_value('Access to programming ports during assembly.')
    expect(row(app, second).locator('.lifecycle-custom')).to_have_value('Factory reset and refurbishment')
    set_phases(app, first)
    expect(app.locator('#riskLifecycleSummary')).to_have_text('1 of 2 risks have phases assigned')


def test_risk_edit_and_renumbering_preserve_lifecycle(app):
    first, second = setup_risks(app)
    set_phases(app, second, 'maintenance')
    row(app, second).locator('.lifecycle-notes').fill('Service access exposes credentials.')
    switch_tab(app, 'risk_analysis')
    app.evaluate('(id) => editAttackTree(id)', second['id'])
    app.fill('input[name="at_root"]', 'Updated service risk')
    app.locator('#attackTreeForm button[type="submit"]').click()
    app.evaluate('(id) => deleteAttackTree(id)', first['id'])
    app.click('#btnConfirmAction')
    switch_tab(app, 'risk_lifecycle')
    expect(row(app, second)).to_contain_text('R01: Updated service risk')
    expect(row(app, second).locator('.lifecycle-phase-checkbox[value="maintenance"]')).to_be_checked()
    expect(row(app, second).locator('.lifecycle-notes')).to_have_value('Service access exposes credentials.')
    expect(app.locator('.lifecycle-table tbody tr')).to_have_count(1)


def test_custom_phase_and_notes_remain_bilingual_and_render_as_text(app):
    first, _ = setup_risks(app)
    set_phases(app, first, 'custom')
    custom = 'Refurbishment <img src=x onerror="window.lifecycleInjected=true">'
    row(app, first).locator('.lifecycle-custom').fill(custom)
    row(app, first).locator('.lifecycle-notes').fill('English lifecycle reason')
    app.evaluate("TaraPrefs.setLang('de')")
    expect(app.locator('.tab-button[data-tab="tabRiskLifecycle"]')).to_have_text('Risiko-Lebenszyklus')
    row(app, first).locator('.lifecycle-custom').fill('Wiederaufbereitung')
    row(app, first).locator('.lifecycle-notes').fill('Deutsche Begründung')
    app.evaluate("TaraPrefs.setLang('en')")
    expect(row(app, first).locator('.lifecycle-custom')).to_have_value(custom)
    expect(row(app, first).locator('.lifecycle-notes')).to_have_value('English lifecycle reason')
    assert app.evaluate('window.lifecycleInjected === undefined')
    assert app.locator('#riskLifecycleContainer img').count() == 0


def test_phase_and_notes_survive_versions_copy_and_import(app):
    first, _ = setup_risks(app)
    set_phases(app, first, 'manufacturing', 'testing')
    row(app, first).locator('.lifecycle-notes').fill('Debug access during quality assurance.')
    app.evaluate('createNewVersion("Testing phase")')
    original = get_active_analysis(app)
    version = original['metadata']['version']
    set_phases(app, first, 'operation')
    app.evaluate('createNewVersion("Operation phase")')
    app.evaluate('([id, version]) => revertToVersion(id, version)', [original['id'], version])
    app.click('#btnConfirmAction')
    expect(row(app, first).locator('.lifecycle-phase-checkbox[value="testing"]')).to_be_checked()
    create_analysis(app, 'Copied lifecycle', copy_from=original['name'])
    with app.expect_download() as download:
        app.evaluate('exportAnalysis()')
    data = json.loads(download.value.path().read_text())
    app.locator('#importFileInput').set_input_files({'name':'lifecycle.json', 'mimeType':'application/json', 'buffer':json.dumps(data).encode()})
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    lifecycle = get_active_analysis(app)['riskEntries'][0]['lifecycle']
    assert lifecycle['phases'] == ['manufacturing', 'testing']
    assert lifecycle['notes_en'] == 'Debug access during quality assurance.'


@pytest.mark.parametrize('lang', ['en', 'de'])
def test_pdf_exports_lifecycle_between_risks_and_security_goals(app, lang):
    import pymupdf
    first, second = setup_risks(app)
    set_phases(app, first, 'manufacturing', 'testing', 'maintenance')
    row(app, first).locator('.lifecycle-notes').fill('Programming interface is accessible.')
    set_phases(app, second, 'transport', 'custom')
    row(app, second).locator('.lifecycle-custom').fill('Factory refurbishment')
    app.evaluate('''(lang) => {
        TaraPrefs.setLang(lang);
        const a = getActiveAnalysis();
        a.impactComments = Object.fromEntries(a.assets.map(asset => [asset.id,
            Object.fromEntries(getDisplayDamageScenarios(a).map(ds => [ds.id, {text:'Begründung',text_en:'Assessment rationale'}]))]));
    }''', lang)
    with app.expect_download() as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        texts = [page.get_text() for page in pdf]
        title = 'Risk Lifecycle' if lang == 'en' else 'Risiko-Lebenszyklus'
        lifecycle_index = next(i for i, text in enumerate(texts) if title in text)
        text = ' '.join(texts[lifecycle_index].split())
        assert 'R01: Assembly risk' in text
        assert 'R02: Service risk' in text
        assert ('Manufacturing and assembly' if lang == 'en' else 'Fertigung und Montage') in text
        assert ('Testing and quality assurance' if lang == 'en' else 'Prüfung und Qualitätssicherung') in text
        assert ('Maintenance and updates' if lang == 'en' else 'Wartung und Updates') in text
        assert ('Storage and transport' if lang == 'en' else 'Lagerung und Transport') in text
        assert 'Factory refurbishment' in text
        assert 'Programming interface is accessible.' in text
        assert 'A01: Low protection component' in text
        risk_title = 'Risk analysis & attack trees' if lang == 'en' else 'Risikoanalyse & Angriffsbäume'
        risk_index = next(i for i, text in enumerate(texts) if risk_title in text)
        security_index = next(i for i, text in enumerate(texts) if 'Security Objectives' in text)
        assert risk_index < lifecycle_index < security_index


def test_multiple_phases_combine_custom_and_presets_and_can_be_removed(app):
    first, second = setup_risks(app)
    set_phases(app, first, 'manufacturing', 'operation', 'custom')
    row(app, first).locator('.lifecycle-custom').fill('Factory refurbishment')
    expect(row(app, first).locator('.lifecycle-selected li')).to_have_count(3)
    expect(row(app, first).locator('.lifecycle-selected')).to_contain_text('Operation')
    expect(row(app, first).locator('.lifecycle-selected')).to_contain_text('Factory refurbishment')
    expect(row(app, second).locator('.lifecycle-selected')).to_have_text('Not assigned')
    app.reload()
    switch_tab(app, 'risk_lifecycle')
    expect(row(app, first).locator('.lifecycle-selected li')).to_have_count(3)
    set_phases(app, first, 'operation', 'custom')
    expect(row(app, first).locator('.lifecycle-selected li')).to_have_count(2)
    assert get_active_analysis(app)['riskEntries'][0]['lifecycle']['phases'] == ['operation', 'custom']
    set_phases(app, first)
    app.reload()
    switch_tab(app, 'risk_lifecycle')
    expect(row(app, first).locator('.lifecycle-selected')).to_have_text('Not assigned')
    expect(row(app, first).locator('.lifecycle-custom')).to_be_hidden()
    expect(app.locator('#riskLifecycleSummary')).to_have_text('0 of 2 risks have phases assigned')


def test_legacy_single_phase_survives_and_does_not_return_after_clearing(app):
    first, second = setup_risks(app)
    app.evaluate("""() => {
        const a = getActiveAnalysis();
        a.riskEntries[0].lifecycle = {phase:'manufacturing', notes_en:'Saved legacy explanation'};
        a.riskEntries[1].lifecycle = {phase:'custom', customPhase_en:'Legacy custom phase'};
        saveAnalyses();
    }""")
    app.reload()
    switch_tab(app, 'risk_lifecycle')
    expect(row(app, first).locator('.lifecycle-phase-checkbox[value="manufacturing"]')).to_be_checked()
    expect(row(app, first).locator('.lifecycle-notes')).to_have_value('Saved legacy explanation')
    expect(row(app, second).locator('.lifecycle-custom')).to_have_value('Legacy custom phase')
    set_phases(app, first, 'manufacturing', 'testing')
    lifecycle = get_active_analysis(app)['riskEntries'][0]['lifecycle']
    assert lifecycle['phases'] == ['manufacturing', 'testing']
    assert 'phase' not in lifecycle
    set_phases(app, first)
    app.reload()
    switch_tab(app, 'risk_lifecycle')
    expect(row(app, first).locator('.lifecycle-phase-checkbox:checked')).to_have_count(0)
    expect(row(app, first).locator('.lifecycle-selected')).to_have_text('Not assigned')

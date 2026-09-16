"""Explicit per-requirement SL-T targets stay fixed across risk reassessment."""
import json

import pytest
from playwright.sync_api import expect

from conftest import create_analysis, get_active_analysis, switch_tab
from test_asset_risks import setup_assets, create_risk, rate

pytestmark = pytest.mark.risk_analysis
TARGETS = {'FR1': 1, 'FR2': 2, 'FR3': 3, 'FR4': 4, 'FR5': 0, 'FR6': None, 'FR7': 2}


def prepare(page):
    page.evaluate("TaraPrefs.setLang('en')")
    setup_assets(page)
    rate(page, 'A01', 'DS3', '3')
    entry = create_risk(page, 'A01', 'Component security risk')
    page.evaluate('''(uid) => {
        const a = getActiveAnalysis();
        const entry = a.riskEntries.find(r => r.uid === uid);
        Object.assign(entry.treeV2.children[0].impacts[0], {k:'0.7',s:'0.5',t:'0.5',u:'0.5'});
        syncAssetRisks(a);
        saveAnalyses();
        renderRiskAnalysis();
    }''', entry['uid'])
    return entry


def fill_targets(page, targets=TARGETS):
    for requirement, value in targets.items():
        page.locator(f'[data-sl-target="{requirement}"]').select_option('' if value is None else str(value))


def configure(page, targets=TARGETS):
    page.click('#btnSettings')
    fill_targets(page, targets)
    page.locator('#securityLevelSettingsForm button[type="submit"]').click()
    expect(page.locator('#securityLevelSettingsModal')).to_be_hidden()


def targets(page):
    return get_active_analysis(page)['securityLevelSettings']['targets']


def test_seven_independent_targets_include_zero_and_unset(app):
    prepare(app)
    app.click('#btnSettings')
    expect(app.locator('[data-sl-target]')).to_have_count(7)
    expect(app.locator('#slTargetProgress')).to_have_text('0 of 7 targets set')
    expected = ['Identification and authentication control', 'Use control', 'System integrity',
                'Data confidentiality', 'Restricted data flow', 'Timely response to events',
                'Resource availability']
    for name in expected:
        expect(app.locator('.sl-target-table')).to_contain_text(name)
    fill_targets(app)
    expect(app.locator('#slTargetProgress')).to_have_text('6 of 7 targets set')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    assert targets(app) == TARGETS
    assert 'SL-C' not in app.locator('#riskAnalysisContainer').inner_text()
    expect(app.locator('#riskAnalysisContainer .security-level-result')).to_have_count(0)
    switch_tab(app, 'residual_risk')
    for requirement, value in TARGETS.items():
        expect(app.locator(f'[data-sl-target-summary="{requirement}"] strong')).to_have_text('Not set' if value is None else f'SL-T {value}')
    app.reload()
    assert targets(app) == TARGETS
    configure(app, {'FR1': None})
    assert targets(app)['FR1'] is None
    assert targets(app)['FR5'] == 0


def test_cancel_validation_and_language_preserve_targets(app):
    prepare(app)
    configure(app)
    app.click('#btnSettings')
    fill_targets(app, {'FR1': 4})
    app.keyboard.press('Escape')
    assert targets(app) == TARGETS
    app.click('#btnSettings')
    fill_targets(app, {'FR1': 4})
    app.evaluate("TaraPrefs.setLang('de')")
    expect(app.locator('#securityLevelSettingsTitle')).to_have_text('Security-Level-Einstellungen')
    expect(app.locator('[data-sl-target="FR1"]')).to_have_value('4')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    assert targets(app)['FR1'] == 4
    app.evaluate("TaraPrefs.setLang('en')")
    app.click('#btnSettings')
    app.locator('[data-sl-target="FR2"]').evaluate("el => { el.add(new Option('Invalid', '5')); el.value = '5'; }")
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    expect(app.locator('#securityLevelSettingsError')).to_contain_text('Choose SL-T 0–4')
    assert targets(app)['FR2'] == 2
    app.click('#cancelSecurityLevelSettings')


def test_mitigation_changes_residual_risk_but_keeps_targets(app):
    entry = prepare(app)
    configure(app)
    before = app.evaluate('(uid) => computeResidualTreeMetrics(getActiveAnalysis(), uid)', entry['uid'])
    switch_tab(app, 'residual_risk')
    app.locator(f'[data-rr-edit="{entry["uid"]}"]').click()
    app.locator('.rr-treatment').select_option('Mitigiert')
    for select in app.locator('select.rr-kstu').all():
        select.select_option('0.1')
    app.locator('.rr-security').fill('Restrict service access and authenticate commands.')
    app.click('#btnCloseResidualRiskModalFooter')
    after = app.evaluate('(uid) => computeResidualTreeMetrics(getActiveAnalysis(), uid)', entry['uid'])
    assert float(after['riskValue']) < float(before['riskValue'])
    assert targets(app) == TARGETS
    expect(app.locator('[data-sl-target-summary="FR4"] strong')).to_have_text('SL-T 4')
    expect(app.locator('#residualRiskContainer .security-level-result').first).to_contain_text('Configure matrix in Settings')
    rate(app, 'A01', 'DS3', '1')
    assert targets(app) == TARGETS


def test_old_matrix_is_preserved_without_inventing_targets(app):
    prepare(app)
    legacy = {'schemaVersion': 1, 'resultType': 'slcEstimate', 'feasibilityBounds': [0.8, 1.4, 1.8],
              'impactBounds': [0.3, 0.6, 0.8], 'matrix': [[3] * 4 for _ in range(4)]}
    app.evaluate('(settings) => {getActiveAnalysis().securityLevelSettings = settings; saveAnalyses();}', legacy)
    app.reload()
    switch_tab(app, 'risk_analysis')
    assert 'SL-C' not in app.locator('#riskAnalysisContainer').inner_text()
    app.click('#btnSettings')
    expect(app.locator('#securityLevelSettingsBody')).to_contain_text('No SL-T targets are inferred')
    expect(app.locator('#slTargetProgress')).to_have_text('0 of 7 targets set')
    app.click('#cancelSecurityLevelSettings')
    assert get_active_analysis(app)['securityLevelSettings'] == legacy
    configure(app, {'FR3': 2})
    settings = get_active_analysis(app)['securityLevelSettings']
    assert settings['schemaVersion'] == 2
    assert settings['legacyMatrix'] == legacy
    assert settings['targets'] == {key: 2 if key == 'FR3' else None for key in TARGETS}
    app.reload()
    assert targets(app)['FR3'] == 2


def test_targets_survive_versions_copy_import_and_stay_per_analysis(app):
    prepare(app)
    original = get_active_analysis(app)
    app.evaluate('createNewVersion("Before targets")')
    unset_version = get_active_analysis(app)['metadata']['version']
    configure(app)
    configure_matrix(app, [[2] * 4 for _ in range(4)])
    app.evaluate('createNewVersion("Per-FR targets")')
    version = get_active_analysis(app)['metadata']['version']
    configure(app, {key: 4 for key in TARGETS})
    configure_matrix(app, [[4] * 4 for _ in range(4)])
    app.evaluate('createNewVersion("Revised targets")')
    app.evaluate('([id, version]) => revertToVersion(id, version)', [original['id'], unset_version])
    app.click('#btnConfirmAction')
    assert get_active_analysis(app).get('securityLevelSettings') is None
    app.evaluate('([id, version]) => revertToVersion(id, version)', [original['id'], version])
    app.click('#btnConfirmAction')
    assert targets(app) == TARGETS
    assert get_active_analysis(app)['securityLevelSettings']['matrix'] == [[2] * 4 for _ in range(4)]
    create_analysis(app, 'Unconfigured target analysis')
    assert get_active_analysis(app).get('securityLevelSettings') is None
    create_analysis(app, 'Copied SL-T analysis', copy_from=original['name'])
    assert get_active_analysis(app)['history'][0]['state']['securityLevelSettings']['targets'] == TARGETS
    assert get_active_analysis(app)['history'][0]['state']['securityLevelSettings']['matrix'] == [[2] * 4 for _ in range(4)]
    with app.expect_download() as download:
        app.evaluate('exportAnalysis()')
    data = json.loads(download.value.path().read_text())
    app.locator('#importFileInput').set_input_files({'name':'targets.json', 'mimeType':'application/json', 'buffer':json.dumps(data).encode()})
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    assert targets(app) == TARGETS
    assert get_active_analysis(app)['securityLevelSettings']['matrix'] == [[2] * 4 for _ in range(4)]


@pytest.mark.parametrize('lang', ['en', 'de'])
def test_pdf_lists_targets_matrix_and_residual_slc(app, lang):
    import pymupdf
    prepare(app)
    configure(app)
    configure_matrix(app, [[3] * 4 for _ in range(4)])
    app.evaluate('''(lang) => {
        TaraPrefs.setLang(lang);
        const a = getActiveAnalysis();
        a.impactComments = Object.fromEntries(a.assets.map(asset => [asset.id,
            Object.fromEntries(getDisplayDamageScenarios(a).map(ds => [ds.id, {text:'Begründung', text_en:'Assessment rationale'}]))]));
    }''', lang)
    with app.expect_download(timeout=60000) as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        texts = [page.get_text() for page in pdf]
        all_text = ' '.join('\n'.join(texts).split())
        assert 'SL-C 3' in all_text
        assert ('Residual SL-C matrix' if lang == 'en' else 'SL-C-Matrix für Restrisiken') in all_text
        assert 'CRA Documentation Checklist' not in all_text
        title = 'SL-T targets by foundational requirement' if lang == 'en' else 'SL-T-Ziele je grundlegender Anforderung'
        section = ' '.join(next(text for text in texts if title in text).split())
        for requirement, value in TARGETS.items():
            assert requirement in section
            assert ('Not set' if lang == 'en' else 'Nicht festgelegt') in section if value is None else f'SL-T {value}' in section
        for abbreviation in ['IAC', 'UC', 'SI', 'DC', 'RDF', 'TRE', 'RA']:
            assert abbreviation in section


def configure_matrix(page, matrix):
    page.click('#btnSettings')
    for row in range(4):
        for col in range(4):
            page.locator(f'[data-sl-cell="{row}-{col}"]').select_option(str(matrix[row][col]))
    page.locator('#securityLevelSettingsForm button[type="submit"]').click()
    expect(page.locator('#securityLevelSettingsModal')).to_be_hidden()


def test_matrix_recalculates_residual_and_preserves_targets(app):
    entry = prepare(app)
    configure(app)
    matrix = [[row] * 4 for row in range(4)]
    configure_matrix(app, matrix)
    switch_tab(app, 'residual_risk')
    expect(app.locator('[data-sl-residual="true"]').first).to_contain_text('SL-C 3')
    app.locator(f'[data-rr-edit="{entry["uid"]}"]').click()
    app.locator('.rr-treatment').select_option('Mitigiert')
    for select in app.locator('select.rr-kstu').all():
        select.select_option('0.1')
    expect(app.locator('#residualSecurityLevelPreview')).to_contain_text('SL-C 0')
    app.click('#btnCloseResidualRiskModalFooter')
    expect(app.locator('[data-sl-residual="true"]').first).to_contain_text('SL-C 0')
    assert targets(app) == TARGETS
    app.reload()
    switch_tab(app, 'residual_risk')
    expect(app.locator('[data-sl-residual="true"]').first).to_contain_text('SL-C 0')
    assert get_active_analysis(app)['securityLevelSettings']['matrix'] == matrix
    switch_tab(app, 'risk_analysis')
    assert 'SL-C' not in app.locator('#riskAnalysisContainer').inner_text()


def test_restores_archived_matrix_and_validates_boundaries(app):
    entry = prepare(app)
    configure(app)
    matrix = {'schemaVersion':1, 'resultType':'slcEstimate', 'feasibilityBounds':[0.8,1.4,1.8],
              'impactBounds':[0.3,0.6,0.8], 'matrix':[[4]*4 for _ in range(4)]}
    app.evaluate('''(matrix) => {
        const a = getActiveAnalysis();
        a.securityLevelSettings = {schemaVersion:2, targets:a.securityLevelSettings.targets, legacyMatrix:matrix};
        saveAnalyses();
    }''', matrix)
    app.reload()
    switch_tab(app, 'residual_risk')
    expect(app.locator('[data-sl-residual="true"]').first).to_contain_text('SL-C 4')
    app.click('#btnSettings')
    expect(app.locator('[data-sl-cell="0-0"]')).to_have_value('4')
    bounds = app.locator('[data-sl-bound="feasibility"]')
    bounds.nth(1).fill('0.5')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    expect(app.locator('#securityLevelSettingsError')).to_contain_text('strictly increasing')
    assert 'matrix' not in get_active_analysis(app)['securityLevelSettings']
    bounds.nth(1).fill('1.4')
    app.locator('[data-sl-cell="0-0"]').select_option('2')
    app.evaluate("TaraPrefs.setLang('de')")
    expect(app.locator('[data-sl-cell="0-0"]')).to_have_value('2')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    assert get_active_analysis(app)['securityLevelSettings']['matrix'][0][0] == 2
    assert targets(app) == TARGETS
    assert app.evaluate('(uid) => securityLevelForRisk(getActiveAnalysis(), {uid}, true).value', entry['uid']) == 4


def test_matrix_boundaries_missing_assessment_and_incomplete_setup(app):
    entry = prepare(app)
    configure(app)
    configure_matrix(app, [[row] * 4 for row in range(4)])
    # Feasibility exactly 0.8 belongs to the lowest band; just above it does not.
    for value, expected in [('0.2', 0), ('0.20001', 1)]:
        result = app.evaluate('''([uid, value]) => {
            const a = getActiveAnalysis();
            const leaf = a.residualRisk.entries.find(r => r.uid === uid).treeV2.children[0].impacts[0];
            leaf.rr = {...leaf.rr, treatment:'Mitigiert', k:value,s:value,t:value,u:value};
            return securityLevelForRisk(a, {uid}, true);
        }''', [entry['uid'], value])
        assert result['value'] == expected
    # Missing reassessment data must not become a zero-level result.
    assert app.evaluate('''(uid) => {
        const a = getActiveAnalysis();
        a.residualRisk.entries.find(r => r.uid === uid).treeV2.children[0].impacts[0].rr.k = '';
        return securityLevelForRisk(a, {uid}, true).status;
    }''', entry['uid']) == 'unassessed'
    app.click('#btnSettings')
    app.locator('[data-sl-cell="0-0"]').select_option('')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    assert app.evaluate('(uid) => securityLevelForRisk(getActiveAnalysis(), {uid}, true).status', entry['uid']) == 'notConfigured'
    assert targets(app) == TARGETS

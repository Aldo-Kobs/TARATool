"""Configurable security-level planning matrix, persistence and risk integration."""
import json

import pytest
from playwright.sync_api import expect

from conftest import create_analysis, get_active_analysis, switch_tab
from test_asset_risks import setup_assets, create_risk, rate

pytestmark = pytest.mark.risk_analysis
MATRIX = [[0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 4], [3, 4, 4, 4]]


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


def fill_matrix(page, matrix=MATRIX):
    for r, cells in enumerate(matrix):
        for c, value in enumerate(cells):
            page.locator(f'[data-sl-cell="{r}-{c}"]').select_option(str(value))


def configure(page, matrix=MATRIX):
    page.click('#btnSettings')
    fill_matrix(page, matrix)
    page.locator('#securityLevelSettingsForm button[type="submit"]').click()
    expect(page.locator('#securityLevelSettingsModal')).to_be_hidden()


def result(page, residual=False):
    return page.evaluate('(residual) => securityLevelForRisk(getActiveAnalysis(), getActiveAnalysis().riskEntries[0], residual)', residual)


def mitigate(page, entry):
    switch_tab(page, 'residual_risk')
    page.locator(f'[data-rr-edit="{entry["uid"]}"]').click()
    page.locator('.rr-treatment').select_option('Mitigiert')
    expect(page.locator('#residualSecurityLevelPreview')).to_contain_text('Assessment incomplete')
    for select in page.locator('select.rr-kstu').all():
        select.select_option('0.1')
    page.locator('.rr-security').fill('Restrict service access and authenticate commands.')
    expect(page.locator('#residualSecurityLevelPreview')).to_contain_text('SL 1')
    page.click('#btnCloseResidualRiskModalFooter')


def test_settings_validation_cancel_and_no_implicit_mapping(app):
    prepare(app)
    assert result(app)['status'] == 'notConfigured'
    app.click('#btnSettings')
    expect(app.locator('#securityLevelSettingsBody')).to_contain_text('No default IEC matrix is assumed')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    expect(app.locator('#securityLevelSettingsModal')).to_be_visible()
    assert get_active_analysis(app).get('securityLevelSettings') is None
    fill_matrix(app)
    app.locator('[data-sl-bound="feasibility"]').nth(1).fill('0.8')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    expect(app.locator('#securityLevelSettingsError')).to_contain_text('strictly increasing')
    assert get_active_analysis(app).get('securityLevelSettings') is None
    app.click('#cancelSecurityLevelSettings')
    assert result(app)['status'] == 'notConfigured'
    configure(app)
    assert result(app)['value'] == 4
    app.click('#btnSettings')
    app.locator('[data-sl-cell="3-1"]').select_option('0')
    app.keyboard.press('Escape')
    assert result(app)['value'] == 4


def test_all_matrix_cells_and_inclusive_boundaries(app):
    prepare(app)
    configure(app)
    cases = app.evaluate('''() => {
        const a = getActiveAnalysis();
        const entry = a.riskEntries[0];
        const results = [];
        for (const [r, A] of [0, 0.8, 1.4, 1.8, 2.2].entries()) {
            for (const [c, I] of [0, 0.3, 0.6, 0.8, 1].entries()) {
                entry.kstu = {k:A, s:0, t:0, u:0};
                entry.i_norm = I;
                results.push({A,I,...securityLevelForRisk(a, entry)});
            }
        }
        return results;
    }''')
    for case in cases:
        r = next((i for i, bound in enumerate([0.8, 1.4, 1.8]) if case['A'] <= bound), 3)
        c = next((i for i, bound in enumerate([0.3, 0.6, 0.8]) if case['I'] <= bound), 3)
        assert case['status'] == 'ok'
        assert case['value'] == MATRIX[r][c]
        assert case['feasibilityBand'] == r and case['impactBand'] == c
    assert cases[0]['value'] == 0  # SL 0 is an explicit matrix value, not missing data.


def test_missing_paths_and_invalid_settings_never_produce_a_level(app):
    prepare(app)
    configure(app)
    app.evaluate('''() => {
        const entry = getActiveAnalysis().riskEntries[0];
        const leaf = structuredClone(entry.treeV2.children[0].impacts[0]);
        leaf.uid = generateUID('leaf'); leaf.k = '';
        entry.treeV2.children[0].impacts.push(leaf);
    }''')
    assert result(app)['status'] == 'unassessed'
    app.evaluate('getActiveAnalysis().securityLevelSettings.matrix[0][0] = 5')
    assert result(app)['status'] == 'notConfigured'


def test_original_and_residual_risks_update_with_mitigation_and_settings(app):
    entry = prepare(app)
    configure(app)
    assert result(app)['feasibility'] == 2.2
    assert result(app)['impact'] == 0.6
    assert result(app)['value'] == 4
    mitigate(app, entry)
    assert result(app, True)['feasibility'] == 0.4
    assert result(app, True)['value'] == 1
    assert result(app)['value'] == 4
    expect(app.locator('.rr-risk-card .security-level-result')).to_contain_text('SL 1')
    app.click('#btnSettings')
    app.locator('[data-sl-cell="0-1"]').select_option('2')
    app.locator('#slResultType').select_option('slt')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    expect(app.locator('.rr-risk-card .security-level-result')).to_contain_text('SL-T target: SL 2')
    assert result(app)['value'] == 4
    app.reload()
    switch_tab(app, 'residual_risk')
    assert result(app, True)['value'] == 2
    app.click('#btnSettings')
    app.locator('[data-sl-bound="feasibility"]').nth(0).fill('0.3')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    assert result(app, True)['feasibilityBand'] == 1


def test_matrix_is_per_analysis_and_survives_versions_copy_and_import(app):
    prepare(app)
    original = get_active_analysis(app)
    configure(app)
    app.evaluate('createNewVersion("Matrix configured")')
    version = get_active_analysis(app)['metadata']['version']
    configure(app, [[1] * 4 for _ in range(4)])
    app.evaluate('createNewVersion("Alternate matrix")')
    app.evaluate('([id, version]) => revertToVersion(id, version)', [original['id'], version])
    app.click('#btnConfirmAction')
    assert get_active_analysis(app)['securityLevelSettings']['matrix'] == MATRIX
    create_analysis(app, 'Unconfigured analysis')
    assert get_active_analysis(app).get('securityLevelSettings') is None
    create_analysis(app, 'Copied matrix analysis', copy_from=original['name'])
    assert get_active_analysis(app)['history'][0]['state']['securityLevelSettings']['matrix'] == MATRIX
    with app.expect_download() as download:
        app.evaluate('exportAnalysis()')
    data = json.loads(download.value.path().read_text())
    app.locator('#importFileInput').set_input_files({'name':'matrix.json', 'mimeType':'application/json', 'buffer':json.dumps(data).encode()})
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    assert get_active_analysis(app)['securityLevelSettings']['matrix'] == MATRIX


def test_settings_language_change_preserves_unsaved_edits(app):
    prepare(app)
    app.click('#btnSettings')
    fill_matrix(app)
    app.locator('[data-sl-bound="impact"]').nth(0).fill('0.25')
    app.evaluate("TaraPrefs.setLang('de')")
    expect(app.locator('#securityLevelSettingsTitle')).to_have_text('Security-Level-Einstellungen')
    expect(app.locator('[data-sl-bound="impact"]').nth(0)).to_have_value('0.25')
    expect(app.locator('[data-sl-cell="3-1"]')).to_have_value('4')
    app.locator('#securityLevelSettingsForm button[type="submit"]').click()
    assert get_active_analysis(app)['securityLevelSettings']['impactBounds'][0] == 0.25


def test_pdf_includes_settings_and_both_risk_levels(app):
    import pymupdf
    entry = prepare(app)
    configure(app)
    mitigate(app, entry)
    app.evaluate('''() => {
        const a = getActiveAnalysis();
        a.impactComments = Object.fromEntries(a.assets.map(asset => [asset.id,
            Object.fromEntries(getDisplayDamageScenarios(a).map(ds => [ds.id, {text_en:'Assessment rationale'}]))]));
    }''')
    with app.expect_download(timeout=60000) as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        texts = [page.get_text() for page in pdf]
        all_text = ' '.join('\n'.join(texts).split())
        assert 'Security level settings' in all_text
        assert 'User-defined planning matrix' in all_text
        assert '0 <= x <= 0.3' in all_text
        assert '0.8 < x <= 1.4' in all_text
        assert 'SL-C planning estimate' in all_text
        residual = ' '.join(text for text in texts if 'Root node overview (residual risk)' in text)
        assert 'SL 1' in residual
        original = ' '.join(text for text in texts if 'R01: Component security risk' in text and 'Risk score' in text)
        assert 'SL 4' in original

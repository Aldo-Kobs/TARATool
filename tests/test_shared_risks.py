"""A single authored risk can cover multiple assets without duplicating its identity."""
import pytest
from playwright.sync_api import expect

from conftest import add_asset, create_analysis, get_active_analysis, switch_tab
from test_asset_risks import setup_assets, rate, create_risk, coverage

pytestmark = pytest.mark.risk_analysis


def assign_existing(page, asset, risk):
    row = coverage(page, asset)
    row.locator('[data-existing-risk]').select_option(risk)
    row.locator('[data-asset-assign]').click()


def test_share_edit_reload_and_unassign_risk(app):
    setup_assets(app)
    rate(app, 'A01', 'DS3', '1')
    rate(app, 'A02', 'DS3', '3')
    original = create_risk(app, 'A01')
    assign_existing(app, 'A02', original['id'])
    analysis = get_active_analysis(app)
    assert len(analysis['riskEntries']) == 1
    shared = analysis['riskEntries'][0]
    assert shared['uid'] == original['uid']
    assert set(shared['assetUids']) == {asset['uid'] for asset in analysis['assets']}
    expected = app.evaluate("SEVERITY_LEVEL_FACTORS['3'] * PROTECTION_LEVEL_WEIGHTS['III']")
    assert float(shared['i_norm']) == pytest.approx(expected)
    impacts = app.evaluate('getRiskDamageImpacts(getActiveAnalysis(), getActiveAnalysis().riskEntries[0])')
    assert [(item['assetId'], item['id']) for item in impacts['items']] == [('A01', 'DS3'), ('A02', 'DS3')]
    residual = app.evaluate('(uid) => computeResidualTreeMetrics(getActiveAnalysis(), uid)', shared['uid'])
    assert residual['i_norm'] == shared['i_norm']
    for asset in ['A01', 'A02']:
        expect(coverage(app, asset).locator('[data-risk-edit]')).to_have_count(1)
        expect(coverage(app, asset).locator('[data-existing-risk]')).to_be_disabled()
    app.reload()
    switch_tab(app, 'risk_analysis')
    coverage(app, 'A02').locator('[data-risk-edit]').click()
    expect(app.locator('#at_asset')).to_have_values(['A01', 'A02'])
    app.fill('input[name="at_root"]', 'Shared edited risk')
    app.locator('#attackTreeForm button[type="submit"]').click()
    for asset in ['A01', 'A02']:
        expect(coverage(app, asset)).to_contain_text('Shared edited risk')
    coverage(app, 'A01').locator('[data-risk-edit]').click()
    app.locator('#at_asset').select_option('A01')
    app.locator('#attackTreeForm button[type="submit"]').click()
    expect(coverage(app, 'A02').locator('.asset-risk-missing')).to_have_count(1)
    assert get_active_analysis(app)['riskEntries'][0]['rootRiskValue'] == original['rootRiskValue']


def test_shared_risk_survives_asset_deletion_and_export(app):
    import json
    setup_assets(app)
    original = create_risk(app, 'A01')
    assign_existing(app, 'A02', original['id'])
    with app.expect_download() as download:
        app.evaluate('exportAnalysis()')
    exported = json.loads(download.value.path().read_text())
    assert len(exported['riskEntries'][0]['assetUids']) == 2
    create_analysis(app, 'Copy of shared risks', copy_from=exported['name'])
    assert get_active_analysis(app)['riskEntries'][0]['assetUids'] == exported['riskEntries'][0]['assetUids']
    app.locator('#importFileInput').set_input_files({
        'name': 'shared.json', 'mimeType': 'application/json', 'buffer': json.dumps(exported).encode()
    })
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    assert get_active_analysis(app)['riskEntries'][0]['assetUids'] == exported['riskEntries'][0]['assetUids']
    imported_id = get_active_analysis(app)['id']
    app.evaluate('removeAsset("A01")')
    app.click('#btnConfirmAction')
    app.reload()
    app.evaluate('(id) => activateAnalysis(id)', imported_id)
    analysis = get_active_analysis(app)
    assert len(analysis['riskEntries']) == 1
    assert analysis['riskEntries'][0]['uid'] == original['uid']
    assert analysis['riskEntries'][0]['assetUids'] == [analysis['assets'][0]['uid']]
    switch_tab(app, 'risk_analysis')
    expect(coverage(app, 'A01').locator('[data-risk-edit]')).to_have_count(1)
    app.evaluate('(id) => deleteAttackTree(id)', original['id'])
    app.click('#btnConfirmAction')
    expect(coverage(app, 'A01').locator('.asset-risk-missing')).to_have_count(1)


def test_create_shared_risk_and_ignore_unassigned_assets(app):
    setup_assets(app)
    add_asset(app, {'name': 'Unassigned asset', 'type': 'Component',
                    'confidentiality': 'III', 'integrity': 'III', 'availability': 'III'})
    rate(app, 'A01', 'DS3', '1')
    rate(app, 'A02', 'DS3', '1')
    rate(app, 'A03', 'DS3', '3')
    original = create_risk(app, 'A01')
    coverage(app, 'A01').locator('[data-risk-edit]').click()
    app.locator('#at_asset').select_option(['A01', 'A02'])
    app.locator('#attackTreeForm button[type="submit"]').click()
    expected = app.evaluate("SEVERITY_LEVEL_FACTORS['1'] * PROTECTION_LEVEL_WEIGHTS['III']")
    assert float(get_active_analysis(app)['riskEntries'][0]['i_norm']) == pytest.approx(expected)
    coverage(app, 'A02').locator('[data-risk-edit]').click()
    app.locator('#at_asset').select_option([])
    app.locator('#attackTreeForm button[type="submit"]').click()
    expect(app.locator('#attackTreeModal')).to_be_visible()
    assert app.locator('#at_asset').evaluate('(el) => el.validity.valueMissing')
    app.locator('#at_asset').select_option(['A01', 'A02'])
    app.locator('#attackTreeForm button[type="submit"]').click()
    app.evaluate('(id) => deleteAttackTree(id)', original['id'])
    app.click('#btnConfirmAction')
    assert get_active_analysis(app)['riskEntries'] == []
    expect(app.locator('.asset-risk-missing')).to_have_count(3)


def test_shared_risk_pdf_covers_both_assets(app):
    import pymupdf
    setup_assets(app)
    rate(app, 'A01', 'DS3', '1')
    rate(app, 'A02', 'DS3', '3')
    original = create_risk(app, 'A01', 'Shared PDF risk')
    assign_existing(app, 'A02', original['id'])
    app.evaluate('''() => {
        TaraPrefs.setLang('en');
        const a = getActiveAnalysis();
        a.impactComments = Object.fromEntries(a.assets.map(asset => [asset.id,
            Object.fromEntries(getDisplayDamageScenarios(a).map(ds => [ds.id, {text_en:'Assessment rationale'}]))]));
    }''')
    with app.expect_download() as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        text = ' '.join('\n'.join(page.get_text() for page in pdf).split())
        assert 'A01: Low protection component' in text
        assert 'A02: High protection component' in text
        assert 'No risk linked' not in text
        assert text.count('R01: Shared PDF risk') >= 2


@pytest.mark.parametrize('lang,label', [('en', 'Remove assignment'), ('de', 'Zuordnung entfernen')])
def test_remove_individual_and_last_assignment_without_deleting_risk(app, lang, label):
    app.evaluate('(lang) => TaraPrefs.setLang(lang)', lang)
    setup_assets(app)
    rate(app, 'A01', 'DS3', '1')
    rate(app, 'A02', 'DS3', '3')
    original = create_risk(app, 'A01', 'Risk to detach')
    other = create_risk(app, 'A02', 'Keep assigned')
    assign_existing(app, 'A02', original['id'])
    app.evaluate('''uid => {
        const a = getActiveAnalysis();
        a.riskEntries.find(r => r.uid === uid).notes = 'Keep investigation';
        a.residualRisk.entries.find(r => r.uid === uid).evaluated = true;
        saveAnalyses();
    }''', original['uid'])
    remove = coverage(app, 'A02').locator(f'[data-risk-unassign="{original["id"]}"]')
    expect(remove).to_have_attribute("aria-label", f"{label}: {original['id']} — A02")
    remove.click()
    analysis = get_active_analysis(app)
    assert len(analysis['riskEntries']) == 2
    risk = next(r for r in analysis['riskEntries'] if r['uid'] == original['uid'])
    assert risk['assetUids'] == original['assetUids']
    assert risk['rootRiskValue'] == original['rootRiskValue']
    assert risk['notes'] == 'Keep investigation'
    assert next(r for r in analysis['residualRisk']['entries'] if r['uid'] == original['uid'])['evaluated']
    expect(coverage(app, 'A01').locator(f'[data-risk-edit="{original["id"]}"]')).to_have_count(1)
    expect(coverage(app, 'A02').locator(f'[data-risk-edit="{original["id"]}"]')).to_have_count(0)
    expect(coverage(app, 'A02').locator(f'[data-risk-edit="{other["id"]}"]')).to_have_count(1)
    coverage(app, 'A01').locator(f'[data-risk-unassign="{original["id"]}"]').click()
    app.reload()
    switch_tab(app, 'risk_analysis')
    analysis = get_active_analysis(app)
    risk = next(r for r in analysis['riskEntries'] if r['uid'] == original['uid'])
    assert risk['assetUids'] == []
    assert risk['assetId'] == '' and risk['assetUid'] == ''
    assert risk['rootRiskValue'] == ''
    assert risk['notes'] == 'Keep investigation'
    assert len(analysis['riskEntries']) == 2
    expect(app.locator('#existingRiskEntriesContainer')).to_contain_text('Risk to detach')
    expect(coverage(app, 'A01').locator('.asset-risk-missing')).to_have_count(1)
    assign_existing(app, 'A02', original['id'])
    expect(coverage(app, 'A02').locator('[data-risk-edit]')).to_have_count(2)
    assert len(get_active_analysis(app)['riskEntries']) == 2

"""Manual risks and asset coverage stay consistent across editing and lifecycle changes."""
import json

import pytest
from playwright.sync_api import expect

from conftest import add_asset, create_analysis, get_active_analysis, switch_tab

pytestmark = pytest.mark.risk_analysis


def setup_assets(page):
    add_asset(page, {'name': 'Low protection component', 'type': 'Component', 'description': '',
                     'confidentiality': 'I', 'integrity': 'I', 'availability': 'I', 'authorization': 'I', 'authentication': 'I'})
    add_asset(page, {'name': 'High protection component', 'type': 'Component', 'description': '',
                     'confidentiality': 'III', 'integrity': 'III', 'availability': 'III', 'authorization': 'III', 'authentication': 'III'})
    switch_tab(page, 'damage_scenarios')


def rate(page, asset, ds, value):
    switch_tab(page, 'damage_scenarios')
    page.locator(f'#dsMatrixContainer select[data-asset-id="{asset}"][data-ds-id="{ds}"]').select_option(value)


def create_risk(page, asset, name='Manual component risk', assessed=True):
    switch_tab(page, 'risk_analysis')
    page.locator(f'[data-asset-create="{asset}"]').click()
    expect(page.locator('#at_asset')).to_have_value(asset)
    expect(page.locator('#at_asset')).to_be_enabled()
    page.fill('input[name="at_root"]', name)
    page.click('#btnAddAttackPath')
    if assessed:
        page.evaluate("""() => {
            atV2.root.children[0].impacts.push({uid:generateUID('leaf'),text:'Loss of operation',
                ds:['DS3'],stride:[],k:'0.1',s:'0.1',t:'0.1',u:'0.1',i_norm:''});
            atV2.rerender();
        }""")
    page.locator('#attackTreeForm button[type="submit"]').click()
    expect(page.locator('#attackTreeModal')).to_be_hidden()
    return get_active_analysis(page)['riskEntries'][-1]


def coverage(page, asset):
    return page.locator(f'.asset-risk-table tbody tr[data-asset-id="{asset}"]')


def test_matrix_ratings_never_create_risks_and_all_assets_are_listed(app):
    setup_assets(app)
    for ds, value in [('DS1', '1'), ('DS2', '2'), ('DS3', '3')]:
        rate(app, 'A01', ds, value)
    rate(app, 'A02', 'DS3', '2')
    for _ in range(3):
        switch_tab(app, 'risk_analysis')
        app.evaluate('syncAssetRisks(getActiveAnalysis())')
    assert get_active_analysis(app)['riskEntries'] == []
    expect(app.locator('.asset-risk-table tbody tr')).to_have_count(2)
    expect(app.locator('.asset-risk-missing')).to_have_count(2)
    expect(coverage(app, 'A01')).to_contain_text('Low protection component')
    expect(coverage(app, 'A02')).to_contain_text('High protection component')
    app.reload()
    assert get_active_analysis(app)['riskEntries'] == []


def test_manual_asset_selection_coverage_reassignment_and_delete(app):
    setup_assets(app)
    switch_tab(app, 'risk_analysis')
    app.click('#btnOpenAttackTreeModal')
    app.fill('input[name="at_root"]', 'Needs an asset')
    app.click('#btnAddAttackPath')
    app.locator('#attackTreeForm button[type="submit"]').click()
    expect(app.locator('#attackTreeModal')).to_be_visible()
    assert app.locator('#at_asset').evaluate('(el) => el.validity.valueMissing')
    assert get_active_analysis(app)['riskEntries'] == []
    app.locator('#at_asset').select_option('A02')
    app.locator('#attackTreeForm button[type="submit"]').click()
    expect(app.locator('#attackTreeModal')).to_be_hidden()
    first = get_active_analysis(app)['riskEntries'][0]
    expect(coverage(app, 'A02').locator('[data-risk-edit]')).to_have_count(1)
    create_risk(app, 'A02', 'Second risk')
    expect(coverage(app, 'A02').locator('[data-risk-edit]')).to_have_count(2)
    coverage(app, 'A02').locator('[data-risk-edit]').first.click()
    app.locator('#at_asset').select_option('A01')
    app.locator('#attackTreeForm button[type="submit"]').click()
    expect(coverage(app, 'A01').locator('[data-risk-edit]')).to_have_count(1)
    expect(coverage(app, 'A02').locator('[data-risk-edit]')).to_have_count(1)
    app.evaluate('(id) => deleteAttackTree(id)', first['id'])
    app.click('#btnConfirmAction')
    expect(coverage(app, 'A01').locator('.asset-risk-missing')).to_have_count(1)
    expect(coverage(app, 'A02').locator('[data-risk-edit]')).to_have_count(1)


def test_risk_and_residual_scores_use_only_the_assigned_asset(app):
    setup_assets(app)
    rate(app, 'A01', 'DS3', '1')
    rate(app, 'A02', 'DS3', '3')
    first = create_risk(app, 'A01')
    expected = app.evaluate("SEVERITY_LEVEL_FACTORS['1'] * PROTECTION_LEVEL_WEIGHTS['I']")
    assert float(first['i_norm']) == pytest.approx(expected)
    assert float(first['rootRiskValue']) == pytest.approx(round(expected * 0.4, 2))
    rate(app, 'A02', 'DS3', '1')
    assert get_active_analysis(app)['riskEntries'][0]['rootRiskValue'] == first['rootRiskValue']
    rate(app, 'A02', 'DS3', 'N/A')
    assert get_active_analysis(app)['riskEntries'][0]['i_norm'] == first['i_norm']
    residual = app.evaluate('(uid) => computeResidualTreeMetrics(getActiveAnalysis(), uid)', first['uid'])
    assert residual['i_norm'] == first['i_norm']
    assert residual['riskValue'] == first['rootRiskValue']
    switch_tab(app, 'risk_analysis')
    coverage(app, 'A01').locator('[data-risk-edit]').click()
    app.locator('#at_asset').select_option('A02')
    app.locator('#attackTreeForm button[type="submit"]').click()
    rate(app, 'A02', 'DS3', '3')
    expected = app.evaluate("SEVERITY_LEVEL_FACTORS['3'] * PROTECTION_LEVEL_WEIGHTS['III']")
    assert float(get_active_analysis(app)['riskEntries'][0]['i_norm']) == pytest.approx(expected)


def test_na_keeps_manually_authored_risks(app):
    setup_assets(app)
    rate(app, 'A01', 'DS3', '2')
    entry = create_risk(app, 'A01')
    rate(app, 'A01', 'DS3', 'N/A')
    app.reload()
    kept = get_active_analysis(app)['riskEntries']
    assert len(kept) == 1
    assert kept[0]['uid'] == entry['uid']
    assert kept[0]['treeV2']['children'][0]['impacts'][0]['text'] == 'Loss of operation'
    assert get_active_analysis(app)['matrixRiskArchive'] == []


def test_previous_generated_risks_are_retired_without_losing_details(app):
    setup_assets(app)
    manual = create_risk(app, 'A01')
    generated = create_risk(app, 'A02', 'Previously generated risk')
    app.evaluate("""(uid) => {
        const a = getActiveAnalysis();
        const r = a.riskEntries.find(r => r.uid === uid);
        r.matrixGenerated = true;
        r.damageScenarioId = 'DS3';
        r.notes = 'Preserve investigation';
        a.residualRisk.entries.find(r => r.uid === uid).notes = 'Preserve treatment';
        a.impactMatrix.A02 = {DS3: '3'};
        saveAnalyses();
    }""", generated['uid'])
    app.reload()
    analysis = get_active_analysis(app)
    assert [r['uid'] for r in analysis['riskEntries']] == [manual['uid']]
    archived = analysis['matrixRiskArchive'][0]
    assert archived['entry']['uid'] == generated['uid']
    assert archived['entry']['notes'] == 'Preserve investigation'
    assert archived['residual']['notes'] == 'Preserve treatment'
    assert [r['uid'] for r in analysis['residualRisk']['entries']] == [manual['uid']]
    rate(app, 'A02', 'DS3', 'N/A')
    rate(app, 'A02', 'DS3', '3')
    app.reload()
    analysis = get_active_analysis(app)
    assert len(analysis['matrixRiskArchive']) == 1
    assert [r['uid'] for r in analysis['riskEntries']] == [manual['uid']]


def test_deleting_asset_does_not_retarget_its_risks_after_renumbering(app):
    setup_assets(app)
    removed = create_risk(app, 'A01', 'Removed asset risk')
    remaining = create_risk(app, 'A02', 'Remaining asset risk')
    app.evaluate('removeAsset("A01")')
    app.click('#btnConfirmAction')
    entries = get_active_analysis(app)['riskEntries']
    assert len(entries) == 2
    assert entries[0]['uid'] == removed['uid'] and entries[0]['assetId'] == ''
    assert entries[1]['uid'] == remaining['uid'] and entries[1]['assetId'] == 'A01'
    assert entries[1]['assetUid'] == remaining['assetUid']
    switch_tab(app, 'risk_analysis')
    expect(coverage(app, 'A01').locator('[data-risk-edit]')).to_have_count(1)
    expect(coverage(app, 'A01')).to_contain_text('Remaining asset risk')


def test_legacy_multi_asset_tree_requires_explicit_binding(app):
    setup_assets(app)
    app.evaluate('''() => {
        const a = getActiveAnalysis();
        a.impactMatrix = {A01: {DS3:'1'}, A02: {DS3:'3'}};
        a.riskEntries = [{id:'R01',uid:'legacy',rootName:'Legacy tree',treeDepth:1,
            branches:[{name:'Legacy path',leaves:[{text:'Impact',ds:['DS3'],k:'0.1',s:'0.1',t:'0.1',u:'0.1'}]}]}];
        migrateAnalysis(a);
    }''')
    legacy = next(r for r in get_active_analysis(app)['riskEntries'] if r['uid'] == 'legacy')
    assert legacy['assetId'] == '' and legacy['i_norm'] == '' and legacy['rootRiskValue'] == ''
    switch_tab(app, 'risk_analysis')
    app.evaluate('editAttackTree("R01")')
    expect(app.locator('#at_asset')).to_have_value('')
    app.locator('#at_asset').select_option('A01')
    app.locator('#attackTreeForm button[type="submit"]').click()
    legacy = next(r for r in get_active_analysis(app)['riskEntries'] if r['uid'] == 'legacy')
    assert legacy['assetId'] == 'A01'
    expected = app.evaluate("SEVERITY_LEVEL_FACTORS['1'] * PROTECTION_LEVEL_WEIGHTS['I']")
    assert float(legacy['i_norm']) == pytest.approx(expected)


def test_manual_risks_copy_export_import_and_version_restore(app):
    setup_assets(app)
    rate(app, 'A01', 'DS3', '2')
    create_risk(app, 'A01')
    original = get_active_analysis(app)
    uid = original['riskEntries'][0]['uid']
    app.evaluate('createNewVersion("Applicable risk")')
    version = get_active_analysis(app)['metadata']['version']
    rate(app, 'A01', 'DS3', 'N/A')
    app.evaluate('createNewVersion("Not applicable")')
    app.evaluate('([id, v]) => revertToVersion(id, v)', [original['id'], version])
    app.click('#btnConfirmAction')
    assert get_active_analysis(app)['riskEntries'][0]['uid'] == uid
    rate(app, 'A01', 'DS3', 'N/A')
    snapshot = next(item for item in get_active_analysis(app)['history'] if item['version'] == version)
    assert snapshot['state']['impactMatrix']['A01']['DS3'] == '2'
    app.evaluate('([id, v]) => revertToVersion(id, v)', [original['id'], version])
    app.click('#btnConfirmAction')
    assert get_active_analysis(app)['riskEntries'][0]['uid'] == uid
    create_analysis(app, 'Copied asset risks', copy_from=original['name'])
    assert len(get_active_analysis(app)['riskEntries']) == 1
    with app.expect_download() as download:
        app.evaluate('exportAnalysis()')
    data = json.loads(download.value.path().read_text())
    app.locator('#importFileInput').set_input_files({'name':'risks.json','mimeType':'application/json','buffer':json.dumps(data).encode()})
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    assert len(get_active_analysis(app)['riskEntries']) == 1
    assert get_active_analysis(app)['riskEntries'][0]['assetUid'] == data['assets'][0]['uid']


def test_pdf_identifies_manually_assigned_assets_and_unassessed_risks(app):
    import pymupdf
    setup_assets(app)
    rate(app, 'A01', 'DS3', '1')
    rate(app, 'A02', 'DS3', '3')
    create_risk(app, 'A01', 'First unassessed risk', assessed=False)
    create_risk(app, 'A02', 'Second unassessed risk', assessed=False)
    add_asset(app, {'name': 'Unlinked component', 'type': 'Component'})
    app.evaluate('''() => {
        TaraPrefs.setLang('en');
        const a = getActiveAnalysis();
        a.impactComments = Object.fromEntries(a.assets.map(asset => [asset.id,
            Object.fromEntries(getDisplayDamageScenarios(a).map(ds => [ds.id, {text_en:'Assessment rationale'}]))]));
    }''')
    with app.expect_download() as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        risk_pages = [page.get_text() for page in pdf if 'Risk analysis & attack trees' in page.get_text()]
        assert risk_pages
        text = ' '.join('\n'.join(page.get_text() for page in pdf).split())
        assert 'Assets and linked risks' in text
        assert 'A03: Unlinked component' in text
        assert 'No risk linked' in text
        assert 'A01: Low protection component' in text
        assert 'A02: High protection component' in text
        assert 'Attack path not yet assessed' in text
        assert '0.00' not in text

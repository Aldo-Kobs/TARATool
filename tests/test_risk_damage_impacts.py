"""Show the source damage-scenario ratings for each risk's own asset."""
import pytest
from playwright.sync_api import expect
from conftest import get_active_analysis, switch_tab
from test_asset_risks import setup_assets, create_risk, rate

pytestmark = pytest.mark.risk_analysis


def detail(page, entry):
    return page.locator(f'#existingRiskEntriesContainer [data-risk-impact="{entry["uid"]}"]')


def test_risk_shows_linked_scenario_ratings_for_its_own_asset_and_refreshes(app):
    app.evaluate("TaraPrefs.setLang('en')")
    setup_assets(app)
    rate(app, 'A01', 'DS3', '3')
    rate(app, 'A02', 'DS3', '1')
    rate(app, 'A01', 'DS1', '2')  # Unlinked scenario must not leak into the risk.
    first = create_risk(app, 'A01', 'First component risk')
    second = create_risk(app, 'A02', 'Second component risk')
    expect(detail(app, first)).to_contain_text('3 (High)')
    expect(detail(app, second)).to_contain_text('1 (Low)')
    expect(detail(app, first).locator('[data-impact-ds="DS1"]')).to_have_count(0)
    expect(app.locator('#rootOverviewContainer [data-risk-impact]')).to_have_count(0)
    old = get_active_analysis(app)
    app.evaluate('renderRiskAnalysis()')
    current = get_active_analysis(app)
    assert [r['rootRiskValue'] for r in old['riskEntries']] == [r['rootRiskValue'] for r in current['riskEntries']]
    assert current['impactMatrix'] == old['impactMatrix']
    rate(app, 'A01', 'DS3', '2')
    switch_tab(app, 'risk_analysis')
    expect(detail(app, first)).to_contain_text('2 (Medium)')
    expect(detail(app, second)).to_contain_text('1 (Low)')
    app.reload()
    switch_tab(app, 'risk_analysis')
    expect(detail(app, first)).to_contain_text('2 (Medium)')
    app.evaluate("TaraPrefs.setLang('de')")
    expect(detail(app, first)).to_contain_text('Auswirkung aus Schadensszenarien')
    expect(detail(app, first)).to_contain_text('2 (Medium)')  # Matches the source matrix label.


def test_multiple_scenarios_deduplicated_na_custom_and_legacy_trees(app):
    app.evaluate("TaraPrefs.setLang('en')")
    setup_assets(app)
    entry = create_risk(app, 'A01')
    app.evaluate('''uid => {
        const a = getActiveAnalysis();
        a.damageScenarios.push({id:'DS99',name:'Eigener Schaden',name_en:'Custom damage'});
        a.impactMatrix.A01 = {...a.impactMatrix.A01, DS99:3, DS3:'N/A'};
        const r = a.riskEntries.find(r => r.uid === uid);
        const node = r.treeV2.children[0];
        node.impacts[0].ds = ['DS3','DS99'];
        node.impacts.push({...structuredClone(node.impacts[0]), uid:'duplicate-ds-leaf'});
        renderRiskAnalysis();
    }''', entry['uid'])
    expect(detail(app, entry).locator('li')).to_have_count(2)
    expect(detail(app, entry).locator('[data-impact-ds="DS3"]')).to_contain_text('N/A')
    expect(detail(app, entry).locator('[data-impact-ds="DS99"]')).to_contain_text('Custom damage: 3 (High)')
    result = app.evaluate('''() => getRiskDamageImpacts(getActiveAnalysis(), {
      assetId:'A01', treeDepth:1, branches:[{leaves:[{ds:['DS3','DS99']}]}]
    })''')
    assert [item['level'] for item in result['items']] == ['N/A','3 (High)']


def test_missing_asset_or_linked_scenarios_never_borrow_other_ratings(app):
    app.evaluate("TaraPrefs.setLang('en')")
    setup_assets(app)
    rate(app, 'A02', 'DS3', '3')
    entry = create_risk(app, 'A01')
    app.evaluate('''uid => {
        const a=getActiveAnalysis();
        const r=a.riskEntries.find(r=>r.uid===uid);
        r.treeV2.children[0].impacts[0].ds=[];
        renderRiskAnalysis();
    }''', entry['uid'])
    expect(detail(app, entry)).to_contain_text('No damage scenarios linked to this risk.')
    app.evaluate('''uid => {
        const a=getActiveAnalysis();
        const r=a.riskEntries.find(r=>r.uid===uid);
        r.treeV2.children[0].impacts[0].ds=['DS3'];
        r.assetUid='deleted-asset';
        r.assetId='A02';
        renderRiskAnalysis();
    }''', entry['uid'])
    expect(detail(app, entry).locator('li')).to_have_count(0)
    assert app.evaluate('(uid) => getRiskDamageImpacts(getActiveAnalysis(),getActiveAnalysis().riskEntries.find(r=>r.uid===uid)).status', entry['uid']) == 'assetRequired'
    assert '3 (High)' not in detail(app, entry).inner_text()


@pytest.mark.parametrize('lang', ['en','de'])
def test_pdf_risk_details_include_source_impact_rating(app, lang):
    import pymupdf
    app.evaluate("TaraPrefs.setLang('en')")
    setup_assets(app)
    rate(app, 'A01', 'DS3', '3')
    create_risk(app, 'A01', 'Risk with source impact')
    app.evaluate('''lang => {
        TaraPrefs.setLang(lang);
        const a=getActiveAnalysis();
        a.impactComments=Object.fromEntries(a.assets.map(asset=>[asset.id,
          Object.fromEntries(getDisplayDamageScenarios(a).map(ds=>[ds.id,{text:'Begründung',text_en:'Assessment rationale'}]))]));
    }''',lang)
    with app.expect_download(timeout=60000) as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        text=' '.join('\n'.join(p.get_text() for p in pdf).split())
        title='Impact from Damage Scenarios' if lang=='en' else 'Auswirkung aus Schadensszenarien'
        assert title in text
        section=text.split(title)[-1][:200]
        assert 'DS3' in section
        assert '3 (High)' in section


def test_creation_preview_before_selection_and_live_asset_scenario_changes(app):
    app.evaluate("TaraPrefs.setLang('en')")
    setup_assets(app)
    rate(app, 'A01', 'DS3', '3')
    rate(app, 'A02', 'DS3', '1')
    switch_tab(app, 'risk_analysis')
    matrix = get_active_analysis(app)['impactMatrix']
    app.click('#btnOpenAttackTreeModal')
    preview = app.locator('#atDamageScenarioImpactPreview')
    expect(preview.locator('li')).to_have_count(0)
    app.locator('#at_asset').select_option('A01')
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_contain_text('3 (High)')
    expect(preview.locator('[data-editor-impact-ds="DS1"]')).to_contain_text('N/A')
    expect(preview.locator('li.is-linked')).to_have_count(0)
    app.locator('input[name="at_root"]').fill('Draft risk')
    app.click('#btnAddAttackPath')
    app.locator('#attackTreeModal').get_by_role('button', name='Add impact').click()
    expect(app.locator('[data-editor-choice-impact="DS3"]')).to_have_text('3 (High)')
    app.locator('.ds-checks input[data-ds="DS3"]').check()
    expect(preview.locator('li.is-linked')).to_have_count(1)
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_contain_text('Linked to this risk')
    app.locator('#at_asset').select_option('A02')
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_contain_text('1 (Low)')
    expect(app.locator('[data-editor-choice-impact="DS3"]')).to_have_text('1 (Low)')
    expect(app.locator('.ds-checks input[data-ds="DS3"]')).to_be_checked()
    expect(app.locator('input[name="at_root"]')).to_have_value('Draft risk')
    app.locator('.ds-checks input[data-ds="DS3"]').uncheck()
    expect(preview.locator('li.is-linked')).to_have_count(0)
    app.locator('#at_asset').select_option('')
    expect(preview.locator('li')).to_have_count(0)
    expect(app.locator('[data-editor-choice-impact="DS3"]')).to_have_text('—')
    app.click('#closeAttackTreeModal')
    assert get_active_analysis(app)['impactMatrix'] == matrix
    assert get_active_analysis(app)['riskEntries'] == []


def test_edit_and_asset_create_shortcut_show_current_ratings_and_localize(app):
    app.evaluate("TaraPrefs.setLang('en')")
    setup_assets(app)
    rate(app, 'A01', 'DS3', '3')
    switch_tab(app, 'risk_analysis')
    app.locator('[data-asset-create="A01"]').click()
    preview = app.locator('#atDamageScenarioImpactPreview')
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_contain_text('3 (High)')
    app.click('#closeAttackTreeModal')
    entry = create_risk(app, 'A01')
    rate(app, 'A01', 'DS3', '2')
    switch_tab(app, 'risk_analysis')
    app.locator(f'[data-risk-edit="{entry["id"]}"]').click()
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_contain_text('2 (Medium)')
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_contain_text('Linked to this risk')
    expect(app.locator('[data-editor-choice-impact="DS3"]')).to_have_text('2 (Medium)')
    app.evaluate("TaraPrefs.setLang('de')")
    expect(preview).to_contain_text('Auswirkung aus Schadensszenarien')
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_contain_text('Mit diesem Risiko verknüpft')
    expect(app.locator('.ds-checks input[data-ds="DS3"]')).to_be_checked()
    expect(app.locator('[data-editor-choice-impact="DS3"]')).to_have_text('2 (Medium)')
    app.click('#closeAttackTreeModal')

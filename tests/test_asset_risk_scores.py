"""Individual asset scores and editor previews for a shared risk."""
from playwright.sync_api import expect

from conftest import get_active_analysis, switch_tab
from test_asset_risks import setup_assets, rate, create_risk, coverage
from test_shared_risks import assign_existing


def shared_risk(page):
    page.evaluate("TaraPrefs.setLang('en')")
    setup_assets(page)
    rate(page, 'A01', 'DS3', '1')
    rate(page, 'A02', 'DS3', '3')
    risk = create_risk(page, 'A01')
    assign_existing(page, 'A02', risk['id'])
    page.evaluate('''uid => {
      const a = getActiveAnalysis();
      const r = a.riskEntries.find(r => r.uid === uid);
      const path = r.treeV2.children[0];
      Object.assign(path.impacts[0], {k:'0.1',s:'0.5',t:'0.5',u:'0.5'});
      r.treeV2.children.push({...structuredClone(path), uid:'second-path',
        impacts:[{...structuredClone(path.impacts[0]), uid:'second-leaf'}]});
      renderRiskAnalysis();
      saveAnalyses();
    }''', risk['uid'])
    return risk


def test_each_asset_has_its_own_score_and_highest_is_identified(app):
    risk = shared_risk(app)
    low, high = coverage(app, 'A01'), coverage(app, 'A02')
    expect(low.locator('[data-asset-risk-score]')).to_have_text('0.54')
    expect(high.locator('[data-asset-risk-score]')).to_have_text('2.04')
    expect(low.locator('.asset-risk-highest')).to_have_count(0)
    expect(high.locator('.asset-risk-highest')).to_have_count(1)
    comparisons = app.locator('[data-risk-asset-comparison]')
    expect(comparisons.locator('[data-score-asset]').first).to_have_attribute('data-score-asset', 'A02')
    expect(app.locator('#existingRiskEntriesContainer [data-impact-ds]')).to_have_count(0)
    comparisons.locator('[data-risk-view][data-score-asset="A02"]').click()
    expect(app.locator('#at_preview_asset')).to_have_value('A02')
    app.click('#closeAttackTreeModal')
    before = get_active_analysis(app)
    app.evaluate('renderRiskAnalysis()')
    assert get_active_analysis(app)['riskEntries'] == before['riskEntries']
    assert before['riskEntries'][0]['rootRiskValue'] == '2.04'
    app.reload()
    switch_tab(app, 'risk_analysis')
    expect(coverage(app, 'A01').locator('[data-asset-risk-score]')).to_have_text('0.54')
    app.evaluate("TaraPrefs.setLang('de')")
    expect(coverage(app, 'A02').locator('.asset-risk-highest')).to_contain_text('Höchstes')


def test_asset_edit_scopes_ratings_and_preview_without_changing_shared_assignments(app):
    risk = shared_risk(app)
    original = get_active_analysis(app)['riskEntries'][0]
    coverage(app, 'A01').locator('[data-risk-edit]').click()
    expect(app.locator('#at_asset')).to_have_values(['A01', 'A02'])
    expect(app.locator('#at_preview_asset')).to_have_value('A01')
    expect(app.locator('#at_root_kstu_summary')).to_contain_text('0.54')
    preview = app.locator('#atDamageScenarioImpactPreview')
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_have_count(1)
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_contain_text('1 (Low)')
    expect(app.locator('[data-editor-choice-impact="DS3"]').first).to_have_text('1 (Low)')
    app.evaluate('renderCurrentTreePreview()')
    expect(app.locator('#graph-preview-container')).to_contain_text('R = 0,54')
    app.select_option('#at_preview_asset', 'A02')
    expect(app.locator('#graph-preview-container')).to_contain_text('R = 2,04')
    expect(app.locator('#at_root_kstu_summary')).to_contain_text('2.04')
    expect(preview.locator('[data-editor-impact-ds="DS3"]')).to_contain_text('3 (High)')
    app.select_option('#at_preview_asset', 'A01')
    app.locator('#attackTreeForm button[type="submit"]').click()
    saved = get_active_analysis(app)['riskEntries'][0]
    assert saved['assetUids'] == original['assetUids']
    assert saved['rootRiskValue'] == '2.04'
    coverage(app, 'A02').locator('[data-risk-edit]').click()
    expect(app.locator('#at_preview_asset')).to_have_value('A02')
    expect(app.locator('#at_root_kstu_summary')).to_contain_text('2.04')
    # Removing the viewed asset selects the remaining asset for the preview.
    app.locator('#at_asset').select_option('A01')
    expect(app.locator('#at_preview_asset')).to_have_value('A01')
    expect(app.locator('#at_root_kstu_summary')).to_contain_text('0.54')
    app.click('#closeAttackTreeModal')
    assert get_active_analysis(app)['riskEntries'][0]['assetUids'] == original['assetUids']


def test_unassessed_asset_does_not_borrow_the_other_assets_score(app):
    shared_risk(app)
    rate(app, 'A01', 'DS3', 'N/A')
    switch_tab(app, 'risk_analysis')
    expect(coverage(app, 'A01').locator('[data-asset-risk-score]')).to_have_text('—')
    expect(coverage(app, 'A02').locator('[data-asset-risk-score]')).to_have_text('2.04')
    coverage(app, 'A01').locator('[data-risk-edit]').click()
    expect(app.locator('#at_root_kstu_summary .ns-value').first).to_have_text('-')
    expect(app.locator('#atDamageScenarioImpactPreview [data-editor-impact-ds="DS3"]')).to_contain_text('N/A')

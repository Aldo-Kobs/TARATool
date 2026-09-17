"""Residual risks support shared security goals and explicit evaluation tracking."""
import json

import pytest
from playwright.sync_api import expect

from conftest import create_analysis, get_active_analysis, switch_tab
from test_asset_risks import setup_assets, create_risk

pytestmark = pytest.mark.residual_risk


def setup_risks(page, goals=True, assessed=True):
    page.evaluate("TaraPrefs.setLang('en')")
    setup_assets(page)
    first = create_risk(page, 'A01', 'First component risk', assessed=assessed)
    second = create_risk(page, 'A02', 'Second component risk', assessed=assessed)
    if goals:
        switch_tab(page, 'security_goals')
        for name in ['Protect operation', 'Authenticate commands']:
            page.click('#btnAddSecurityGoal')
            page.fill('#sgName', name)
            page.click('#securityGoalForm button[type="submit"]')
    switch_tab(page, 'residual_risk')
    return first, second


def card(page, entry):
    return page.locator(f'.rr-risk-card[data-rr-risk="{entry["uid"]}"]')


def link_goals(page, entry, goal_ids):
    card(page, entry).locator('.rr-edit-btn').click()
    page.locator('.rr-treatment').first.select_option('Mitigiert')
    for goal_id in goal_ids:
        page.locator(f'.rr-goal-checkbox[value="{goal_id}"]').check()
    page.click('#btnCloseResidualRiskModalFooter')


def test_multiple_goals_are_shared_with_security_goals_tab(app):
    first, second = setup_risks(app)
    link_goals(app, first, ['SO01', 'SO02'])
    link_goals(app, second, ['SO01'])
    expect(card(app, first).locator('.rr-goal-summary li')).to_have_count(2)
    switch_tab(app, 'security_goals')
    app.evaluate('editSecurityGoal("SO01")')
    expect(app.locator('#sgRootRefs input:checked')).to_have_count(2)
    app.locator('#sgRootRefs input[value="R01"]').uncheck()
    app.locator('#securityGoalForm button[type="submit"]').click()
    switch_tab(app, 'residual_risk')
    expect(card(app, first).locator('.rr-goal-summary li')).to_have_count(1)
    expect(card(app, first).locator('.rr-goal-summary')).to_contain_text('Authenticate commands')
    card(app, second).locator('.rr-edit-btn').click()
    app.locator('.rr-goal-checkbox[value="SO01"]').uncheck()
    app.click('#btnCloseResidualRiskModalFooter')
    assert get_active_analysis(app)['securityGoals'][0]['rootRefs'] == []
    expect(card(app, second).locator('.rr-goal-summary')).to_contain_text('No security goals linked')


def test_status_survives_sync_reload_and_risk_edits_and_can_be_reopened(app):
    first, second = setup_risks(app)
    expect(app.locator('#rrEvaluationSummary')).to_have_text('0 of 2 risks evaluated')
    card(app, first).locator('.rr-evaluated-checkbox').check()
    expect(app.locator('#rrEvaluationSummary')).to_have_text('1 of 2 risks evaluated')
    expect(card(app, first).locator('.rr-evaluation-status')).to_have_text('Evaluated')
    expect(card(app, second).locator('.rr-evaluation-status')).to_have_text('Not evaluated')
    app.reload()
    switch_tab(app, 'risk_analysis')
    app.evaluate('(id) => editAttackTree(id)', first['id'])
    app.fill('input[name="at_root"]', 'Reviewed component risk')
    app.locator('#attackTreeForm button[type="submit"]').click()
    switch_tab(app, 'residual_risk')
    expect(card(app, first).locator('.rr-evaluated-checkbox')).to_be_checked()
    assert 'evaluated' not in get_active_analysis(app)['riskEntries'][0]
    card(app, first).locator('.rr-evaluated-checkbox').uncheck()
    expect(app.locator('#rrEvaluationSummary')).to_have_text('0 of 2 risks evaluated')


def test_risk_and_goal_deletion_keep_remaining_links_and_status(app):
    first, second = setup_risks(app)
    link_goals(app, second, ['SO02'])
    card(app, second).locator('.rr-evaluated-checkbox').check()
    app.evaluate('removeSecurityGoal("SO01")')
    app.click('#btnConfirmAction')
    app.evaluate('(id) => deleteAttackTree(id)', first['id'])
    app.click('#btnConfirmAction')
    switch_tab(app, 'risk_analysis')
    switch_tab(app, 'residual_risk')
    expect(app.locator('#rrEvaluationSummary')).to_have_text('1 of 1 risks evaluated')
    expect(card(app, second).locator('.rr-goal-summary')).to_contain_text('SO01:')
    expect(card(app, second).locator('.rr-goal-summary')).to_contain_text('Authenticate commands')
    analysis = get_active_analysis(app)
    assert analysis['securityGoals'][0]['rootRefs'] == ['R01']
    assert analysis['residualRisk']['entries'][0]['uid'] == second['uid']


def test_goals_hidden_without_impact_leaves_and_empty_state_is_clear(app):
    first, _ = setup_risks(app, goals=False, assessed=False)
    card(app, first).locator('.rr-edit-btn').click()
    expect(app.locator('.rr-goal-picker')).to_be_hidden()
    expect(app.locator('.rr-treatment')).to_have_count(0)
    app.click('#btnCloseResidualRiskModalFooter')
    switch_tab(app, 'security_goals')
    app.click('#btnAddSecurityGoal')
    app.fill('#sgName', 'Goal for draft risk')
    app.locator('#sgRootRefs input[value="R01"]').check()
    app.locator('#securityGoalForm button[type="submit"]').click()
    switch_tab(app, 'residual_risk')
    expect(card(app, first).locator('.rr-goal-summary')).to_contain_text('Goal for draft risk')
    card(app, first).locator('.rr-edit-btn').click()
    expect(app.locator('.rr-goal-picker')).to_be_hidden()



def test_goals_and_status_survive_versions_copy_export_and_import(app):
    first, _ = setup_risks(app)
    link_goals(app, first, ['SO01', 'SO02'])
    card(app, first).locator('.rr-evaluated-checkbox').check()
    app.evaluate('createNewVersion("Evaluated with goals")')
    original = get_active_analysis(app)
    version = original['metadata']['version']
    card(app, first).locator('.rr-evaluated-checkbox').uncheck()
    app.evaluate('createNewVersion("Reopened")')
    app.evaluate('([id, version]) => revertToVersion(id, version)', [original['id'], version])
    app.click('#btnConfirmAction')
    expect(card(app, first).locator('.rr-evaluated-checkbox')).to_be_checked()
    create_analysis(app, 'Copied residual evaluation', copy_from=original['name'])
    with app.expect_download() as download:
        app.evaluate('exportAnalysis()')
    data = json.loads(download.value.path().read_text())
    app.locator('#importFileInput').set_input_files({'name':'evaluation.json', 'mimeType':'application/json', 'buffer':json.dumps(data).encode()})
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    analysis = get_active_analysis(app)
    assert analysis['residualRisk']['entries'][0]['evaluated'] is True
    assert all(goal['rootRefs'] == ['R01'] for goal in analysis['securityGoals'])


def test_pdf_includes_each_risks_status_and_goals(app):
    import pymupdf
    first, _ = setup_risks(app)
    link_goals(app, first, ['SO01', 'SO02'])
    card(app, first).locator('.rr-edit-btn').click()
    app.locator('.rr-security').fill('Verify update signatures before installation.')
    app.click('#btnCloseResidualRiskModalFooter')
    card(app, first).locator('.rr-evaluated-checkbox').check()
    app.evaluate('''() => {
        const a = getActiveAnalysis();
        a.impactComments = Object.fromEntries(a.assets.map(asset => [asset.id,
            Object.fromEntries(getDisplayDamageScenarios(a).map(ds => [ds.id, {text_en:'Assessment rationale'}]))]));
    }''')
    with app.expect_download() as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        all_text = ' '.join(' '.join(page.get_text().split()) for page in pdf)
        assert 'Detailed Control Measure' in all_text
        assert 'Verify update signatures before installation.' in all_text
        pages = [page.get_text() for page in pdf if '1 of 2 risks evaluated' in page.get_text()]
        assert pages
        text = ' '.join('\n'.join(pages).split())
        for expected in ['R01: First component risk', 'R02: Second component risk', 'Evaluation status',
                         'Evaluated', 'Not evaluated', 'SO01: Protect operation',
                         'SO02: Authenticate commands', 'No security goals linked']:
            assert expected in text


@pytest.mark.parametrize('lang',['en','de'])
def test_goal_picker_is_at_bottom_and_tracks_mitigated_impacts(app,lang):
    first,_=setup_risks(app)
    app.evaluate("""uid=>{
      const a=getActiveAnalysis();
      const impacts=a.riskEntries.find(r=>r.uid===uid).treeV2.children[0].impacts;
      impacts.push({...structuredClone(impacts[0]),uid:generateUID('leaf'),text:'Second impact'});
      saveAnalyses();
      renderResidualRisk(a);
    }""",first['uid'])
    app.evaluate('(lang)=>TaraPrefs.setLang(lang)',lang)
    card(app,first).locator('.rr-edit-btn').click()
    picker=app.locator('#residualRiskModal .rr-goal-picker')
    choices=app.locator('#residualRiskModal .rr-treatment')
    for treatment in ['', 'Akzeptiert', 'Delegiert']:
        choices.nth(0).select_option(treatment)
        expect(picker).to_be_hidden()
    choices.nth(0).select_option('Mitigiert')
    expect(picker).to_be_visible()
    assert picker.evaluate('(el)=>el===el.parentElement.lastElementChild')
    table=app.locator('#residualRiskModal .rr-leaf-table').bounding_box()
    assert picker.bounding_box()['y'] >= table['y']+table['height']
    label='Detailed Control Measure' if lang=='en' else 'Detaillierte Kontrollmaßnahme'
    expect(app.locator('.rr-col-sec')).to_have_text(label)
    expect(app.locator('.rr-security').first).to_have_attribute('placeholder',label+'...')
    app.locator('.rr-security').first.fill('Existing control text')
    picker.locator('input[value="SO01"]').check()
    choices.nth(1).select_option('Mitigiert')
    choices.nth(0).select_option('Akzeptiert')
    expect(picker).to_be_visible()
    choices.nth(1).select_option('Delegiert')
    expect(picker).to_be_hidden()
    assert get_active_analysis(app)['securityGoals'][0]['rootRefs']==['R01']
    app.click('#btnCloseResidualRiskModalFooter')
    app.reload()
    switch_tab(app,'residual_risk')
    card(app,first).locator('.rr-edit-btn').click()
    expect(picker).to_be_hidden()
    choices.nth(0).select_option('Mitigiert')
    expect(picker).to_be_visible()
    expect(picker.locator('input[value="SO01"]')).to_be_checked()
    expect(app.locator('.rr-security').first).to_have_value('Existing control text')
    app.evaluate('(lang)=>TaraPrefs.setLang(lang)','de' if lang=='en' else 'en')
    expect(picker).to_be_visible()
    expect(picker.locator('input[value="SO01"]')).to_be_checked()

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


def test_goals_available_without_impact_leaves_and_empty_state_is_clear(app):
    first, _ = setup_risks(app, goals=False, assessed=False)
    card(app, first).locator('.rr-edit-btn').click()
    expect(app.locator('.rr-goal-picker')).to_contain_text('Create a goal in the Security goals tab first.')
    app.click('#btnCloseResidualRiskModalFooter')
    switch_tab(app, 'security_goals')
    app.click('#btnAddSecurityGoal')
    app.fill('#sgName', 'Goal for draft risk')
    app.locator('#securityGoalForm button[type="submit"]').click()
    switch_tab(app, 'residual_risk')
    link_goals(app, first, ['SO01'])
    expect(card(app, first).locator('.rr-goal-summary')).to_contain_text('Goal for draft risk')


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
    first, _ = setup_risks(app, assessed=False)
    link_goals(app, first, ['SO01', 'SO02'])
    card(app, first).locator('.rr-evaluated-checkbox').check()
    app.evaluate('''() => {
        const a = getActiveAnalysis();
        a.impactComments = Object.fromEntries(a.assets.map(asset => [asset.id,
            Object.fromEntries(getDisplayDamageScenarios(a).map(ds => [ds.id, {text_en:'Assessment rationale'}]))]));
    }''')
    with app.expect_download() as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        pages = [page.get_text() for page in pdf if '1 of 2 risks evaluated' in page.get_text()]
        assert pages
        text = ' '.join('\n'.join(pages).split())
        for expected in ['R01: First component risk', 'R02: Second component risk', 'Evaluation status',
                         'Evaluated', 'Not evaluated', 'SO01: Protect operation',
                         'SO02: Authenticate commands', 'No security goals linked']:
            assert expected in text

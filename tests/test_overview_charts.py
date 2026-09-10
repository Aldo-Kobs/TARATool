"""Dashboard pies reflect assessed attack-tree counts and actual residual risk."""
import json
from pathlib import Path

import pytest
from playwright.sync_api import expect

from conftest import create_analysis, switch_tab

pytestmark = pytest.mark.core
FIXTURE = Path(__file__).parent / 'fixtures' / 'calc_test_fixture.json'


def load_calculation_fixture(page):
    analysis = json.loads(FIXTURE.read_text())
    page.evaluate('''analysis => {
        analysisData.push(analysis);
        migrateAnalysis(analysis);
        renderAnalysisSelector();
        activateAnalysis(analysis.id);
        TaraPrefs.setLang('en');
    }''', analysis)
    return analysis


def legend_values(page, chart):
    return page.locator(f'#{chart} .risk-chart-value').all_text_contents()


def test_pies_match_known_risk_and_residual_distribution(app):
    load_calculation_fixture(app)
    # Independently calculated fixture: R = 3 critical, 2 high, 1 medium;
    # RR = 1 critical, 2 high, 2 medium, 1 low.
    assert legend_values(app, 'unmitigatedRiskChart') == ['3 (50%)', '2 (33.3%)', '1 (16.7%)', '0 (0%)']
    assert legend_values(app, 'residualRiskChart') == ['1 (16.7%)', '2 (33.3%)', '2 (33.3%)', '1 (16.7%)']
    for chart in ['unmitigatedRiskChart', 'residualRiskChart']:
        expect(app.locator(f'#{chart}Summary')).to_have_text('Assessed risks: 6')
        pie = app.locator(f'#{chart} .risk-pie')
        assert 'conic-gradient' in pie.evaluate('el => el.style.background')
        expect(pie).to_have_attribute('role', 'img')
        assert 'Critical:' in pie.get_attribute('aria-label')
    assert '50%' in app.locator('#unmitigatedRiskChart .risk-pie').evaluate('el => el.style.background')
    stats = app.locator('.stats-row').bounding_box()
    charts = app.locator('.overview-risk-charts').bounding_box()
    details = app.locator('.meta-form-grid').bounding_box()
    assert stats['y'] + stats['height'] <= charts['y']
    assert charts['y'] + charts['height'] <= details['y']


def test_empty_single_category_and_unassessed_risks(app):
    app.evaluate('TaraPrefs.setLang("en")')
    for chart in ['unmitigatedRiskChart', 'residualRiskChart']:
        expect(app.locator(f'#{chart} .risk-pie')).to_have_text('No assessed risks')
        assert legend_values(app, chart) == ['0 (0%)'] * 4
        assert 'conic-gradient' not in app.locator(f'#{chart} .risk-pie').evaluate('el => el.style.background')
    load_calculation_fixture(app)
    app.evaluate('''() => {
        const analysis = getActiveAnalysis();
        analysis.riskEntries = [analysis.riskEntries[0]];
        analysis.riskEntries[0].rootRiskValue = '0';
        renderOverview(analysis);
    }''')
    assert legend_values(app, 'unmitigatedRiskChart') == ['0 (0%)', '0 (0%)', '0 (0%)', '1 (100%)']
    gradient = app.locator('#unmitigatedRiskChart .risk-pie').evaluate('el => el.style.background')
    assert '0%' in gradient and '100%' in gradient
    assert 'rgb(39, 174, 96)' in gradient
    app.evaluate('''() => {
        getActiveAnalysis().riskEntries[0].rootRiskValue = null;
        renderOverview(getActiveAnalysis());
    }''')
    expect(app.locator('#unmitigatedRiskChartSummary')).to_have_text('Assessed risks: 0 · Not assessed: 1')
    expect(app.locator('#unmitigatedRiskChart .risk-pie')).to_have_text('No assessed risks')


def test_charts_refresh_on_analysis_tab_and_language_changes(app):
    analysis = load_calculation_fixture(app)
    create_analysis(app, 'Empty chart analysis')
    expect(app.locator('#unmitigatedRiskChart .risk-pie')).to_have_text('No assessed risks')
    app.select_option('#analysisSelector', analysis['id'])
    assert legend_values(app, 'unmitigatedRiskChart')[0] == '3 (50%)'
    switch_tab(app, 'assets')
    app.evaluate('getActiveAnalysis().riskEntries[0].rootRiskValue = "2.4"')
    switch_tab(app, 'overview')
    assert legend_values(app, 'unmitigatedRiskChart')[0] == '4 (66.7%)'
    app.evaluate('TaraPrefs.setLang("de")')
    expect(app.locator('#residualRiskChartTitle')).to_have_text('Restrisiken')
    assert '66,7' in legend_values(app, 'unmitigatedRiskChart')[0]
    assert 'Kritisch:' in app.locator('#unmitigatedRiskChart .risk-pie').get_attribute('aria-label')
    app.set_viewport_size({'width':600, 'height':1000})
    cards = app.locator('.risk-chart-card')
    first, second = [cards.nth(i).bounding_box() for i in range(2)]
    assert first['y'] + first['height'] <= second['y']
    assert second['x'] + second['width'] <= 600

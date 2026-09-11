"""Five asset criteria and categorical types persist and drive protection need."""
import json
from pathlib import Path

import pytest
from playwright.sync_api import expect

from conftest import add_asset, get_active_analysis, switch_tab

pytestmark = pytest.mark.assets


@pytest.mark.parametrize('criterion', ['authorization', 'authentication'])
def test_new_criteria_drive_protection_and_persist(app, criterion):
    add_asset(app, {'name':'Evaluated asset', 'type':'Data', criterion:'III'})
    asset = get_active_analysis(app)['assets'][0]
    assert asset[criterion] == 'III'
    assert asset['schutzbedarf'] == 'III'
    assert asset['authenticity'] == 'I'
    assert asset['type'] == 'Data'
    app.reload()
    app.evaluate('editAsset("A01")')
    expect(app.locator(f'input[name="{criterion}"][value="III"]')).to_be_checked()
    expect(app.locator('#assetType')).to_have_value('Data')
    app.check(f'input[name="{criterion}"][value="II"]')
    app.click('#assetForm button[type="submit"]')
    assert get_active_analysis(app)['assets'][0]['schutzbedarf'] == 'II'
    with app.expect_download() as downloaded:
        app.evaluate('exportAnalysis()')
    exported = json.loads(downloaded.value.path().read_text())
    assert exported['assets'][0][criterion] == 'II'
    app.locator('#importFileInput').set_input_files({
        'name':'assets.json', 'mimeType':'application/json',
        'buffer':json.dumps(exported).encode(),
    })
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    assert get_active_analysis(app)['assets'][0][criterion] == 'II'


@pytest.mark.parametrize('asset_type', ['Component', 'Data', 'Function'])
def test_types_are_shared_across_languages(app, asset_type):
    app.evaluate('TaraPrefs.setLang("en")')
    add_asset(app, {'name':'Type test', 'type':asset_type, 'authorization':'II', 'authentication':'III'})
    assert get_active_analysis(app)['assets'][0]['type'] == asset_type
    assert 'type_en' not in get_active_analysis(app)['assets'][0]
    app.evaluate('editAsset("A01")')
    assert app.locator('#assetType option').evaluate_all('(els) => els.map(el => el.value)') == ['Component','Data','Function']
    app.select_option('#assetType','Function')
    app.check('input[name="authorization"][value="III"]')
    app.evaluate('TaraPrefs.setLang("de")')
    expect(app.locator('#assetType')).to_have_value('Function')
    expect(app.locator('input[name="authorization"][value="III"]')).to_be_checked()
    expect(app.locator('input[name="authentication"][value="III"]')).to_be_checked()
    app.evaluate('TaraPrefs.setLang("en")')
    expect(app.locator('#assetType option:checked')).to_have_text('Function')


def test_legacy_type_and_availability_are_preserved(app):
    app.evaluate('''() => {
        const analysis = getActiveAnalysis();
        analysis.assets = [{ id:'A01', name:'Legacy', type:'Custom hardware',
            confidentiality:'I', integrity:'II', authenticity:'III', schutzbedarf:'III' }];
        renderAssets(analysis);
        editAsset('A01');
    }''')
    expect(app.locator('#assetType')).to_have_value('')
    expect(app.locator('#assetType option:checked')).to_contain_text('Custom hardware')
    expect(app.locator('input[name="authenticity"][value="III"]')).to_be_checked()
    assert app.locator('input[name="authentication"]:checked').count() == 0
    assert app.locator('input[name="authorization"]:checked').count() == 0
    app.click('#assetForm button[type="submit"]')
    expect(app.locator('#assetModal')).to_be_visible()
    assert get_active_analysis(app)['assets'][0]['type'] == 'Custom hardware'
    app.select_option('#assetType', 'Component')
    app.click('#assetForm button[type="submit"]')
    asset = get_active_analysis(app)['assets'][0]
    assert asset['type'] == 'Component'
    assert asset['authenticity'] == 'III'
    assert asset['authentication'] == asset['authorization'] == '-'
    assert asset['schutzbedarf'] == 'III'


def test_protection_changes_recalculate_existing_risks(app):
    fixture = json.loads((Path(__file__).parent / 'fixtures' / 'calc_test_fixture.json').read_text())
    app.evaluate('''analysis => {
        analysisData.push(analysis); migrateAnalysis(analysis); activateAnalysis(analysis.id);
        editAsset('A01');
    }''',fixture)
    app.select_option('#assetType', 'Component')
    for criterion in ['confidentiality','integrity','authenticity','authorization','authentication']:
        app.check(f'input[name="{criterion}"][value="I"]')
    app.click('#assetForm button[type="submit"]')
    low_risk = float(get_active_analysis(app)['riskEntries'][0]['rootRiskValue'])
    app.evaluate('editAsset("A01")')
    app.check('input[name="authorization"][value="III"]')
    app.click('#assetForm button[type="submit"]')
    restored_risk = float(get_active_analysis(app)['riskEntries'][0]['rootRiskValue'])
    assert restored_risk == pytest.approx(1.5)
    assert restored_risk > low_risk
    app.reload()
    app.evaluate('id => activateAnalysis(id)', fixture['id'])
    assert float(get_active_analysis(app)['riskEntries'][0]['rootRiskValue']) == restored_risk


def test_pdf_includes_authorization_and_authentication(app):
    add_asset(app, {'name':'Report asset','type':'Function','authorization':'II','authentication':'III'})
    app.evaluate('''() => {
        const original = ReportPdfBuilder.pdfBuilder;
        window.capturedAssetTable = null;
        ReportPdfBuilder.pdfBuilder = doc => {
            const builder = original(doc);
            const addTable = builder.addTable;
            builder.addTable = (headers, rows, widths) => {
                if (headers.includes('Authz')) window.capturedAssetTable = {headers, rows};
                return addTable(headers, rows, widths);
            };
            return builder;
        };
    }''')
    with app.expect_download(timeout=15000) as download:
        app.evaluate('generateReportPdf()')
    assert download.value.suggested_filename.endswith('.pdf')
    table = app.evaluate('window.capturedAssetTable')
    assert table['rows'][0][6:8] == ['II', 'III']
    assert table['headers'][6:8] == ['Authz', 'Authn']


@pytest.mark.parametrize('authorization, authentication, expected', [
    ('N/A', 'N/A', 'I'),
    ('N/A', 'III', 'III'),
    ('III', 'N/A', 'III'),
])
def test_not_applicable_is_saved_and_excluded_from_protection(app, authorization, authentication, expected):
    add_asset(app, {'name':'Optional criteria', 'authorization':authorization, 'authentication':authentication})
    asset = get_active_analysis(app)['assets'][0]
    assert asset['authorization'] == authorization
    assert asset['authentication'] == authentication
    assert asset['schutzbedarf'] == expected
    assert app.locator('input[name="confidentiality"][value="N/A"]').count() == 0
    app.reload()
    app.evaluate('editAsset("A01")')
    expect(app.locator(f'input[name="authorization"][value="{authorization}"]')).to_be_checked()
    expect(app.locator(f'input[name="authentication"][value="{authentication}"]')).to_be_checked()
    app.evaluate('TaraPrefs.setLang("en")')
    expect(app.locator('input[name="authorization"][value="N/A"]').locator('..')).to_contain_text('Not applicable')
    assert get_active_analysis(app)['assets'][0]['schutzbedarf'] == expected

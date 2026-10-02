"""Path OR scores stay consistent through editor saves, matrix changes and reload."""
from playwright.sync_api import expect

from conftest import add_asset, get_active_analysis, switch_tab
from test_asset_risks import rate


def test_path_or_live_preview_save_matrix_change_and_reload(app):
    add_asset(app, {'name': 'Component', 'type': 'Component', 'description': '',
                    'confidentiality': 'III', 'integrity': 'III', 'availability': 'III',
                    'authorization': 'III', 'authentication': 'III'})
    rate(app, 'A01', 'DS1', '2')
    rate(app, 'A01', 'DS2', '3')
    switch_tab(app, 'risk_analysis')
    app.locator('[data-asset-create="A01"]').click()
    app.fill('input[name="at_root"]', 'Independent alternatives')
    app.evaluate("""() => {
        const leaf = (ds, values) => ({uid:generateUID('leaf'),text:ds,ds:[ds],stride:[],
            ...Object.fromEntries(['k','s','t','u'].map((key,i) => [key, values[i]]))});
        atV2.root.children = [
            {uid:'path1',title:'First path',children:[],impacts:[leaf('DS1',['0.7','0.1','0.1','0.1'])]},
            {uid:'path2',title:'Second path',children:[],impacts:[leaf('DS2',['0.1','0.5','0.5','0.5'])]}
        ];
        atV2.rerender();
    }""")
    expect(app.locator('#at_root_kstu_summary')).to_contain_text('1.76')
    expect(app.locator('#atv2_node_summary_path1')).to_contain_text('0.60')
    expect(app.locator('#atv2_node_summary_path2')).to_contain_text('1.60')
    app.locator('#attackTreeForm button[type="submit"]').click()
    assert get_active_analysis(app)['riskEntries'][0]['rootRiskValue'] == '1.76'
    expect(app.locator('.root-overview-risk')).to_contain_text('1,76')
    app.reload()
    switch_tab(app, 'risk_analysis')
    expect(app.locator('.root-overview-risk')).to_contain_text('1,76')
    rate(app, 'A01', 'DS1', '1')
    # Path scores .30 and 1.60 now combine to 1.681818...
    assert get_active_analysis(app)['riskEntries'][0]['rootRiskValue'] == '1.68'
    app.reload()
    assert get_active_analysis(app)['riskEntries'][0]['rootRiskValue'] == '1.68'

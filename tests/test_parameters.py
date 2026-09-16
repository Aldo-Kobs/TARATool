"""Parameters guide mirrors live choices and remains a read-only final tab."""
import pytest
from playwright.sync_api import expect
from conftest import create_analysis, get_active_analysis, switch_tab

pytestmark = pytest.mark.core


def entry(page, key):
    return page.locator(f'[data-parameter-id="{key}"]')


def open_parameters(page):
    page.evaluate("TaraPrefs.setLang('en')")
    switch_tab(page, 'parameters')


def test_final_tab_covers_only_inputs_grouped_by_tab_and_window(app):
    open_parameters(app)
    expect(app.locator('.tab-navigation .tab-button').last).to_have_attribute('data-tab','tabParameters')
    expect(app.locator('[data-parameter-id]')).to_have_count(50)
    expect(app.locator('#parameterCount')).to_have_text('50 parameters shown')
    assert app.locator('[data-parameter-section]').evaluate_all('(nodes) => nodes.map(n => n.dataset.parameterSection)') == ['assets','damage','damage-matrix','damage-comment','risk','risk-node-notes','risk-notes','lifecycle','goals','residual','residual-review','security-targets','security-matrix']
    for field in ['asset-confidentiality','asset-integrity','asset-availability','asset-authorization','asset-authentication','damage-comment','risk-asset','risk-root','risk-path','risk-impact','risk-scenarios','risk-notes','risk-node-notes','lifecycle-phases','lifecycle-custom','lifecycle-notes','goal-name','goal-description','goal-risks','residual-goals','residual-treatment','residual-note','residual-measure','residual-risk-note','residual-evaluated','sl-matrix']:
        expect(entry(app,field)).to_be_attached()
    for factor in 'KSTU':
        expect(entry(app,'risk-'+factor)).to_be_attached()
        expect(entry(app,'residual-'+factor)).to_be_attached()
    for number in range(1,8):
        expect(entry(app,f'sl-FR{number}')).to_be_attached()
    expect(entry(app,'damage-comment')).to_contain_text('including N/A')
    expect(entry(app,'residual-evaluated')).to_contain_text('manual review status')
    assert app.evaluate("PARAMETER_GUIDE.sections.flatMap(s=>s.fields).every(f=>!['reference','calculated'].includes(f.kind))")
    expect(app.locator('[data-parameter-id^="calculated-"]')).to_have_count(0)
    expect(entry(app,'scenario-catalogue')).to_have_count(0)
    expect(entry(app,'damage-comment').locator('xpath=ancestor::section')).to_have_attribute('data-parameter-section','damage-comment')
    expect(entry(app,'residual-evaluated').locator('xpath=ancestor::section')).to_have_attribute('data-parameter-section','residual-review')
    expect(app.locator('.parameter-customization')).to_contain_text('python3 scripts/sync_assessment_config.py')
    assert 'STRIDE' not in app.locator('#parametersContainer').inner_text()


def test_values_match_active_configuration_and_refresh_after_company_changes(app):
    open_parameters(app)
    for factor in 'KSTU':
        values=app.evaluate('(key) => PROBABILITY_CRITERIA[key].options',factor)
        for option in values:
            expect(entry(app,'risk-'+factor)).to_contain_text(option['text_en'])
            expect(entry(app,'residual-'+factor)).to_contain_text(option['text_en'])
    app.evaluate('''() => {
      const config=structuredClone(ASSESSMENT_CONFIG);
      config.probabilityCriteria.K.options[0]={value:'0.9',text:'Unternehmensspezifisches Wissen',text_en:'Company-specific knowledge'};
      config.impactScale.labels['2']='Company medium';
      config.defaultDamageScenarios[2].description_en='Company-specific outage criteria';
      reloadAssessmentConfigFromObject(config, 'test company');
    }''')
    expect(entry(app,'risk-K')).to_contain_text('0.9: Company-specific knowledge')
    expect(entry(app,'residual-K')).to_contain_text('0.9: Company-specific knowledge')
    expect(entry(app,'damage-rating')).to_contain_text('2 — Company medium')
    expect(entry(app,'risk-scenarios')).to_contain_text('Company-specific outage criteria')


def test_search_and_german_guide(app):
    open_parameters(app)
    app.locator('#parameterSearch').fill('cryptographic')
    expect(entry(app,'asset-type')).to_be_visible()
    expect(app.locator('[data-parameter-section="residual"]')).to_be_hidden()
    app.locator('#parameterSearch').fill('no-such-parameter-92834')
    expect(app.locator('#parameterNoResults')).to_be_visible()
    expect(app.locator('#parameterCount')).to_have_text('0 parameters shown')
    app.locator('#parameterSearch').fill('')
    expect(app.locator('#parameterCount')).to_have_text('50 parameters shown')
    app.locator('#parameterSearch').fill('cell comment')
    expect(entry(app,'damage-comment')).to_be_visible()
    expect(app.locator('[data-parameter-id]:visible')).to_have_count(1)
    app.evaluate("TaraPrefs.setLang('de')")
    expect(app.locator('#parameterCount')).to_have_text('50 Parameter angezeigt')
    expect(entry(app,'asset-authorization')).to_contain_text('Autorisierung')
    expect(entry(app,'residual-treatment')).to_contain_text('Delegiert')
    expect(entry(app,'risk-K')).to_contain_text('Bekannte Schwachstellen')
    expect(entry(app,'sl-FR7')).to_contain_text('Verfügbarkeit der Ressourcen')


def test_reference_uses_current_analysis_settings_without_mutating_data(app):
    open_parameters(app)
    original=get_active_analysis(app)
    app.evaluate('''() => {
      const a=getActiveAnalysis();
      a.securityLevelSettings={schemaVersion:2, targets:{FR1:3},feasibilityBounds:[0.5,1,1.5],impactBounds:[0.2,0.4,0.7],matrix:Array.from({length:4},()=>[1,2,3,4])};
      saveAnalyses();
    }''')
    before=get_active_analysis(app)
    app.evaluate('renderParameters(getActiveAnalysis())')
    expect(entry(app,'sl-FR1')).to_contain_text('0–4')
    expect(entry(app,'sl-impact')).to_contain_text('0.4 < x <= 0.7')
    app.locator('#parameterSearch').fill('SL-T')
    assert get_active_analysis(app)==before
    create_analysis(app,'Another parameter scope')
    switch_tab(app,'parameters')
    expect(entry(app,'sl-FR1')).to_contain_text('Not set')
    expect(entry(app,'sl-impact')).to_contain_text('0.6 < x <= 0.8')
    app.evaluate('(id) => activateAnalysis(id)',original['id'])
    expect(entry(app,'sl-impact')).to_contain_text('0.4 < x <= 0.7')


def test_editorial_text_customization_is_plain_text_and_not_a_score_setting(app):
    open_parameters(app)
    before=app.evaluate('JSON.stringify(ASSESSMENT_CONFIG)')
    app.evaluate('''() => {
      const field=PARAMETER_GUIDE.sections[0].fields.find(f=>f.id==='asset-type');
      field.example.en='Company example <img src=x onerror="window.guideInjected=true">';
      renderParameters(getActiveAnalysis());
    }''')
    expect(entry(app,'asset-type')).to_contain_text('Company example <img')
    expect(entry(app,'asset-type').locator('img')).to_have_count(0)
    assert not app.evaluate('window.guideInjected===true')
    assert app.evaluate('JSON.stringify(ASSESSMENT_CONFIG)')==before


def test_proposed_level_guidance_is_specific_editable_and_translated(app):
    open_parameters(app)
    for criterion in ['confidentiality','integrity','availability','authentication','authorization']:
        row=entry(app,'asset-'+criterion)
        expect(row.locator('.parameter-interpretations > li > strong')).to_have_text(['I','II','III'])
        expect(row.locator('.parameter-interpretations > li p')).to_have_count(3)
        assert all(len(text)>40 for text in row.locator('.parameter-interpretations > li').all_text_contents())
    expect(entry(app,'asset-authentication')).to_contain_text('Who is this?')
    expect(entry(app,'asset-authorization')).to_contain_text('What may this identity do?')
    expect(entry(app,'asset-confidentiality')).to_contain_text('firmware-signing key')
    impact=entry(app,'damage-rating')
    expect(impact.locator('.parameter-interpretations > li')).to_have_count(4)
    expect(impact).to_contain_text('not how likely an attack is')
    expect(impact).to_contain_text('Do not use it for low impact or uncertainty')
    expect(impact).to_contain_text('maximum tolerable outage')
    before=app.evaluate('JSON.stringify(ASSESSMENT_CONFIG)')
    app.evaluate("""() => {
      const field=PARAMETER_GUIDE.sections[0].fields.find(f=>f.id==='asset-integrity');
      field.interpretations[1].meaning.en='Company decision: <img src=x onerror="window.guideInjected=true">';
      renderParameters(getActiveAnalysis());
    }""")
    expect(entry(app,'asset-integrity')).to_contain_text('Company decision: <img')
    expect(entry(app,'asset-integrity').locator('img')).to_have_count(0)
    assert app.evaluate('JSON.stringify(ASSESSMENT_CONFIG)')==before
    app.evaluate("TaraPrefs.setLang('de')")
    expect(entry(app,'asset-authentication')).to_contain_text('Wer ist das?')
    expect(entry(app,'asset-authorization')).to_contain_text('Was darf diese Identität tun?')
    expect(entry(app,'asset-integrity')).to_contain_text('Produktionsrezeptur')
    expect(entry(app,'damage-rating')).to_contain_text('maximal tolerierbare Ausfallzeit')

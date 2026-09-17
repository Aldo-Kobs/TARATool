"""Requirement references are optional, per impact, persistent and exported."""
import json
import re
import pytest
from playwright.sync_api import expect
from conftest import get_active_analysis,switch_tab
from test_residual_notes import prepare,open_editor,close_editor

pytestmark=pytest.mark.residual_risk


@pytest.mark.parametrize('lang',['en','de'])
def test_requirement_link_layout_persistence_languages_and_pdf(app,lang):
    import pymupdf
    uid,other=prepare(app)
    app.evaluate('(lang)=>TaraPrefs.setLang(lang)',lang)
    modal=open_editor(app,uid)
    fields=modal.locator('.rr-requirement-link')
    expect(fields).to_have_count(2)
    expect(fields.first).to_be_disabled()
    row=modal.locator('.rr-leaf-row').first
    row.locator('.rr-treatment').select_option('Mitigiert')
    label='Link to requirement' if lang=='en' else 'Link zur Anforderung'
    expect(fields.first).to_have_accessible_name(label)
    expect(fields.first).to_have_attribute('type','text')
    expect(fields.first).to_be_enabled()
    assert fields.first.bounding_box()['y'] >= row.locator('.rr-security').bounding_box()['y']+row.locator('.rr-security').bounding_box()['height']
    row.locator('.rr-security').fill('Verify signatures before installation')
    for select in row.locator('.rr-kstu').all():
        select.select_option('0.1')
    # The link remains optional for a completed mitigation.
    expect(row.locator('.rr-leaf-check')).not_to_have_class(re.compile('incomplete'))
    url='https://requirements.example.com/REQ-SEC-012'
    fields.first.fill(url)
    modal.locator('.rr-treatment').nth(1).select_option('Mitigiert')
    fields.nth(1).fill('REQ-SEC-099')
    row.locator('.rr-treatment').select_option('Akzeptiert')
    expect(fields.first).to_be_disabled()
    expect(fields.first).to_have_value(url)
    row.locator('.rr-treatment').select_option('Mitigiert')
    close_editor(app)
    app.reload()
    switch_tab(app,'residual_risk')
    modal=open_editor(app,uid)
    expect(fields.first).to_have_value(url)
    expect(fields.nth(1)).to_have_value('REQ-SEC-099')
    app.evaluate('(lang)=>TaraPrefs.setLang(lang)','de' if lang=='en' else 'en')
    expect(fields.first).to_have_value(url)
    app.evaluate('(lang)=>TaraPrefs.setLang(lang)',lang)
    close_editor(app)
    other_modal=open_editor(app,other)
    expect(other_modal.locator('.rr-requirement-link')).to_have_value('')
    close_editor(app)
    app.evaluate("""()=>{
      const a=getActiveAnalysis();
      a.impactComments=Object.fromEntries(a.assets.map(asset=>[asset.id,
        Object.fromEntries(getDisplayDamageScenarios(a).map(ds=>[ds.id,{text:'Begruendung',text_en:'Justification'}]))]));
    }""")
    with app.expect_download(timeout=60000) as downloaded:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(downloaded.value.path()) as pdf:
        text=' '.join(' '.join(p.get_text().split()) for p in pdf)
        assert label in text
        assert url in text
        assert 'REQ-SEC-099' in text
    modal=open_editor(app,uid)
    fields.first.fill('')
    close_editor(app)
    app.reload()
    switch_tab(app,'residual_risk')
    open_editor(app,uid)
    expect(fields.first).to_have_value('')
    expect(fields.nth(1)).to_have_value('REQ-SEC-099')


def test_requirement_link_survives_versions_export_import_and_legacy_sync(app):
    uid,_=prepare(app)
    modal=open_editor(app,uid)
    modal.locator('.rr-treatment').first.select_option('Mitigiert')
    reference='REQ-012 "test" <img src=x onerror=alert(1)>'
    modal.locator('.rr-requirement-link').first.fill(reference)
    close_editor(app)
    app.evaluate('createNewVersion("Requirement linked")')
    saved=get_active_analysis(app)
    open_editor(app,uid).locator('.rr-requirement-link').first.fill('Changed')
    close_editor(app)
    app.evaluate('createNewVersion("Changed reference")')
    app.evaluate('([id,version])=>revertToVersion(id,version)',[saved['id'],saved['metadata']['version']])
    app.click('#btnConfirmAction')
    modal=open_editor(app,uid)
    expect(modal.locator('.rr-requirement-link').first).to_have_value(reference)
    expect(modal.locator('.rr-col-sec img')).to_have_count(0)
    close_editor(app)
    with app.expect_download() as downloaded:
        app.locator('#btnExportAnalysis').click()
    exported=json.loads(downloaded.value.path().read_text())
    app.evaluate('''data=>{
      // Legacy-only data must retain the requirement reference too.
      data.residualRisk.entries=[];
      migrateAnalysis(data);
      window.restoredRequirementData=data;
    }''',exported)
    restored=app.evaluate('(uid)=>restoredRequirementData.residualRisk.entries.find(e=>e.uid===uid)',uid)
    assert restored['treeV2']['children'][0]['impacts'][0]['rr']['requirementLink']==reference

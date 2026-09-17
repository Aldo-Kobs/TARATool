"""One Notes value per residual risk, shared by the original editor and overview."""
import json
import re

import pytest
from playwright.sync_api import expect
from conftest import get_active_analysis, switch_tab
from test_asset_risks import setup_assets, create_risk, rate

pytestmark = pytest.mark.residual_risk


@pytest.fixture(autouse=True)
def no_page_errors(app):
    errors=[]
    app.on('pageerror',lambda error:errors.append(str(error)))
    yield
    assert not errors


def prepare(page, high=False):
    page.evaluate("TaraPrefs.setLang('en')")
    setup_assets(page)
    rate(page,'A02','DS3','3')
    first=create_risk(page,'A02','First risk')
    second=create_risk(page,'A02','Other risk')
    page.evaluate('''({uid,high})=>{
      const a=getActiveAnalysis();
      const first=a.riskEntries.find(e=>e.uid===uid);
      const leaves=first.treeV2.children[0].impacts;
      if(high) Object.assign(leaves[0],{k:'0.7',s:'0.5',t:'0.5',u:'0.5'});
      leaves.push({...structuredClone(leaves[0]),uid:generateUID('leaf'),text:'Loss of diagnostics'});
      syncAssetRisks(a);
      ensureResidualRiskSynced(a);
      a.residualRisk.entries.forEach(entry=>{
        let i=0;
        rrIterateLeaves(entry,({leaf})=>{
          leaf.rr={treatment:'Akzeptiert',note:'Bestehende Notiz '+(++i),note_en:'Existing note '+i};
        });
        // Reproduce a saved analysis from before the shared-note migration.
        a.residualRisk.treeNotes[entry.uid]={text:'Gesamtprüfung',text_en:'Overall review'};
      });
      saveAnalyses();
    }''',{'uid':first['uid'],'high':high})
    switch_tab(page,'residual_risk')
    return first['uid'],second['uid']


def card(page,uid):
    return page.locator(f'.rr-risk-card[data-rr-risk="{uid}"]')


def overview_note(page,uid):
    return card(page,uid).locator('.rr-tree-note')


def open_editor(page,uid):
    page.locator(f'[data-rr-edit="{uid}"]').click()
    return page.locator('#residualRiskModal')


def close_editor(page):
    page.locator('#btnCloseResidualRiskModalFooter').click()


@pytest.mark.parametrize('lang',['en','de'])
def test_original_fields_share_one_value_in_both_directions(app,lang):
    uid,other=prepare(app)
    app.evaluate('(lang)=>TaraPrefs.setLang(lang)',lang)
    prefix='Overall review' if lang=='en' else 'Gesamtprüfung'
    leaf='Existing note ' if lang=='en' else 'Bestehende Notiz '
    original=prefix+'\n\n'+leaf+'1\n\n'+leaf+'2'
    expect(overview_note(app,uid)).to_have_value(original)
    expect(card(app,uid).locator('textarea')).to_have_count(1)
    expect(app.locator('.rr-impact-notes,.rr-overall-note-label')).to_have_count(0)
    modal=open_editor(app,uid)
    expect(modal.locator('.rr-leaf-row')).to_have_count(2)
    expect(modal.locator('.rr-note')).to_have_count(1)
    expect(modal.locator('.rr-tree-note')).to_have_count(0)
    expect(modal.locator('.rr-note')).to_have_value(original)
    modal.locator('.rr-note').fill('Shared decision <b>plain text</b>')
    expect(overview_note(app,uid)).to_have_value('Shared decision <b>plain text</b>')
    expect(overview_note(app,other)).to_have_value(prefix+'\n\n'+leaf+'1')
    close_editor(app)
    overview_note(app,uid).fill('Changed in overview')
    modal=open_editor(app,uid)
    expect(modal.locator('.rr-note')).to_have_value('Changed in overview')
    close_editor(app)
    field='note_en' if lang=='en' else 'note'
    data=get_active_analysis(app)['residualRisk']
    entry=next(e for e in data['entries'] if e['uid']==uid)
    assert all(l['rr'][field]=='Changed in overview' for l in entry['treeV2']['children'][0]['impacts'])
    assert all(v[field]=='Changed in overview' for k,v in data['leaves'].items() if k.startswith(uid+'|'))
    overview_note(app,uid).fill('')
    app.reload()
    switch_tab(app,'residual_risk')
    expect(overview_note(app,uid)).to_have_value('')
    modal=open_editor(app,uid)
    expect(modal.locator('.rr-note')).to_have_value('')
    close_editor(app)
    app.evaluate('(lang)=>TaraPrefs.setLang(lang)','de' if lang=='en' else 'en')
    expect(overview_note(app,uid)).to_have_value('Gesamtprüfung\n\nBestehende Notiz 1\n\nBestehende Notiz 2' if lang=='en' else 'Overall review\n\nExisting note 1\n\nExisting note 2')


def test_migration_merges_existing_text_once_and_deduplicates(app):
    uid,_=prepare(app)
    app.evaluate('''uid=>{
      const a=getActiveAnalysis();
      const entry=a.residualRisk.entries.find(e=>e.uid===uid);
      a.residualRisk.treeNotes[uid]='Existing overview';
      rrIterateLeaves(entry,({leaf})=>{leaf.rr.note='Existing editor';leaf.rr.note_en='English editor';});
      renderResidualRisk(a);
      ensureResidualRiskSynced(a);
      ensureResidualRiskSynced(a);
      saveAnalyses();
    }''',uid)
    app.evaluate("TaraPrefs.setLang('de')")
    expect(overview_note(app,uid)).to_have_value('Existing overview\n\nExisting editor')
    app.reload()
    switch_tab(app,'residual_risk')
    expect(overview_note(app,uid)).to_have_value('Existing overview\n\nExisting editor')
    app.evaluate("TaraPrefs.setLang('en')")
    expect(overview_note(app,uid)).to_have_value('English editor')
    with app.expect_download() as downloaded:
        app.locator('#btnExportAnalysis').click()
    exported=json.loads(downloaded.value.path().read_text())
    assert exported['residualRisk']['treeNotes'][uid]=={'text':'Existing overview\n\nExisting editor','text_en':'English editor','scope':'risk'}
    app.evaluate('''data=>{migrateAnalysis(data);window.importedNotes=data.residualRisk.treeNotes;}''',exported)
    assert app.evaluate('(uid)=>importedNotes[uid]',uid)==exported['residualRisk']['treeNotes'][uid]


def test_shared_note_updates_required_completion_without_changing_scores(app):
    uid,_=prepare(app,high=True)
    app.evaluate("TaraPrefs.setLang('de')")
    before=app.evaluate('(uid)=>computeResidualTreeMetrics(getActiveAnalysis(),uid)',uid)
    overview_note(app,uid).fill('')
    expect(card(app,uid).locator('.rr-tree-check')).to_have_class(re.compile('incomplete'))
    modal=open_editor(app,uid)
    modal.locator('.rr-note').fill('Shared acceptance and review rationale')
    expect(card(app,uid).locator('.rr-tree-check')).not_to_have_class(re.compile('incomplete'))
    for row in modal.locator('.rr-leaf-row').all():
        expect(row.locator('.rr-leaf-check')).not_to_have_class(re.compile('incomplete'))
    close_editor(app)
    assert app.evaluate('(uid)=>computeResidualTreeMetrics(getActiveAnalysis(),uid)',uid)==before


def test_note_remains_available_when_risk_has_no_impacts(app):
    uid,_=prepare(app)
    app.evaluate('''uid=>{
      const a=getActiveAnalysis();a.riskEntries.find(e=>e.uid===uid).treeV2.children=[];
      renderResidualRisk(a);
    }''',uid)
    modal=open_editor(app,uid)
    expect(modal.locator('.rr-note')).to_have_count(1)
    modal.locator('.rr-note').fill('Risk being scoped')
    close_editor(app)
    expect(overview_note(app,uid)).to_have_value('Risk being scoped')


@pytest.mark.parametrize('lang',['en','de'])
def test_pdf_uses_shared_notes_in_report_language(app,lang):
    import pymupdf
    uid,_=prepare(app)
    app.evaluate('(lang)=>TaraPrefs.setLang(lang)',lang)
    expected='Shared decision from overview' if lang=='en' else 'Gemeinsame Entscheidung aus der Uebersicht'
    overview_note(app,uid).fill(expected)
    app.evaluate("""()=>{
      const a=getActiveAnalysis();
      a.impactComments=Object.fromEntries(a.assets.map(asset=>[asset.id,
        Object.fromEntries(getDisplayDamageScenarios(a).map(ds=>[ds.id,{text:'Begruendung',text_en:'Justification'}]))]));
    }""")
    with app.expect_download(timeout=60000) as downloaded:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(downloaded.value.path()) as pdf:
        text=' '.join(' '.join(page.get_text().split()) for page in pdf)
        assert expected in text

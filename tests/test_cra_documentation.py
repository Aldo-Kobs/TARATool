"""CRA Annex V/VII documentation review, evidence persistence and PDF exclusion."""
import json

import pytest
from playwright.sync_api import expect

from conftest import create_analysis, get_active_analysis, switch_tab

pytestmark = pytest.mark.core


def open_checklist(page):
    page.evaluate("TaraPrefs.setLang('en')")
    switch_tab(page, 'cra_documentation')


def row(page, clause):
    return page.locator(f'[data-cra-item="{clause}"]')


def saved(page):
    return get_active_analysis(page)['craDocumentationChecklist']['items']


def test_covers_all_annex_points_with_independent_review_and_evidence(app):
    open_checklist(app)
    expect(app.locator('[data-cra-annex="V"] [data-cra-item]')).to_have_count(8)
    expect(app.locator('[data-cra-annex="VII"] [data-cra-item]')).to_have_count(15)
    expected = [f'V-{i}' for i in range(1, 9)] + [f'VII-{i}' for i in range(1, 9)] + ['VII-1-a','VII-1-b','VII-1-c','VII-1-d','VII-2-a','VII-2-b','VII-2-c']
    assert sorted(app.locator('[data-cra-item]').evaluate_all('(rows) => rows.map(r => r.dataset.craItem)')) == sorted(expected)
    expect(row(app, 'V-7')).to_contain_text('where applicable')
    expect(row(app, 'V-8')).to_contain_text('signature')
    expect(row(app, 'VII-2-b')).to_contain_text('coordinated vulnerability disclosure')
    expect(row(app, 'VII-2-b')).to_contain_text('SBOM')
    expect(row(app, 'VII-5')).to_contain_text('parts applied only partially')
    expect(row(app, 'VII-8')).to_contain_text('reasoned request')
    expect(app.locator('#craChecklistProgress')).to_have_text('0 of 23 items checked')
    first = row(app, 'V-1')
    first.locator('.cra-check').check()
    first.locator('.cra-comment').fill('Product specification reviewed, revision 3.')
    first.locator('.cra-link').fill('https://example.com/specification?revision=3&lang=en')
    expect(first.locator('.cra-open-link')).to_have_attribute('href', 'https://example.com/specification?revision=3&lang=en')
    expect(app.locator('#craChecklistProgress')).to_have_text('1 of 23 items checked')
    expect(app.locator('[data-cra-progress="V"]')).to_have_text('1 of 8 items checked')
    expect(app.locator('[data-cra-progress="VII"]')).to_have_text('0 of 15 items checked')
    app.reload()
    switch_tab(app, 'cra_documentation')
    expect(first.locator('.cra-check')).to_be_checked()
    expect(first.locator('.cra-comment')).to_have_value('Product specification reviewed, revision 3.')
    first.locator('.cra-check').uncheck()
    assert saved(app)['V-1']['checked'] is False
    assert saved(app)['V-1']['comment'].endswith('revision 3.')
    expect(app.locator('#craChecklistProgress')).to_have_text('0 of 23 items checked')


def test_comment_or_link_can_be_saved_without_checkmark_and_survive_language_change(app):
    open_checklist(app)
    row(app, 'V-2').locator('.cra-comment').fill('Manufacturer address awaiting review.')
    row(app, 'VII-3').locator('.cra-link').fill('https://example.com/risk-assessment')
    assert saved(app)['V-2'] == {'checked':False, 'comment':'Manufacturer address awaiting review.', 'link':''}
    assert saved(app)['VII-3'] == {'checked':False, 'comment':'', 'link':'https://example.com/risk-assessment'}
    app.evaluate("TaraPrefs.setLang('de')")
    expect(app.locator('#craAnnex-V')).to_have_text('Anhang V — EU-Konformitätserklärung')
    expect(row(app, 'VII-3')).to_contain_text('Bewertung der Cybersicherheitsrisiken')
    expect(row(app, 'V-2').locator('.cra-comment')).to_have_value('Manufacturer address awaiting review.')
    expect(row(app, 'VII-3').locator('.cra-link')).to_have_value('https://example.com/risk-assessment')
    switch_tab(app, 'overview')
    switch_tab(app, 'cra_documentation')
    expect(row(app, 'V-2').locator('.cra-comment')).to_have_value('Manufacturer address awaiting review.')
    row(app, 'VII-3').locator('.cra-link').fill('')
    expect(row(app, 'VII-3').locator('.cra-open-link')).to_be_hidden()
    assert saved(app)['VII-3']['link'] == ''


def test_checklist_copies_versions_imports_and_isolated_analyses(app):
    original = get_active_analysis(app)
    app.evaluate('createNewVersion("Before checklist")')
    empty_version = get_active_analysis(app)['metadata']['version']
    open_checklist(app)
    row(app, 'VII-7').locator('.cra-check').check()
    row(app, 'VII-7').locator('.cra-comment').fill('Signed declaration archived.')
    row(app, 'VII-7').locator('.cra-link').fill('https://example.com/declaration')
    expected = saved(app)
    app.evaluate('createNewVersion("Documentation reviewed")')
    version = get_active_analysis(app)['metadata']['version']
    row(app, 'VII-7').locator('.cra-comment').fill('Changed after snapshot')
    app.evaluate('createNewVersion("Changed evidence")')
    app.evaluate('([id,version]) => revertToVersion(id,version)', [original['id'], empty_version])
    app.click('#btnConfirmAction')
    expect(row(app, 'VII-7').locator('.cra-check')).not_to_be_checked()
    expect(row(app, 'VII-7').locator('.cra-comment')).to_have_value('')
    app.evaluate('([id,version]) => revertToVersion(id,version)', [original['id'], version])
    app.click('#btnConfirmAction')
    assert saved(app) == expected
    create_analysis(app, 'Empty CRA review')
    switch_tab(app, 'cra_documentation')
    expect(app.locator('#craChecklistProgress')).to_have_text('0 of 23 items checked')
    assert get_active_analysis(app).get('craDocumentationChecklist') is None
    create_analysis(app, 'Copied CRA review', copy_from=original['name'])
    assert saved(app) == expected
    assert get_active_analysis(app)['history'][0]['state']['craDocumentationChecklist']['items'] == expected
    row(app, 'VII-7').locator('.cra-comment').fill('Copy only')
    app.evaluate('(id) => activateAnalysis(id)', original['id'])
    assert saved(app) == expected
    with app.expect_download() as download:
        app.evaluate('exportAnalysis()')
    exported = download.value.path().read_bytes()
    assert json.loads(exported)['craDocumentationChecklist']['items'] == expected
    app.locator('#importFileInput').set_input_files({'name':'cra.json', 'mimeType':'application/json', 'buffer':exported})
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    assert saved(app) == expected


def test_old_analyses_open_without_changing_data_and_links_are_safe(app):
    app.evaluate('delete getActiveAnalysis().craDocumentationChecklist')
    open_checklist(app)
    assert 'craDocumentationChecklist' not in get_active_analysis(app)
    row(app, 'V-1').locator('.cra-link').fill('javascript:window.craInjected=true')
    expect(row(app, 'V-1').locator('.cra-open-link')).to_be_hidden()
    expect(row(app, 'V-1').locator('.cra-link')).to_have_attribute('aria-invalid', 'true')
    expect(row(app, 'V-1').locator('.cra-link-error')).to_be_visible()
    text = '</textarea><img src=x onerror="window.craInjected=true">'
    row(app, 'V-1').locator('.cra-comment').fill(text)
    app.reload()
    switch_tab(app, 'cra_documentation')
    expect(row(app, 'V-1').locator('.cra-comment')).to_have_value(text)
    expect(row(app, 'V-1').locator('img')).to_have_count(0)
    assert app.evaluate('window.craInjected === true') is False
    assert row(app, 'V-1').locator('.cra-open-link').get_attribute('href') is None
    row(app, 'V-1').locator('.cra-link').fill('https://example.com/evidence')
    expect(row(app, 'V-1').locator('.cra-link-error')).to_be_hidden()
    expect(row(app, 'V-1').locator('.cra-open-link')).to_have_attribute('rel', 'noopener noreferrer')


@pytest.mark.parametrize('lang', ['en', 'de'])
def test_populated_checklist_stays_out_of_pdf(app, lang):
    import pymupdf
    from test_security_level_settings import prepare
    prepare(app)
    open_checklist(app)
    row(app, 'V-1').locator('.cra-check').check()
    row(app, 'V-1').locator('.cra-comment').fill('CRA_ONLY_EVIDENCE_5819')
    row(app, 'V-1').locator('.cra-link').fill('https://example.com/CRA_ONLY_LINK_5819')
    app.evaluate('''(lang) => {
        TaraPrefs.setLang(lang);
        const a = getActiveAnalysis();
        a.impactComments = Object.fromEntries(a.assets.map(asset => [asset.id,
            Object.fromEntries(getDisplayDamageScenarios(a).map(ds => [ds.id, {text:'Begründung',text_en:'Assessment rationale'}]))]));
    }''', lang)
    with app.expect_download(timeout=60000) as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        text = '\n'.join(page.get_text() for page in pdf)
        assert 'CRA_ONLY' not in text
        assert 'CRA Documentation Checklist' not in text
        assert 'CRA-Dokumentationscheckliste' not in text
        assert 'Component security risk' in text

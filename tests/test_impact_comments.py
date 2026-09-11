"""Required impact comments must remain visible and survive reports and versions."""
import pymupdf
import pytest
from playwright.sync_api import expect

from conftest import add_asset, add_damage_scenario, create_analysis, get_active_analysis, switch_tab, set_impact_comment

pytestmark = pytest.mark.damage_scenarios


def setup_matrix(page):
    add_asset(page)
    switch_tab(page, 'damage_scenarios')
    page.evaluate('TaraPrefs.setLang("en")')


def test_matrix_selection_and_required_comment_indicators(app):
    setup_matrix(app)
    table = app.locator('.impact-matrix-table')
    expect(table.locator('thead th')).to_have_count(6)
    expect(table.locator('tbody tr')).to_have_count(1)
    buttons = table.locator('.impact-comment-btn')
    expect(buttons).to_have_count(5)
    expect(table.locator('textarea')).to_have_count(0)
    expect(table.locator('.needs-comment')).to_have_count(5)
    expect(app.locator('.impact-comment-progress')).to_contain_text('0/5')
    score = table.locator('select').first
    score.select_option('3')
    expect(score).to_have_value('3')
    expect(app.locator('#impactCommentModal')).to_be_hidden()
    buttons.first.click()
    expect(app.locator('#impactCommentText')).to_be_focused()
    app.fill('#impactCommentText', '   ')
    app.locator('#impactCommentModal .primary-button').click()
    expect(app.locator('#impactCommentModal')).to_be_visible()
    app.locator('#impactCommentModal .action-button').click()
    downloads = []
    app.on('download', lambda download: downloads.append(download))
    app.evaluate('generateReportPdf()')
    assert not downloads
    expect(app.locator('#impactCommentText')).to_be_focused()
    expect(app.locator('#impactCommentDsId')).to_have_value('DS1')
    app.fill('#impactCommentText', 'Loss of safe component operation.')
    app.locator('#impactCommentModal .primary-button').click()
    expect(buttons.first).to_have_class('impact-comment-btn has-comment')
    expect(buttons.first).to_be_focused()
    expect(app.locator('.impact-comment-progress')).to_contain_text('1/5')
    app.evaluate('generateReportPdf()')
    assert not downloads
    expect(app.locator('#impactCommentDsId')).to_have_value('DS2')
    app.reload()
    switch_tab(app, 'damage_scenarios')
    expect(app.locator('#dsMatrixContainer select').first).to_have_value('3')
    app.locator('#dsMatrixContainer .impact-comment-btn').first.click()
    expect(app.locator('#impactCommentText')).to_have_value('Loss of safe component operation.')


def test_comments_copy_and_restore_versions(app):
    setup_matrix(app)
    set_impact_comment(app, 'Original explanation')
    app.evaluate('createNewVersion("Original assessment")')
    original = get_active_analysis(app)
    set_impact_comment(app, 'Changed explanation')
    app.evaluate('createNewVersion("Changed assessment")')
    app.evaluate('([id, version]) => revertToVersion(id, version)', [original['id'], original['metadata']['version']])
    app.click('#btnConfirmAction')
    switch_tab(app, 'damage_scenarios')
    expect(app.locator('#dsMatrixContainer .impact-comment-btn').first).to_have_attribute('title', 'Original explanation')
    create_analysis(app, 'Copy with comments', copy_from=original['name'])
    copied = get_active_analysis(app)
    assert copied['impactComments'] == original['impactComments']
    assert copied['history'][0]['state']['impactComments'] == original['impactComments']
    switch_tab(app, 'damage_scenarios')
    set_impact_comment(app, 'Copy only')
    assert app.evaluate('(id) => analysisData.find(a => a.id === id).impactComments', original['id']) == original['impactComments']
    assert get_active_analysis(app)['history'][0]['state']['impactComments'] == original['impactComments']


@pytest.mark.parametrize('lang', ['en', 'de'])
def test_pdf_includes_every_asset_type_comment_and_long_text(app, lang):
    setup_matrix(app)
    add_damage_scenario(app, {'name': 'Custom damage type', 'short': 'Custom', 'description': 'Custom scenario'})
    add_asset(app, {'name': 'Second component', 'type': 'Component', 'description': 'Second asset'})
    switch_tab(app, 'damage_scenarios')
    app.evaluate('(lang) => TaraPrefs.setLang(lang)', lang)
    comments = app.locator('#dsMatrixContainer .impact-comment-btn')
    assert comments.count() == 12
    for i in range(comments.count()):
        set_impact_comment(app, f'Assessment explanation {i:02d} END', i)
    long_text = '\n'.join(f'Long assessment line {i:03d}' for i in range(140))
    set_impact_comment(app, long_text)
    app.locator('#dsMatrixContainer select').first.select_option('3')
    with app.expect_download() as download:
        app.evaluate('generateReportPdf()')
    with pymupdf.open(download.value.path()) as pdf:
        text = '\n'.join(page.get_text() for page in pdf)
        assert 'Long assessment line 139' in text
        for i in range(1, 12):
            assert f'Assessment explanation {i:02d} END' in text
        normalized = ' '.join(text.split())
        assert 'Second component' in normalized and 'Custom damage type' in normalized
        heading = 'Damage type' if lang == 'en' else 'Schadenstyp'
        pages = [page for page in pdf if 'Long assessment line' in page.get_text()]
        assert len(pages) >= 3
        for page in pages:
            assert heading in page.get_text()  # Headers repeat on continuation pages.
            for block in page.get_text('blocks'):
                if 'Long assessment line' in block[4]:
                    assert block[1] >= 30
                    assert block[3] < page.rect.height - 35


def test_legacy_comments_and_bilingual_fallback(app):
    setup_matrix(app)
    app.evaluate('''() => {
        const a = getActiveAnalysis();
        a.impactComments = {A01: {DS1: 'Legacy explanation', DS2: {text: 'Deutsche Erklärung'}, DS3: {text_en: 'English explanation'}}};
        renderImpactMatrix();
    }''')
    comments = app.locator('#dsMatrixContainer .impact-comment-btn')
    expect(comments.first).to_have_attribute('title', 'Legacy explanation')
    expect(comments.nth(1)).to_have_attribute('title', 'Deutsche Erklärung')
    app.evaluate('TaraPrefs.setLang("de")')
    expect(comments.nth(2)).to_have_attribute('title', 'English explanation')
    app.evaluate('openImpactComment("A01", "DS1")')
    app.fill('#impactCommentText', '   ')
    app.evaluate('saveImpactComment()')
    expect(app.locator('#impactCommentModal')).to_be_visible()
    assert get_active_analysis(app)['impactComments']['A01']['DS1'] == 'Legacy explanation'

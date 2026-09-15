"""Overview list entries must remain distinct throughout the analysis lifecycle."""
import json

import pytest
from playwright.sync_api import expect

from conftest import create_analysis, get_active_analysis, switch_tab

pytestmark = pytest.mark.core

LISTS = ['functions', 'potentialMisuseCases', 'productVariants', 'assumptions']


def field(page, key):
    return page.locator(f'[data-overview-list="{key}"]')


def test_list_editing_save_reload_switch_and_layout(app):
    app.evaluate('TaraPrefs.setLang("en")')
    expect(app.locator('.overview-details-grid > .form-group > label')).to_have_text([
        'System description', 'Functions', 'Intended use', 'Potential misuse cases',
        'Product variants evaluated', 'Assumptions',
    ])
    for key in LISTS:
        editor = field(app, key)
        editor.locator('textarea').fill(f'{key} first\nwith a second line')
        editor.locator('[data-list-add]').click()
        editor.locator('textarea').nth(1).fill(f'{key} second')
        editor.locator('[data-list-add]').click()
        editor.locator('textarea').nth(2).fill('Remove me')
        editor.locator('[data-list-remove]').nth(2).click()
    long_text = 'A detailed system description. ' * 300
    app.fill('#inputDescription', long_text)
    app.fill('#inputIntendedUse', 'Intended operation')
    app.click('#btnSave')
    original = get_active_analysis(app)
    app.reload()
    for key in LISTS:
        assert get_active_analysis(app)[key] == [f'{key} first\nwith a second line', f'{key} second']
        expect(field(app, key).locator('textarea').first).to_have_value(f'{key} first\nwith a second line')
    create_analysis(app, 'Empty overview')
    for key in LISTS:
        expect(field(app, key).locator('textarea')).to_have_value('')
    app.select_option('#analysisSelector', original['id'])
    switch_tab(app, 'assets')
    switch_tab(app, 'overview')
    for viewport in [{'width': 1400, 'height': 900}, {'width': 390, 'height': 844}]:
        app.set_viewport_size(viewport)
        app.wait_for_timeout(100)
        boxes = app.locator('.overview-details-grid > .form-group').evaluate_all(
            '(fields) => fields.map(el => { const r = el.getBoundingClientRect(); return {x:r.x, y:r.y, bottom:r.bottom, width:r.width}; })'
        )
        for previous, current in zip(boxes, boxes[1:]):
            assert current['y'] >= previous['bottom']
            assert current['x'] == previous['x']
            assert current['width'] == previous['width']
        assert app.locator('#inputDescription').evaluate('(el) => el.scrollHeight <= el.clientHeight')


def test_lists_copy_export_import_and_restore(app):
    for key in LISTS:
        field(app, key).locator('textarea').fill(f'{key} original')
    app.evaluate('createNewVersion("Original lists")')
    original = get_active_analysis(app)
    for key in LISTS:
        field(app, key).locator('textarea').fill('Changed')
    app.evaluate('createNewVersion("Changed lists")')
    app.evaluate('([id, version]) => revertToVersion(id, version)', [original['id'], original['metadata']['version']])
    app.click('#btnConfirmAction')
    create_analysis(app, 'Copy with lists', copy_from=original['name'])
    copied = get_active_analysis(app)
    for key in LISTS:
        assert copied[key] == original[key]
        assert copied['history'][0]['state'][key] == original[key]
    # Editing the copy must not mutate the source or its version snapshot.
    field(app, 'assumptions').locator('textarea').fill('Copy only')
    assert app.evaluate('(id) => analysisData.find(a => a.id === id).assumptions', original['id']) == original['assumptions']
    assert get_active_analysis(app)['history'][0]['state']['assumptions'] == original['assumptions']
    with app.expect_download() as download:
        app.evaluate('exportAnalysis()')
    exported = json.loads(download.value.path().read_text())
    assert exported['assumptions'] == ['Copy only']
    app.locator('#importFileInput').set_input_files({
        'name': 'lists.json', 'mimeType': 'application/json',
        'buffer': json.dumps(exported).encode(),
    })
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    for key in LISTS:
        assert get_active_analysis(app)[key] == exported[key]


def test_legacy_text_and_missing_assumptions(app):
    app.evaluate('''() => {
        const analysis = getActiveAnalysis();
        analysis.functions = 'First function\\r\\nSecond function';
        analysis.productVariants = 'Variant A\\n\\nVariant B';
        analysis.potentialMisuseCases = '<img src=x onerror=alert(1)>';
        delete analysis.assumptions;
        migrateAnalysis(analysis);
        fillAnalysisForm(analysis);
    }''')
    expect(field(app, 'functions').locator('textarea')).to_have_count(2)
    expect(field(app, 'productVariants').locator('textarea').nth(1)).to_have_value('Variant B')
    expect(field(app, 'potentialMisuseCases').locator('textarea')).to_have_value('<img src=x onerror=alert(1)>')
    assert field(app, 'potentialMisuseCases').locator('img').count() == 0
    assert get_active_analysis(app)['assumptions'] == []
    field(app, 'functions').locator('[data-list-remove]').first.click()
    field(app, 'functions').locator('[data-list-remove]').first.click()
    assert get_active_analysis(app)['functions'] == []
    field(app, 'functions').locator('[data-list-add]').click()
    field(app, 'functions').locator('textarea').fill('Replacement')
    app.evaluate('TaraPrefs.setLang("de")')
    expect(field(app, 'functions').locator('textarea')).to_have_attribute('aria-label', 'Funktionen: Eintrag 1')
    expect(field(app, 'functions').locator('textarea')).to_have_value('Replacement')

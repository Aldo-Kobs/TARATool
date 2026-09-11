"""Overview image uploads must survive the analysis lifecycle without data loss."""
import base64
import json

import pytest
from playwright.sync_api import expect

from conftest import create_analysis, get_active_analysis, local_storage_data

pytestmark = pytest.mark.core

PNG = base64.b64decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='
)


def field(page, key):
    return page.locator(f'[data-overview-image="{key}Image"]')


def upload(page, key, name='diagram.png', buffer=PNG, mime='image/png'):
    field(page, key).locator('input').set_input_files(
        {'name': name, 'mimeType': mime, 'buffer': buffer}
    )


def wait_saved(page, key, name):
    page.wait_for_function(
        '([key, name]) => getActiveAnalysis()[key + "Image"]?.name === name',
        arg=[key, name],
    )
    expect(field(page, key).locator('img')).to_be_visible()


def test_images_persist_replace_remove_and_switch(app):
    upload(app, 'architecture')
    wait_saved(app, 'architecture', 'diagram.png')
    upload(app, 'components', 'components.png')
    wait_saved(app, 'components', 'components.png')
    original = get_active_analysis(app)
    assert local_storage_data(app)[0]['architectureImage'] == original['architectureImage']
    app.reload()
    wait_saved(app, 'architecture', 'diagram.png')
    wait_saved(app, 'components', 'components.png')
    create_analysis(app, 'Empty analysis')
    expect(field(app, 'architecture').locator('img')).to_be_hidden()
    expect(field(app, 'components').locator('img')).to_be_hidden()
    app.select_option('#analysisSelector', original['id'])
    wait_saved(app, 'architecture', 'diagram.png')
    upload(app, 'architecture', 'replacement.png')
    wait_saved(app, 'architecture', 'replacement.png')
    field(app, 'architecture').locator('button').click()
    expect(field(app, 'architecture').locator('img')).to_be_hidden()
    app.reload()
    assert get_active_analysis(app)['architectureImage'] is None
    wait_saved(app, 'components', 'components.png')


def test_images_copy_export_import_and_version_restore(app):
    upload(app, 'architecture')
    wait_saved(app, 'architecture', 'diagram.png')
    upload(app, 'components', 'components.png')
    wait_saved(app, 'components', 'components.png')
    original = get_active_analysis(app)
    app.evaluate('createNewVersion("With images")')
    version = get_active_analysis(app)['metadata']['version']
    field(app, 'architecture').locator('button').click()
    app.evaluate('createNewVersion("Without architecture")')
    app.evaluate('([id, version]) => revertToVersion(id, version)', [original['id'], version])
    app.click('#btnConfirmAction')
    wait_saved(app, 'architecture', 'diagram.png')
    create_analysis(app, 'Copy with images', copy_from=original['name'])
    copied = get_active_analysis(app)
    assert copied['architectureImage'] == original['architectureImage']
    assert copied['history'][0]['state']['componentsImage'] == original['componentsImage']
    with app.expect_download() as downloaded:
        app.evaluate('exportAnalysis()')
    exported = json.loads(downloaded.value.path().read_text())
    assert exported['architectureImage'] == original['architectureImage']
    app.locator('#importFileInput').set_input_files({
        'name': 'analysis.json', 'mimeType': 'application/json',
        'buffer': json.dumps(exported).encode(),
    })
    app.evaluate('executeImport()')
    app.wait_for_function('getActiveAnalysis().name.includes("Imported")')
    wait_saved(app, 'components', 'components.png')


@pytest.mark.parametrize('mime, buffer, error_key', [
    ('text/plain', b'not an image', 'imageInvalid'),
    ('image/png', b'not really a PNG', 'imageInvalid'),
    ('image/png', b'x' * (5 * 1024 * 1024 + 1), 'imageTooLarge'),
], ids=['unsupported-type', 'corrupt-image', 'oversized-image'])
def test_invalid_upload_preserves_existing_image(app, mime, buffer, error_key):
    upload(app, 'architecture')
    wait_saved(app, 'architecture', 'diagram.png')
    saved = get_active_analysis(app)['architectureImage']
    upload(app, 'architecture', 'invalid.png', buffer, mime)
    expect(app.locator('#toastContainer')).to_contain_text(
        app.evaluate('(key) => t("overview." + key)', error_key)
    )
    assert get_active_analysis(app)['architectureImage'] == saved


def test_storage_failure_preserves_saved_image(app):
    upload(app, 'architecture')
    wait_saved(app, 'architecture', 'diagram.png')
    saved = get_active_analysis(app)['architectureImage']
    app.evaluate('''() => {
        Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
    }''')
    upload(app, 'architecture', 'replacement.png')
    expect(app.locator('#toastContainer')).to_contain_text(app.evaluate('t("toast.storageFail")'))
    assert get_active_analysis(app)['architectureImage'] == saved
    expect(field(app, 'architecture').locator('.overview-image-name')).to_have_text('diagram.png')


def test_legacy_analysis_and_unsafe_imported_image(app):
    app.evaluate('''() => {
        const analysis = getActiveAnalysis();
        delete analysis.architectureImage;
        delete analysis.componentsImage;
        migrateAnalysis(analysis);
        fillAnalysisForm(analysis);
    }''')
    expect(field(app, 'architecture').locator('img')).to_be_hidden()
    app.evaluate('''() => {
        getActiveAnalysis().architectureImage = {
            name: '<img src=x onerror=alert(1)>', dataUrl: 'https://example.com/tracker.png'
        };
        renderOverview(getActiveAnalysis());
    }''')
    assert field(app, 'architecture').locator('img').get_attribute('src') is None
    app.evaluate('TaraPrefs.setLang("en")')
    expect(field(app, 'architecture').locator('label')).to_have_text('System or product architecture')
    expect(field(app, 'components').locator('label')).to_have_text('Internal components and external interfaces')


def test_five_mb_images_save_in_both_fields(app):
    # A valid PNG with padding exercises the full upload boundary and optimization.
    large_png = PNG + b'\0' * (5 * 1024 * 1024 - len(PNG))
    for key in ['architecture', 'components']:
        upload(app, key, f'{key}-large.png', large_png)
        wait_saved(app, key, f'{key}-large.png')
    app.reload()
    for key in ['architecture', 'components']:
        wait_saved(app, key, f'{key}-large.png')
    assert app.locator('.meta-form-grid + .overview-images-grid + .overview-details-grid').count() == 1

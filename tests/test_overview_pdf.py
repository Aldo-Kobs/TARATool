"""Read real exported PDFs to verify the complete overview and page layout."""
import pymupdf
import pytest

pytestmark = pytest.mark.report


def export_pdf(page):
    with page.expect_download(timeout=15000) as download:
        page.evaluate('generateReportPdf()')
    return pymupdf.open(download.value.path())


@pytest.mark.parametrize('lang, formats', [('en', ['png', 'jpeg']), ('de', ['jpeg', 'webp'])])
def test_overview_pdf_content_images_order_and_latest_edits(app, lang, formats):
    app.evaluate('''([lang, formats]) => {
        TaraPrefs.setLang(lang);
        const analysis = getActiveAnalysis();
        analysis.name = 'PDF overview';
        analysis.metadata.author = 'PDF author';
        analysis.description = 'System description content';
        analysis.functions = ['Function Alpha', 'Function Beta\\nFunction continuation'];
        analysis.intendedUse = 'Intended operation content';
        analysis.potentialMisuseCases = ['Misuse Alpha', 'Misuse Beta'];
        analysis.productVariants = ['Variant Alpha', 'Variant Beta'];
        analysis.assumptions = ['Assumption Alpha', 'Assumption Beta'];
        ['architectureImage', 'componentsImage'].forEach((key, index) => {
            const canvas = document.createElement('canvas');
            canvas.width = index ? 200 : 400;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = index ? '#228844' : '#3366bb';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            analysis[key] = {name: key + '.' + formats[index], dataUrl: canvas.toDataURL('image/' + formats[index])};
        });
        fillAnalysisForm(analysis);
    }''', [lang, formats])
    # Export while the field still has focus, without pressing Save.
    app.locator('[data-overview-list="assumptions"] textarea').last.fill('Latest assumption')
    with export_pdf(app) as pdf:
        text = '\n'.join(page.get_text() for page in pdf)
        strings = app.evaluate('(lang) => ReportI18n.reportStrings(lang)', lang)
        order = ['analysisName', 'author', 'architectureImage', 'componentsImage', 'systemDesc',
                 'functions', 'intendedUse', 'potentialMisuseCases', 'productVariants', 'assumptions']
        positions = [text.index(strings[key]) for key in order]
        assert positions == sorted(positions)
        for content in ['PDF author', 'System description content', 'Function Alpha', 'Function Beta',
                        'Function continuation', 'Intended operation content', 'Misuse Alpha', 'Misuse Beta',
                        'Variant Alpha', 'Variant Beta', 'Assumption Alpha', 'Latest assumption']:
            assert content in text
        assert 'Assumption Beta' not in text
        first_page_images = pdf[0].get_image_info()
        assert len(first_page_images) == 2
        for image, expected_ratio in zip(first_page_images, [2, 1]):
            rect = pymupdf.Rect(image['bbox'])
            assert rect.width / rect.height == pytest.approx(expected_ratio, rel=0.01)
            assert pdf[0].rect.contains(rect)
        overview_pages = []
        for page in pdf:
            if strings['mgmtSummary'] in page.get_text():
                break
            overview_pages.append(page)
        # Actual vector bullets are rendered once per entry, not once per wrapped line.
        bullet_count = sum(
            1 for page in overview_pages for drawing in page.get_drawings()
            if drawing['fill'] == (0, 0, 0) and 3 < drawing['rect'].width < 4
        )
        assert bullet_count == 8


def test_long_overview_pdf_paginates_without_clipping(app):
    app.evaluate('''() => {
        TaraPrefs.setLang('en');
        const analysis = getActiveAnalysis();
        analysis.description = Array.from({length: 150}, (_, i) => `Description line ${i}`).join('\\n');
        analysis.functions = [Array.from({length: 120}, (_, i) => `Function line ${i}`).join('\\n'), 'Final function'];
        analysis.assumptions = ['Final assumption'];
        fillAnalysisForm(analysis);
    }''')
    with export_pdf(app) as pdf:
        overview = []
        for page in pdf:
            if 'Management summary' in page.get_text():
                break
            overview.append(page)
        assert len(overview) >= 5
        text = '\n'.join(page.get_text() for page in overview)
        for content in ['Description line 149', 'Function line 119', 'Final function', 'Final assumption']:
            assert content in text
        for page in overview:
            for x0, y0, x1, y1, *_ in page.get_text('blocks'):
                assert x0 >= 40
                assert x1 <= page.rect.width - 40
                assert y0 >= 20
                assert y1 <= page.rect.height - 15


def test_legacy_and_invalid_overview_images_export(app):
    app.evaluate('''() => {
        TaraPrefs.setLang('en');
        const analysis = getActiveAnalysis();
        analysis.functions = 'Legacy function A\\nLegacy function B';
        delete analysis.assumptions;
        analysis.architectureImage = {name: 'unsafe.png', dataUrl: 'https://example.com/image.png'};
        delete analysis.componentsImage;
        fillAnalysisForm(analysis);
    }''')
    with export_pdf(app) as pdf:
        text = '\n'.join(page.get_text() for page in pdf)
        assert 'Legacy function A' in text and 'Legacy function B' in text
        assert 'Assumptions' in text
        assert 'Image could not be embedded.' in text
        assert 'No image added yet' in text
        assert not pdf[0].get_image_info()

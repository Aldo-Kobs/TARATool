/**
 * @file        about.js
 * @description About dialog with project information and a direct runtime SBOM
 * @author      Nico Peper
 * @organization SCHUNK SE & Co. KG
 * @copyright   2026 SCHUNK SE & Co. KG
 * @modified    2026-10-06 Aldo-Kobs; see NOTICE.md and docs/MODIFICATIONS.md
 * @license     GPL-3.0-or-later
 */

const TARA_TOOL_VERSION = '1.0.0';

/**
 * @returns {'de'|'en'}
 */
function _aboutLang() {
  return window.TaraPrefs && TaraPrefs.getLang && TaraPrefs.getLang() === 'en' ? 'en' : 'de';
}

/**
 * Generates a CycloneDX 1.5 inventory of direct runtime components and services.
 * Transitive/embedded dependencies and development tooling are not inventoried.
 * Descriptions follow the current UI language.
 * @returns {Object} CycloneDX BOM object
 */
function generateCycloneDxSbom() {
  const en = _aboutLang() === 'en';
  const sbom = {
    $schema: 'http://cyclonedx.org/schema/bom-1.5.schema.json',
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    serialNumber: 'urn:uuid:' + crypto.randomUUID(),
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [
        {
          vendor: 'Aldo-Kobs',
          name: 'TARA Tool',
          version: TARA_TOOL_VERSION,
        },
      ],
      component: {
        type: 'application',
        'bom-ref': 'taratool',
        name: 'TARATool',
        version: TARA_TOOL_VERSION,
        description: en
          ? 'Browser-based tool for threat and risk analyses (TARA) in the context of the EU Cyber Resilience Act (CRA)'
          : 'Browser-basiertes Werkzeug für Bedrohungs- und Risikoanalysen (TARA) im Kontext des EU Cyber Resilience Act (CRA)',
        licenses: [{ license: { id: 'GPL-3.0-or-later' } }],
        supplier: {
          name: 'Aldo-Kobs',
          url: ['https://github.com/Aldo-Kobs/TARATool'],
        },
        author: 'Nico Peper (upstream); Aldo-Kobs (fork modifications)',
        copyright:
          'Copyright (C) 2026 SCHUNK SE & Co. KG; fork modifications Copyright (C) 2026 Aldo-Kobs',
        purl: 'pkg:github/Aldo-Kobs/TARATool@' + TARA_TOOL_VERSION,
        externalReferences: [
          { type: 'website', url: 'https://github.com/Aldo-Kobs/TARATool' },
          { type: 'vcs', url: 'https://github.com/Aldo-Kobs/TARATool.git' },
          { type: 'license', url: 'https://www.gnu.org/licenses/gpl-3.0.html' },
        ],
      },
      manufacture: {
        name: 'Aldo-Kobs',
        url: ['https://github.com/Aldo-Kobs/TARATool'],
      },
    },
    components: [
      {
        type: 'library',
        name: 'Font Awesome Free',
        version: '6.5.1',
        description: en
          ? 'The iconic SVG, font, and CSS toolkit – UI icons'
          : 'The iconic SVG, font, and CSS toolkit – Icons für die Benutzeroberfläche',
        licenses: [
          { license: { id: 'MIT' } },
          { license: { id: 'OFL-1.1' } },
          { license: { id: 'CC-BY-4.0' } },
        ],
        purl: 'pkg:npm/%40fortawesome/fontawesome-free@6.5.1',
        scope: 'required',
        externalReferences: [
          { type: 'website', url: 'https://fontawesome.com/' },
          {
            type: 'distribution',
            url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
          },
        ],
      },
      {
        type: 'library',
        name: '@hpcc-js/wasm',
        version: '2.33.2',
        description: en
          ? 'HPCC Systems WASM wrapper for Graphviz – in-browser DOT rendering of attack trees'
          : 'HPCC Systems WASM-Wrapper für Graphviz – DOT-Rendering der Angriffsbäume im Browser',
        licenses: [{ license: { id: 'Apache-2.0' } }],
        purl: 'pkg:npm/%40hpcc-js/wasm@2.33.2',
        scope: 'required',
        externalReferences: [
          { type: 'website', url: 'https://github.com/hpcc-systems/hpcc-js-wasm' },
          {
            type: 'distribution',
            url: 'https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@2.33.2/dist/index.js',
          },
        ],
      },
      {
        type: 'library',
        name: 'jsPDF',
        version: '4.2.1',
        description: en
          ? 'Client-side PDF generation – TARA PDF report'
          : 'Client-seitige PDF-Generierung – Erzeugung des TARA-PDF-Reports',
        licenses: [{ license: { id: 'MIT' } }],
        purl: 'pkg:npm/jspdf@4.2.1',
        scope: 'required',
        externalReferences: [
          { type: 'website', url: 'https://github.com/parallax/jsPDF' },
          {
            type: 'distribution',
            url: 'https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js',
          },
        ],
      },
      {
        type: 'library',
        name: 'JSZip',
        version: '3.10.1',
        description: en
          ? 'JavaScript library for ZIP archives – tree data ZIP export'
          : 'JavaScript-Bibliothek für ZIP-Archive – Export von Baumdaten als ZIP',
        licenses: [{ expression: 'MIT OR GPL-3.0-or-later' }],
        purl: 'pkg:npm/jszip@3.10.1',
        scope: 'required',
        externalReferences: [
          { type: 'website', url: 'https://stuk.github.io/jszip/' },
          {
            type: 'distribution',
            url: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
          },
        ],
      },
      {
        type: 'application',
        'bom-ref': 'taratool-local-server',
        name: 'TARA Tool local storage server',
        version: TARA_TOOL_VERSION,
        description: en
          ? 'Optional scripts/server.py launcher for automatic folder saves, recovery backups and browser-data migration. Uses Python 3.10+ and its standard library; no third-party Python runtime packages.'
          : 'Optionaler Starter scripts/server.py für automatische Ordnerspeicherung, Sicherungskopien und Browserdatenübertragung. Verwendet Python 3.10+ und dessen Standardbibliothek; keine Python-Laufzeitpakete von Drittanbietern.',
        licenses: [{ license: { id: 'GPL-3.0-or-later' } }],
        scope: 'optional',
        externalReferences: [{ type: 'website', url: 'https://github.com/Aldo-Kobs/TARATool' }],
      },
    ],
    services: [
      {
        'bom-ref': 'service-kroki',
        name: 'Kroki',
        endpoints: ['https://kroki.io/graphviz/svg'],
        description: en
          ? 'Optional Graphviz fallback for tree previews and PDF reports when local WASM rendering fails; receives attack-tree DOT data.'
          : 'Optionaler Graphviz-Fallback für Baumvorschauen und PDF-Berichte, wenn lokales WASM-Rendering fehlschlägt; empfängt DOT-Daten der Angriffsbäume.',
      },
      {
        'bom-ref': 'service-quickchart',
        name: 'QuickChart',
        endpoints: ['https://quickchart.io/graphviz'],
        description: en
          ? 'Optional Graphviz fallback after Kroki for tree previews and PDF reports; receives attack-tree DOT data.'
          : 'Optionaler Graphviz-Fallback nach Kroki für Baumvorschauen und PDF-Berichte; empfängt DOT-Daten der Angriffsbäume.',
      },
    ],
    compositions: [{ aggregate: 'incomplete', assemblies: ['taratool'] }],
    properties: [
      {
        name: 'taratool:inventory:scope',
        value:
          'Direct browser libraries, optional local server and external rendering services. Excludes transitive/embedded dependencies, the host Python/browser runtime, development, test, documentation and security tooling. Not a BSI TR-03183-2 compliance declaration.',
      },
    ],
  };
  for (const component of sbom.components) component['bom-ref'] ||= component.purl;
  sbom.dependencies = [
    {
      ref: sbom.metadata.component['bom-ref'],
      dependsOn: [...sbom.components, ...sbom.services].map((entry) => entry['bom-ref']),
    },
  ];
  return sbom;
}

/**
 * Downloads the CycloneDX SBOM as a JSON file.
 */
function downloadSbom() {
  const sbom = generateCycloneDxSbom();
  const json = JSON.stringify(sbom, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TARATool_SBOM_CycloneDX_${new Date().toISOString().substring(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Builds the SBOM component table rows.
 */
function _buildSbomTableRows() {
  const comps = generateCycloneDxSbom().components;
  return comps
    .map((c) => {
      const licenses = c.licenses.map((l) => l.expression || l.license.id).join(', ');
      const distRef = (c.externalReferences || []).find((r) => r.type === 'distribution');
      const webRef = (c.externalReferences || []).find((r) => r.type === 'website');
      const link = webRef ? webRef.url : distRef ? distRef.url : '#';
      const tip = String(c.description || '').replace(/"/g, '&quot;');
      return `<tr>
            <td><a href="${link}" target="_blank" rel="noopener" title="${tip}">${c.name}</a></td>
            <td>${c.version}</td>
            <td><code>${licenses}</code></td>
            <td>${c.scope || '–'}</td>
            <td style="font-size:0.75em; word-break:break-all;"><code>${c.purl || '–'}</code></td>
        </tr>`;
    })
    .join('');
}

let _aboutReturnFocus = null;

/** Close About without discarding the analysis or the current tab. */
function closeAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (!modal || modal.style.display === 'none') return;
  modal.style.display = 'none';
  document.removeEventListener('keydown', _handleAboutKeydown);
  if (_aboutReturnFocus?.isConnected) _aboutReturnFocus.focus();
  _aboutReturnFocus = null;
}

function _handleAboutKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeAboutModal();
  }
}

function _handleAboutBackdrop(event) {
  if (event.target === event.currentTarget) closeAboutModal();
}

/**
 * Opens the About modal.
 */
function openAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (!modal) return;
  const opening = modal.style.display !== 'block';
  if (opening) _aboutReturnFocus = document.activeElement;

  const _t = (key, fallback) => (typeof t === 'function' ? t(key) : fallback);

  document.getElementById('aboutBodyContent').innerHTML = `
        <div class="about-header-block">
            <div class="about-title-row">
                <i class="fas fa-shield-alt about-icon"></i>
                <div>
                    <h2 id="aboutTitle" style="margin:0;">TARA Tool</h2>
                    <span class="about-version-badge">v${TARA_TOOL_VERSION}</span>
                </div>
            </div>
            <p class="about-tagline">
                ${_t('about.tagline', 'Browser-basiertes Werkzeug für Bedrohungs- und Risikoanalysen (TARA)<br>im Kontext des <strong>EU Cyber Resilience Act (CRA)</strong>')}
            </p>
        </div>

        <div class="about-meta-grid">
            <div><strong>${_t('about.originalAuthor', 'Ursprünglicher Autor')}:</strong> Nico Peper</div>
            <div><strong>${_t('about.upstream', 'Ursprüngliches Projekt')}:</strong> <a href="https://github.com/SCHUNK-SE-Co-KG/TARATool" target="_blank" rel="noopener">SCHUNK SE &amp; Co. KG</a></div>
            <div><strong>${_t('about.forkMaintainer', 'Fork-Maintainer')}:</strong> Aldo-Kobs</div>
            <div><strong>${_t('about.license', 'Lizenz')}:</strong> <a href="LICENSE" target="_blank" rel="noopener">GPL-3.0-or-later</a></div>
            <div><strong>${_t('about.repo', 'Repository')}:</strong>
                <a href="https://github.com/Aldo-Kobs/TARATool" target="_blank" rel="noopener">GitHub</a>
            </div>
        </div>

        <div class="about-legal-block">
            <p>Copyright (C) 2026 SCHUNK SE &amp; Co. KG.<br>
                ${_t('about.forkCopyright', 'Änderungen am Fork: Copyright (C) 2026 Aldo-Kobs.')}</p>
            <p>${_t('about.modified', 'Geänderte Fassung von Aldo-Kobs, 10. September–6. Oktober 2026.')}</p>
            <p>${_t('about.rights', 'Du darfst dieses Programm unter der GNU General Public License, Version 3 oder (nach deiner Wahl) jeder späteren Version, weitergeben und verändern.')}</p>
            <p>${_t('about.warranty', 'OHNE JEGLICHE GEWÄHRLEISTUNG, einschließlich der impliziten Gewährleistung der MARKTREIFE oder der VERWENDBARKEIT FÜR EINEN BESTIMMTEN ZWECK. Einzelheiten stehen in der Lizenz.')}</p>
            <p><a href="LICENSE" target="_blank" rel="noopener">${_t('about.fullLicense', 'Vollständige Lizenz')}</a> ·
                <a href="NOTICE.md" target="_blank" rel="noopener">${_t('about.notices', 'Urheber- und Änderungshinweise')}</a> ·
                <a href="https://github.com/Aldo-Kobs/TARATool" target="_blank" rel="noopener">${_t('about.source', 'Quellcode dieses Forks')}</a></p>
        </div>

        <div class="about-development-block">
            <h3>${_t('about.development', 'Entwicklung dieses Forks')}</h3>
            <p>${_t('about.developmentDetail', 'Erweiterte Asset- und Schadensbewertung, gemeinsame Risiken mit individuellen Asset-Werten, statistisches ODER für Angriffspfade, Restrisiko und Lebenszyklus, SL-T-Einstellungen, zweisprachige Parameterhilfe und PDF-Berichte. Optionaler Python-Starter mit automatischer Ordnerspeicherung und Sicherungskopien.')}</p>
            <p><a href="CHANGELOG.md" target="_blank" rel="noopener">${_t('about.changelog', 'Änderungsverlauf')}</a> ·
                <a href="docs/MODIFICATIONS.md" target="_blank" rel="noopener">${_t('about.modifications', 'Datierter Änderungsnachweis')}</a> ·
                <a href="docs/risk-calculation-guide.md" target="_blank" rel="noopener">${_t('about.calculationReference', 'Referenz zur Risikoberechnung')}</a></p>
        </div>

        <div class="about-method-block">
            <strong>${_t('about.method', 'Methodik:')}</strong>
            <span style="color:#777; font-size:0.85em;">${_t('about.methodDetail', 'Komplexität, Skalierung, Zeitaufwand und Nutzen; alternative Angriffspfade werden mit normalisiertem statistischem ODER kombiniert.')}</span>
        </div>

        <div class="about-sbom-block">
            <div class="about-sbom-header">
                <div>
                    <h3 style="margin:0 0 4px 0;">${_t('about.sbomTitle', 'Software Bill of Materials (SBOM)')}</h3>
                    <p style="margin:0; font-size:0.85em; color:#666;">${_t('about.sbomSub', 'Direkte Laufzeitkomponenten von TARA Tool – CycloneDX 1.5')}</p>
                </div>
                <button type="button" class="action-button small" onclick="downloadSbom()"
                        title="${_t('about.sbomExportTip', 'SBOM als CycloneDX-JSON herunterladen')}">
                    <i class="fas fa-download"></i> ${_t('about.sbomExport', 'SBOM exportieren')}
                </button>
            </div>
            <div class="about-sbom-table-wrap">
                <table class="about-sbom-table">
                    <thead>
                        <tr>
                            <th>${_t('about.col.component', 'Komponente')}</th>
                            <th>${_t('about.col.version', 'Version')}</th>
                            <th>${_t('about.col.license', 'Lizenz')}</th>
                            <th>${_t('about.col.scope', 'Scope')}</th>
                            <th>${_t('about.col.purl', 'PURL')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${_buildSbomTableRows()}
                    </tbody>
                </table>
            </div>
            <p class="about-sbom-footer">
                ${_t('about.sbomFooter', 'Diese SBOM erfasst TARA Tool, nicht das bewertete Produkt: direkte Browser-Bibliotheken von CDNs, den optionalen Python-Starter und externe Render-Dienste. Transitive/eingebettete Abhängigkeiten, die Python-/Browser-Umgebung sowie Entwicklungs-, Test-, Dokumentations- und Sicherheitswerkzeuge sind nicht erfasst. Eine Konformität mit BSI TR-03183-2 wird nicht erklärt. Kroki und QuickChart empfangen DOT-Baumdaten als Fallback für Vorschauen und PDF-Berichte, wenn lokales WASM-Rendering fehlschlägt.')}
            </p>
        </div>
    `;

  modal.style.display = 'block';
  modal.addEventListener('click', _handleAboutBackdrop);
  document.addEventListener('keydown', _handleAboutKeydown);
  if (opening) modal.querySelector('.close-button').focus();
}

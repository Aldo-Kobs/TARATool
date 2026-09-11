/**
 * @file        analysis_core.js
 * @description Analysis management – create, switch, delete, import/export
 * @author      Nico Peper
 * @organization SCHUNK SE & Co. KG
 * @copyright   2026 SCHUNK SE & Co. KG
 * @license     GPL-3.0
 */

function activateAnalysis(id) {
  const analysis = analysisData.find((a) => a.id === id);
  if (!analysis) return;

  activeAnalysisId = id;

  // Keep residual risk structure up to date (risk analysis -> residual risk)
  try {
    if (typeof ensureResidualRiskSynced === 'function') {
      ensureResidualRiskSynced(analysis);
    }
  } catch (e) {
    console.warn('[activateAnalysis] Residual risk sync error:', e);
  }

  // UI Update
  fillAnalysisForm(analysis);

  // Status Bar Update
  const elStatusBar = document.getElementById('statusBarMessage');
  if (elStatusBar) {
    elStatusBar.textContent =
      typeof tf === 'function'
        ? tf('status.active', { name: analysis.name, version: analysis.metadata.version })
        : `Aktiv: ${analysis.name} (v${analysis.metadata.version})`;
  }

  // Dropdown Sync
  const elSelector = document.getElementById('analysisSelector');
  if (elSelector) elSelector.value = id;

  // Re-render the active tab (using shared function from globals.js)
  if (typeof renderActiveTab === 'function') renderActiveTab(analysis);
}

// =============================================================
// --- UI UPDATES & GENERAL FUNCTIONS ---
// =============================================================

function renderAnalysisSelector() {
  const elSelector = document.getElementById('analysisSelector');
  if (!elSelector) return;
  elSelector.innerHTML = '';

  if (analysisData.length === 0) {
    const option = document.createElement('option');
    option.textContent =
      typeof t === 'function' ? t('status.noAnalyses') : 'Keine Analysen vorhanden';
    option.value = '';
    elSelector.appendChild(option);
    return;
  }

  analysisData.forEach((analysis) => {
    const option = document.createElement('option');
    option.textContent = analysis.name;
    option.value = analysis.id;
    if (analysis.id === activeAnalysisId) {
      option.selected = true;
    }
    elSelector.appendChild(option);
  });
}

function fillAnalysisForm(analysis) {
  const elNameDisplay = document.getElementById('analysisNameDisplay');
  const elName = document.getElementById('inputAnalysisName');
  const elDesc = document.getElementById('inputDescription');
  const elUse = document.getElementById('inputIntendedUse');
  const elAuthor = document.getElementById('inputAuthorName');
  const elMetadata = document.getElementById('analysisMetadata');

  if (elNameDisplay) elNameDisplay.textContent = analysis.name;
  if (elName) elName.value = analysis.name;
  if (elDesc) elDesc.value = analysis.description;
  if (elUse) elUse.value = analysis.intendedUse;
  if (elAuthor) elAuthor.value = analysis.metadata.author;

  if (elMetadata) {
    const _lv = typeof t === 'function' ? t('meta.version') : 'Version';
    const _la = typeof t === 'function' ? t('meta.author') : 'Autor';
    const _ld = typeof t === 'function' ? t('meta.date') : 'Datum';
    elMetadata.innerHTML = `
            <span>${_lv}: ${escapeHtml(analysis.metadata.version)}</span> | 
            <span>${_la}: ${escapeHtml(analysis.metadata.author)}</span> | 
            <span>${_ld}: ${escapeHtml(analysis.metadata.date)}</span>
        `;
  }

  renderOverviewLists(analysis);

  // Also update overview if currently visible
  renderOverview(analysis);
}

function resizeOverviewTextareas() {
  document.querySelectorAll('.overview-details-grid textarea').forEach((input) => {
    if (!input.getClientRects().length) return;
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight + 2}px`;
  });
}

function labelOverviewListItems(field) {
  const label = t(`overview.${field.dataset.overviewList}`);
  field.querySelectorAll('li').forEach((item, index) => {
    const name = tf('overview.listItem', { field: label, number: index + 1 });
    item.querySelector('textarea').setAttribute('aria-label', name);
    item.querySelector('button').setAttribute('aria-label', `${t('overview.removeItem')}: ${name}`);
  });
}

function appendOverviewListItem(field, value = '') {
  const item = document.createElement('li');
  const row = document.createElement('div');
  row.className = 'overview-list-row';
  const input = document.createElement('textarea');
  input.rows = 2;
  input.value = value;
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'action-button';
  remove.dataset.listRemove = '';
  remove.textContent = '×';
  remove.title = t('overview.removeItem');
  row.append(input, remove);
  item.appendChild(row);
  field.querySelector('ul').appendChild(item);
  labelOverviewListItems(field);
  return input;
}

function renderOverviewLists(analysis) {
  document.querySelectorAll('[data-overview-list]').forEach((field) => {
    field.querySelector('ul').replaceChildren();
    const items = normalizeOverviewList(analysis[field.dataset.overviewList]);
    // A blank first row makes an empty list immediately editable.
    (items.length ? items : ['']).forEach((value) => appendOverviewListItem(field, value));
  });
}

function initOverviewDetailsListeners() {
  const details = document.querySelector('.overview-details-grid');
  if (!details) return;
  details.addEventListener('input', () => {
    resizeOverviewTextareas();
    saveCurrentAnalysisState();
  });
  details.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    const field = button?.closest('[data-overview-list]');
    if (!field) return;
    if (button.hasAttribute('data-list-add')) {
      appendOverviewListItem(field).focus();
    } else if (button.hasAttribute('data-list-remove')) {
      const item = button.closest('li');
      const next = item.nextElementSibling || item.previousElementSibling;
      item.remove();
      labelOverviewListItems(field);
      (next?.querySelector('textarea') || field.querySelector('[data-list-add]')).focus();
      saveCurrentAnalysisState();
    }
    resizeOverviewTextareas();
  });
  // Reflow when the viewport or surrounding layout changes width.
  const observer = new ResizeObserver(resizeOverviewTextareas);
  observer.observe(details);
}

// Image uploads belong to the analysis selected when the file was chosen.
// Tokens prevent an older read from overwriting a replacement or removal.
const overviewImageReads = new WeakMap();
const OVERVIEW_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

function isOverviewImage(image) {
  return (
    image &&
    typeof image.name === 'string' &&
    typeof image.dataUrl === 'string' &&
    image.dataUrl.length <= Math.ceil(OVERVIEW_IMAGE_MAX_BYTES / 3) * 4 + 32 &&
    /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(image.dataUrl)
  );
}

function renderOverviewImages(analysis) {
  document.querySelectorAll('[data-overview-image]').forEach((field) => {
    const key = field.dataset.overviewImage;
    const saved = analysis[key];
    const hasImage = !!isOverviewImage(saved);
    const preview = field.querySelector('img');
    preview.alt = t(`overview.${key}`);
    preview.hidden = !hasImage;
    if (hasImage) {
      if (preview.getAttribute('src') !== saved.dataUrl) preview.src = saved.dataUrl;
    } else {
      preview.removeAttribute('src');
    }
    field.querySelector('.overview-image-preview span').hidden = hasImage;
    field.querySelector('.overview-image-name').textContent = hasImage ? saved.name : '';
    field.querySelector('[data-image-remove]').disabled = !saved;
    field.querySelector('input').value = '';
  });
}

function storeOverviewImage(analysis, key, image) {
  const previous = analysis[key];
  analysis[key] = image;
  // Roll back a failed save so the preview never claims an image was persisted.
  if (!saveAnalyses()) analysis[key] = previous;
  if (getActiveAnalysis() === analysis) renderOverviewImages(analysis);
}

function optimizeOverviewImage(decoded, image) {
  // Base64 images share localStorage with analyses and version history. Keep
  // large uploads within the previous per-image storage budget.
  const maxDataUrlLength = Math.ceil((1024 * 1024) / 3) * 4 + 32;
  if (image.dataUrl.length <= maxDataUrlLength) return image;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Image optimization unavailable');
  let scale = Math.min(1, 4096 / Math.max(decoded.naturalWidth, decoded.naturalHeight));
  for (;;) {
    canvas.width = Math.max(1, Math.round(decoded.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(decoded.naturalHeight * scale));
    context.drawImage(decoded, 0, 0, canvas.width, canvas.height);
    // Prefer lossless PNG for diagrams and text; preserve transparency in WebP.
    let dataUrl = canvas.toDataURL('image/png');
    if (dataUrl.length > maxDataUrlLength) dataUrl = canvas.toDataURL('image/webp', 0.9);
    if (dataUrl.length <= maxDataUrlLength) {
      const optimized = { ...image, dataUrl };
      if (!isOverviewImage(optimized)) throw new Error('Invalid optimized image');
      return optimized;
    }
    if (canvas.width === 1 && canvas.height === 1) throw new Error('Image optimization failed');
    scale *= 0.8;
  }
}

function initOverviewImageListeners() {
  document.querySelectorAll('[data-overview-image]').forEach((field) => {
    const key = field.dataset.overviewImage;
    const input = field.querySelector('input');
    input.addEventListener('change', () => {
      const analysis = getActiveAnalysis();
      const file = input.files[0];
      input.value = '';
      if (!analysis || !file) return;

      let reads = overviewImageReads.get(analysis);
      if (!reads) {
        reads = new Map();
        overviewImageReads.set(analysis, reads);
      }
      const token = {};
      reads.set(key, token);
      const isCurrent = () => reads.get(key) === token && analysisData.includes(analysis);
      const fail = (message) => {
        if (isCurrent()) showToast(t(message), 'error');
      };

      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        fail('overview.imageInvalid');
        return;
      }
      if (file.size > OVERVIEW_IMAGE_MAX_BYTES) {
        fail('overview.imageTooLarge');
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => fail('overview.imageReadError');
      reader.onload = () => {
        if (!isCurrent()) return;
        const image = { name: file.name, dataUrl: reader.result };
        if (!isOverviewImage(image)) {
          fail('overview.imageInvalid');
          return;
        }
        // Decode before saving: an image MIME type alone does not prove validity.
        const decoded = new Image();
        decoded.onerror = () => fail('overview.imageInvalid');
        decoded.onload = () => {
          if (!isCurrent()) return;
          try {
            storeOverviewImage(analysis, key, optimizeOverviewImage(decoded, image));
          } catch (_) {
            fail('overview.imageReadError');
          }
        };
        decoded.src = image.dataUrl;
      };
      reader.readAsDataURL(file);
    });

    field.querySelector('[data-image-remove]').addEventListener('click', () => {
      const analysis = getActiveAnalysis();
      if (!analysis) return;
      overviewImageReads.get(analysis)?.delete(key);
      storeOverviewImage(analysis, key, null);
    });
  });
}

// Both pies use the same counts as the dashboard, so each slice represents
// assessed attack trees, rather than a sum of their numeric risk scores.
function renderOverviewRiskChart(containerId, distribution, riskCount) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const levels = [
    ['Kritisch', 'label.critical', '#c0392b'],
    ['Hoch', 'label.high', '#e67e22'],
    ['Mittel', 'label.medium', '#f39c12'],
    ['Niedrig', 'label.low', '#27ae60'],
  ];
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const percentage = new Intl.NumberFormat(document.documentElement.lang || 'de', {
    style: 'percent',
    maximumFractionDigits: 1,
  });
  const body = document.createElement('div');
  body.className = 'risk-chart-body';
  const pie = document.createElement('div');
  pie.className = 'risk-pie';
  pie.setAttribute('role', 'img');
  const legend = document.createElement('ul');
  legend.className = 'risk-chart-legend';
  const stops = [];
  const descriptions = [];
  let cumulative = 0;

  levels.forEach(([level, labelKey, color]) => {
    const count = distribution[level];
    const share = total ? count / total : 0;
    const label = t(labelKey);
    const formattedShare = percentage.format(share);
    if (count > 0) {
      stops.push(
        `${color} ${(cumulative / total) * 100}% ${((cumulative + count) / total) * 100}%`
      );
      cumulative += count;
    }

    const row = document.createElement('li');
    const swatch = document.createElement('span');
    swatch.className = 'risk-chart-swatch';
    swatch.style.backgroundColor = color;
    swatch.setAttribute('aria-hidden', 'true');
    const name = document.createElement('span');
    name.textContent = label;
    const value = document.createElement('span');
    value.className = 'risk-chart-value';
    value.textContent = `${count} (${formattedShare})`;
    row.append(swatch, name, value);
    legend.appendChild(row);
    descriptions.push(`${label}: ${count} (${formattedShare})`);
  });

  if (total) {
    pie.style.background = `conic-gradient(${stops.join(', ')})`;
  } else {
    const empty = document.createElement('span');
    empty.textContent = t('overview.noAssessedRisks');
    pie.appendChild(empty);
  }
  const title = document.getElementById(`${containerId}Title`)?.textContent || '';
  pie.setAttribute(
    'aria-label',
    `${title}: ${total ? descriptions.join(', ') : t('overview.noAssessedRisks')}`
  );
  const summary = document.createElement('p');
  summary.className = 'risk-chart-summary';
  summary.id = `${containerId}Summary`;
  summary.textContent = tf('overview.assessedRisks', { n: total });
  if (riskCount > total) {
    summary.textContent += ` · ${tf('overview.unassessedRisks', { n: riskCount - total })}`;
  }
  pie.setAttribute('aria-describedby', summary.id);
  body.append(pie, legend);
  container.replaceChildren(body, summary);
}

// Extended function for the overview (dashboard)
function renderOverview(analysis) {
  if (!analysis) return;

  renderOverviewImages(analysis);
  resizeOverviewTextareas();

  // 1. Simple counters
  const elAssetCount = document.getElementById('statAssetCount');
  const elDSCount = document.getElementById('statDSCount');
  const elRiskCount = document.getElementById('statRiskCount');

  if (elAssetCount) elAssetCount.textContent = (analysis.assets || []).length;
  if (elDSCount) elDSCount.textContent = (analysis.damageScenarios || []).length;

  const risks = analysis.riskEntries || [];
  if (elRiskCount) elRiskCount.textContent = risks.length;

  // 2. Detailed risk categorization (uses global RISK_THRESHOLDS via getRiskMeta)
  const dist = { Kritisch: 0, Hoch: 0, Mittel: 0, Niedrig: 0 };

  risks.forEach((r) => {
    const val = parseFloat(r.rootRiskValue);
    if (isNaN(val)) return;
    const label = getRiskMeta(val).label;
    if (label in dist) dist[label]++;
  });

  // Write values to the new fields
  const elCrit = document.getElementById('statCrit');
  const elHigh = document.getElementById('statHigh');
  const elMed = document.getElementById('statMed');
  const elLow = document.getElementById('statLow');

  if (elCrit) elCrit.textContent = dist['Kritisch'];
  if (elHigh) elHigh.textContent = dist['Hoch'];
  if (elMed) elMed.textContent = dist['Mittel'];
  if (elLow) elLow.textContent = dist['Niedrig'];

  // 3. Residual risk distribution (based on residual risk root per attack tree)
  // If residual risk does not exist yet, it will be synced automatically.
  try {
    if (typeof ensureResidualRiskSynced === 'function') {
      ensureResidualRiskSynced(analysis);
    }
  } catch (e) {
    console.warn('[renderOverview] Residual risk sync error:', e);
  }

  const rrDist = { Kritisch: 0, Hoch: 0, Mittel: 0, Niedrig: 0 };

  risks.forEach((r) => {
    if (!r?.uid) return;
    let val = NaN;
    try {
      if (typeof computeResidualTreeMetrics === 'function') {
        const m = computeResidualTreeMetrics(analysis, r.uid);
        if (m && m.riskValue !== undefined) val = parseFloat(m.riskValue);
      }
    } catch (e) {
      console.warn('[renderOverview] computeResidualTreeMetrics error for uid', r.uid, e);
    }
    if (isNaN(val)) {
      val = parseFloat(r.rootRiskValue);
    }
    if (isNaN(val)) return;

    const label = getRiskMeta(val).label;
    if (label in rrDist) rrDist[label]++;
  });

  const elRRCrit = document.getElementById('statRRCrit');
  const elRRHigh = document.getElementById('statRRHigh');
  const elRRMed = document.getElementById('statRRMed');
  const elRRLow = document.getElementById('statRRLow');

  if (elRRCrit) elRRCrit.textContent = rrDist['Kritisch'];
  if (elRRHigh) elRRHigh.textContent = rrDist['Hoch'];
  if (elRRMed) elRRMed.textContent = rrDist['Mittel'];
  if (elRRLow) elRRLow.textContent = rrDist['Niedrig'];

  renderOverviewRiskChart('unmitigatedRiskChart', dist, risks.length);
  renderOverviewRiskChart('residualRiskChart', rrDist, risks.length);
}

// =============================================================
// --- IMPORT / EXPORT LOGIC ---
// =============================================================

function exportAnalysis() {
  const analysis = getActiveAnalysis();
  if (!analysis) {
    showToast(
      typeof t === 'function'
        ? t('toast.noAnalysisExport')
        : 'Keine aktive Analyse zum Exportieren.',
      'warning'
    );
    return;
  }

  const dataStr = JSON.stringify(analysis, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  const safeName = analysis.name.replace(/[^a-zA-Z0-9_\-]/g, '_');
  a.download = `TARA_Export_${safeName}_${analysis.metadata.date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(typeof t === 'function' ? t('toast.exported') : 'Analyse exportiert.', 'success');
}

function executeImport() {
  const elFileInput = document.getElementById('importFileInput');
  const elModal = document.getElementById('importAnalysisModal');

  if (!elFileInput || !elFileInput.files[0]) {
    showToast(
      typeof t === 'function' ? t('toast.pickFile') : 'Bitte eine Datei auswählen.',
      'warning'
    );
    return;
  }

  const file = elFileInput.files[0];
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const json = JSON.parse(ev.target.result);

      // Support both single objects and arrays of analyses
      const items = Array.isArray(json) ? json : [json];
      const imported = [];

      for (const item of items) {
        if (!item || !item.id || !item.metadata) {
          console.warn('Importfehler: Element übersprungen (fehlt id/metadata)', item);
          continue;
        }

        if (analysisData.some((a) => a.id === item.id)) {
          item.id = item.id + '_imp_' + Date.now();
          item.name = (item.name || 'Import') + ' (Imported)';
        }

        analysisData.push(item);
        migrateAnalysis(item);
        imported.push(item);
      }

      if (imported.length > 0) {
        saveAnalyses();
        renderAnalysisSelector();
        // Activate the last imported analysis
        activateAnalysis(imported[imported.length - 1].id);

        if (elModal) elModal.style.display = 'none';
        const names = imported.map((a) => a.name).join(', ');
        showToast(
          typeof tf === 'function'
            ? tf('toast.importOk', { n: imported.length, names })
            : `${imported.length} Analyse(n) importiert: ${names}`,
          'success'
        );
      } else {
        showToast(
          typeof t === 'function'
            ? t('toast.importBadStruct')
            : 'Importfehler: Ungültige Datenstruktur.',
          'error'
        );
      }
    } catch (error) {
      console.error('Importfehler:', error);
      showToast(
        typeof t === 'function' ? t('toast.importBadJson') : 'Importfehler: Ungültiges JSON.',
        'error'
      );
    }
  };
  reader.readAsText(file);
}

// =============================================================
// --- NEW ANALYSIS LOGIC ---
// =============================================================

/**
 * Initializes the "New Analysis" dialog (reset/populate the copy selection).
 * Used when opening and closing the modal.
 */
function prepareNewAnalysisModal() {
  const group = document.getElementById('copyExistingAnalysisGroup');
  const select = document.getElementById('copyExistingAnalysisSelect');
  const btn = document.getElementById('btnToggleCopyExistingAnalysis');

  if (group) group.style.display = 'none';
  if (btn) btn.textContent = typeof t === 'function' ? t('newAnalysis.copy') : 'Kopieren';

  if (!select) return;

  // Rebuild options (current list of analyses)
  select.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent =
    typeof t === 'function' ? t('newAnalysis.templatePh') : 'Bitte Vorlage wählen…';
  select.appendChild(placeholder);

  (analysisData || []).forEach((a) => {
    // Only valid analyses
    if (!a || !a.id) return;
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.name || a.id;
    select.appendChild(opt);
  });
}

function toggleCopyExistingAnalysisUI() {
  const group = document.getElementById('copyExistingAnalysisGroup');
  const btn = document.getElementById('btnToggleCopyExistingAnalysis');
  const select = document.getElementById('copyExistingAnalysisSelect');
  if (!group) return;

  const willShow = group.style.display === 'none' || group.style.display === '';
  group.style.display = willShow ? 'block' : 'none';

  if (btn)
    btn.textContent = willShow
      ? typeof t === 'function'
        ? t('newAnalysis.copyHide')
        : 'Kopieren ausblenden'
      : typeof t === 'function'
        ? t('newAnalysis.copy')
        : 'Kopieren';
  if (willShow) {
    // On first open, ensure options are up to date
    prepareNewAnalysisModal();
    // Then make visible again (prepareNewAnalysisModal hides it)
    group.style.display = 'block';
    if (btn)
      btn.textContent = typeof t === 'function' ? t('newAnalysis.copyHide') : 'Kopieren ausblenden';
    if (select) select.focus();
  } else {
    if (select) select.value = '';
  }
}

function createNewAnalysis(e) {
  e.preventDefault();

  // Explicit element selection for safety
  const nameInput = document.getElementById('newAnalysisName');
  const modal = document.getElementById('newAnalysisModal');

  const newName = nameInput ? nameInput.value.trim() : '';
  if (!newName) return;

  // Generate collision-safe unique ID using UUID
  const newId = 'tara-' + generateUID('id').replace('id_', '');

  // Optional: copy from existing analysis
  const copyGroup = document.getElementById('copyExistingAnalysisGroup');
  const copySelect = document.getElementById('copyExistingAnalysisSelect');
  const copySourceId =
    copyGroup && copyGroup.style.display !== 'none' && copySelect ? copySelect.value || '' : '';

  let newAnalysis;
  let copySourceName = '';

  if (copySourceId) {
    const source = analysisData.find((a) => a.id === copySourceId);
    if (source) {
      copySourceName = source.name || source.id;
      newAnalysis = JSON.parse(JSON.stringify(source));
    }
  }

  // Fallback: default structure
  if (!newAnalysis) {
    newAnalysis = createDefaultAnalysis();
  }

  const today = getTodayISO();
  newAnalysis.id = newId;
  newAnalysis.name = newName;
  // Reset metadata/history for new analysis
  if (!newAnalysis.metadata)
    newAnalysis.metadata = {
      version: INITIAL_VERSION,
      author: typeof t === 'function' ? t('analysis.unknownAuthor') : 'Unbekannt',
      date: today,
    };
  newAnalysis.metadata.version = INITIAL_VERSION;
  newAnalysis.metadata.date = today;

  // Initialize history (do not carry over old history)
  newAnalysis.history = [
    {
      version: INITIAL_VERSION,
      date: today,
      author:
        newAnalysis.metadata && newAnalysis.metadata.author
          ? newAnalysis.metadata.author
          : 'System',
      comment: copySourceName
        ? typeof tf === 'function'
          ? tf('history.copyFrom', { name: copySourceName })
          : `Kopie von: ${copySourceName}`
        : typeof t === 'function'
          ? t('history.initial')
          : 'Initiale Erstellung',
      state: {
        name: newName,
        metadata: { ...(newAnalysis.metadata || {}), version: INITIAL_VERSION, date: today },
        description: newAnalysis.description || '',
        intendedUse: newAnalysis.intendedUse || '',
        productVariants: normalizeOverviewList(newAnalysis.productVariants),
        functions: normalizeOverviewList(newAnalysis.functions),
        potentialMisuseCases: normalizeOverviewList(newAnalysis.potentialMisuseCases),
        assumptions: normalizeOverviewList(newAnalysis.assumptions),
        architectureImage: newAnalysis.architectureImage
          ? { ...newAnalysis.architectureImage }
          : null,
        componentsImage: newAnalysis.componentsImage ? { ...newAnalysis.componentsImage } : null,
        assets: JSON.parse(JSON.stringify(newAnalysis.assets || [])),
        damageScenarios: JSON.parse(
          JSON.stringify(
            newAnalysis.damageScenarios || JSON.parse(JSON.stringify(DEFAULT_DAMAGE_SCENARIOS))
          )
        ),
        impactMatrix: JSON.parse(JSON.stringify(newAnalysis.impactMatrix || {})),
        impactComments: JSON.parse(JSON.stringify(newAnalysis.impactComments || {})),
        riskEntries: JSON.parse(JSON.stringify(newAnalysis.riskEntries || [])),
        securityGoals: JSON.parse(JSON.stringify(newAnalysis.securityGoals || [])),
        residualRisk: JSON.parse(JSON.stringify(newAnalysis.residualRisk || { leaves: {} })),
      },
    },
  ];

  // Keep name consistent in initial history
  if (newAnalysis.history && newAnalysis.history[0] && newAnalysis.history[0].state) {
    newAnalysis.history[0].state.name = newName;
  }

  // Save data and update UI
  analysisData.push(newAnalysis);
  renderAnalysisSelector();
  activateAnalysis(newId);
  saveAnalyses();

  // Close modal and provide feedback
  if (modal) modal.style.display = 'none';
  showToast(
    typeof tf === 'function'
      ? tf('toast.analysisCreated', { name: newName })
      : `Analyse "${newName}" wurde erstellt.`,
    'success'
  );
}

/**
 * Initializes event listeners for analysis_core modals and buttons.
 * Called from the central DOMContentLoaded handler in init.js.
 */
function initAnalysisCoreListeners() {
  initOverviewDetailsListeners();
  initOverviewImageListeners();
  const form = document.getElementById('newAnalysisForm');
  const modal = document.getElementById('newAnalysisModal');
  const closeBtn = document.getElementById('closeNewAnalysisModal');
  const btnToggleCopy = document.getElementById('btnToggleCopyExistingAnalysis');
  const closeImport = document.getElementById('closeImportAnalysisModal');
  const importModal = document.getElementById('importAnalysisModal');

  // Submit handler (create)
  if (form) {
    form.onsubmit = createNewAnalysis;
  }

  // X button close (bugfix: previously missing handler)
  if (closeBtn && modal) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      if (form) form.reset();
      prepareNewAnalysisModal();
    };
  }

  // Click on dark overlay also closes
  if (modal) {
    window.addEventListener('click', (ev) => {
      if (ev.target === modal) {
        modal.style.display = 'none';
        if (form) form.reset();
        prepareNewAnalysisModal();
      }
    });
  }

  // Copy UI
  if (btnToggleCopy) {
    btnToggleCopy.onclick = () => {
      toggleCopyExistingAnalysisUI();
    };
  }

  // Import modal close button (moved from top-level scope into DOMContentLoaded)
  if (closeImport && importModal) {
    closeImport.onclick = () => {
      importModal.style.display = 'none';
    };
  }

  // Initial reset
  prepareNewAnalysisModal();
}

/**
 * Deletes the currently active analysis after user confirmation.
 */
function deleteActiveAnalysis() {
  if (!activeAnalysisId) return;

  const analysis = getActiveAnalysis();
  if (!analysis) return;

  // Use existing confirmation modal
  const modal = document.getElementById('confirmationModal');
  const title = document.getElementById('confirmationTitle');
  const msg = document.getElementById('confirmationMessage');
  const btnConfirm = document.getElementById('btnConfirmAction');
  const btnCancel = document.getElementById('btnCancelConfirmation');
  const btnClose = document.getElementById('closeConfirmationModal');

  if (!modal) {
    console.warn('[deleteActiveAnalysis] Confirmation modal not found in DOM.');
    return;
  }

  if (title)
    title.textContent =
      typeof t === 'function' ? t('analysis.delete.title') : 'Gesamte Analyse löschen';
  if (msg) {
    msg.innerHTML =
      typeof tf === 'function'
        ? tf('analysis.delete.message', { name: escapeHtml(analysis.name) })
        : `Sind Sie sicher, dass Sie die Analyse <strong>${escapeHtml(analysis.name)}</strong> unwiderruflich löschen möchten? <br><br><span style="color:red;">Warnung: Alle Assets, Schadensszenarien und Angriffsbäume gehen verloren!</span>`;
  }

  // Reset button state (important since the confirmation modal is used for multiple actions)
  if (btnConfirm) {
    btnConfirm.className = 'primary-button';
    btnConfirm.classList.add('dangerous');
    btnConfirm.textContent =
      typeof t === 'function' ? t('analysis.delete.confirm') : 'Ja, alles löschen';
  }

  modal.style.display = 'block';

  // Remove previous handlers to prevent conflicts with other confirmations
  if (btnConfirm) btnConfirm.onclick = null;
  if (btnCancel) btnCancel.onclick = null;
  if (btnClose) btnClose.onclick = null;

  // Confirmation event handler
  if (btnConfirm)
    btnConfirm.onclick = () => {
      // Remove from list
      analysisData = analysisData.filter((a) => a.id !== activeAnalysisId);

      // If no analyses remain, create fresh default analysis
      if (analysisData.length === 0) {
        analysisData = [createDefaultAnalysis()];
      }

      // Select the next available analysis (first in list)
      const nextId = analysisData[0].id;

      // Save and update UI
      saveAnalyses();
      renderAnalysisSelector();
      activateAnalysis(nextId);

      modal.style.display = 'none';
      showToast(
        typeof t === 'function'
          ? t('toast.analysisDeleted')
          : 'Analyse wurde erfolgreich gelöscht.',
        'success'
      );
    };

  // Cancel
  if (btnCancel)
    btnCancel.onclick = () => {
      modal.style.display = 'none';
    };

  if (btnClose)
    btnClose.onclick = () => {
      modal.style.display = 'none';
    };
}

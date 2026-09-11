/**
 * @file        impact_matrix.js
 * @description Impact matrix rendering and color-coded assessment grid
 * @author      Nico Peper
 * @organization SCHUNK SE & Co. KG
 * @copyright   2026 SCHUNK SE & Co. KG
 * @license     GPL-3.0
 */

// Explicit DOM reference (more robust than implicit window ID globals)
const dsMatrixContainer = document.getElementById('dsMatrixContainer');

/* global IMPACT_CSS_CLASSES, VALID_IMPACT_VALUES, IMPACT_LABELS */
function getImpactColorClass(val) {
  return (typeof IMPACT_CSS_CLASSES !== 'undefined' && IMPACT_CSS_CLASSES[val]) || '';
}

function _impactCommentEntry(analysis, assetId, dsId) {
  const value = analysis?.impactComments?.[assetId]?.[dsId];
  if (!value) return null;
  if (typeof value === 'object') return value;
  return { text: String(value) };
}

function _getLocalizedImpactComment(analysis, assetId, dsId, opts) {
  const entry = _impactCommentEntry(analysis, assetId, dsId);
  if (!entry) return '';
  if (typeof getLocalizedField === 'function') {
    return getLocalizedField(entry, 'text', undefined, opts || undefined);
  }
  return entry.text || '';
}

function _setLocalizedImpactComment(analysis, assetId, dsId, value) {
  if (!analysis.impactComments) analysis.impactComments = {};
  if (!analysis.impactComments[assetId]) analysis.impactComments[assetId] = {};

  const existing = _impactCommentEntry(analysis, assetId, dsId) || { text: '' };
  if (typeof setLocalizedField === 'function') setLocalizedField(existing, 'text', value);
  else existing.text = value == null ? '' : String(value);

  const hasDe = !!String(existing.text || '').trim();
  const hasEn = !!String(existing.text_en || '').trim();
  if (hasDe || hasEn) {
    analysis.impactComments[assetId][dsId] = existing;
  } else {
    delete analysis.impactComments[assetId][dsId];
    if (Object.keys(analysis.impactComments[assetId]).length === 0) {
      delete analysis.impactComments[assetId];
    }
  }
}

/**
 * Recalculates impact inheritance, worst-case KSTU and risk score
 * for every riskEntry in the given analysis.
 * Called whenever the impact matrix changes so that stored tree data
 * stays in sync without requiring the user to open & save each tree.
 */
function _recalcAllRiskEntries(analysis) {
  if (!analysis || !Array.isArray(analysis.riskEntries) || analysis.riskEntries.length === 0)
    return;

  let changed = false;
  analysis.riskEntries.forEach((entry) => {
    try {
      if (typeof applyImpactInheritance === 'function') applyImpactInheritance(entry, analysis);
      if (typeof applyWorstCaseInheritance === 'function') applyWorstCaseInheritance(entry);
      const newRisk = _computeRiskScore(entry.kstu, entry.i_norm).toFixed(2);
      if (entry.rootRiskValue !== newRisk) {
        entry.rootRiskValue = newRisk;
        changed = true;
      }
    } catch (e) {
      console.warn('[ImpactMatrix] recalc riskEntry', entry.id, e.message || e);
    }
  });

  if (changed) saveAnalyses();
}

window.updateImpactScore = function (assetId, dsId, newValue, selectElement) {
  const analysis = getActiveAnalysis();
  if (!analysis) return;

  // Validate input
  if (!VALID_IMPACT_VALUES.includes(newValue)) {
    showToast(
      typeof tf === 'function'
        ? tf('toast.impactInvalid', { value: newValue })
        : `Ungültiger Impact-Wert: ${newValue}`,
      'warning'
    );
    return;
  }

  if (!analysis.impactMatrix) analysis.impactMatrix = {};
  if (!analysis.impactMatrix[assetId]) {
    analysis.impactMatrix[assetId] = {};
  }

  analysis.impactMatrix[assetId][dsId] = newValue;

  // Update color live
  if (selectElement) {
    selectElement.className = 'impact-select ' + getImpactColorClass(newValue);
  }

  saveAnalyses();

  // Recalculate all attack trees (impact depends on matrix values)
  _recalcAllRiskEntries(analysis);

  showToast(
    typeof tf === 'function'
      ? tf('toast.impactSet', { assetId, dsId, value: newValue })
      : `Impact für ${assetId}/${dsId} auf ${newValue} gesetzt.`,
    'info'
  );

  const riskTab = document.getElementById('tabRiskAnalysis');
  if (riskTab && riskTab.classList.contains('active')) {
    if (typeof renderRiskAnalysis === 'function') renderRiskAnalysis();
  }
};

function renderImpactMatrix() {
  const analysis = getActiveAnalysis();
  if (!analysis) return;
  if (!dsMatrixContainer) return;
  const _t = (k) => (typeof t === 'function' ? t(k) : k);
  const _isDefaultDs = (ds) => {
    if (!ds || !ds.id) return false;
    if (typeof DEFAULT_DS_IDS !== 'undefined' && DEFAULT_DS_IDS instanceof Set)
      return DEFAULT_DS_IDS.has(ds.id);
    return (
      Array.isArray(DEFAULT_DAMAGE_SCENARIOS) &&
      DEFAULT_DAMAGE_SCENARIOS.some((d) => d.id === ds.id)
    );
  };
  const _loc = (obj, field) => {
    if (typeof getLocalizedField !== 'function') return obj?.[field] || '';
    // Standard-DS: plain fallback (kein „(DE)“), Custom: Paren wenn EN fehlt
    return (
      getLocalizedField(
        obj,
        field,
        undefined,
        _isDefaultDs(obj) ? { fallback: true } : undefined
      ) ||
      obj?.[field] ||
      obj?.[field + '_en'] ||
      ''
    );
  };

  if (!analysis.assets || analysis.assets.length === 0) {
    dsMatrixContainer.innerHTML = `<h4>${_t('ds.matrixTitle')}</h4><p class="muted-hint" style="text-align: center; padding: 20px;">${_t('ds.needAssets')}</p>`;
    return;
  }

  let displayDS = JSON.parse(JSON.stringify(DEFAULT_DAMAGE_SCENARIOS));
  const defaultIds = new Set(displayDS.map((d) => d.id));

  if (analysis.damageScenarios) {
    analysis.damageScenarios.forEach((ds) => {
      if (!defaultIds.has(ds.id)) displayDS.push(ds);
    });
  }
  displayDS.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' })
  );

  if (displayDS.length === 0) {
    dsMatrixContainer.innerHTML = `<h4>${_t('ds.matrixTitle')}</h4><p class="muted-hint" style="text-align: center; padding: 20px;">${_t('ds.needDs')}</p>`;
    return;
  }

  const total = analysis.assets.length * displayDS.length;
  const completed = analysis.assets.reduce(
    (count, asset) =>
      count + displayDS.filter((ds) => !!getImpactComment(analysis, asset.id, ds.id)).length,
    0
  );
  let html = `<p class="muted-hint">${_t('impact.comment.requiredHint')}</p>`;
  html += `<p class="impact-comment-progress" aria-live="polite">${tf('impact.comment.progress', { completed, total })}</p>`;
  html += '<div class="impact-matrix-scroll"><table class="impact-matrix-table">';
  html += `<thead><tr><th scope="col" class="asset-col">${_t('ds.matrix.assetCol')}</th>`;
  displayDS.forEach((ds) => {
    const title = escapeHtml(`${_loc(ds, 'name')}: ${_loc(ds, 'description')}`);
    html += `<th scope="col" class="ds-col" title="${title}"><div class="vertical-text">${escapeHtml(ds.id)} (${escapeHtml(_loc(ds, 'short'))})</div></th>`;
  });
  html += '</tr></thead><tbody>';
  analysis.assets.forEach((asset) => {
    const assetId = escapeHtml(asset.id);
    html += `<tr><th scope="row" class="asset-col" title="${escapeHtml(_loc(asset, 'description'))}">${assetId}: ${escapeHtml(_loc(asset, 'name'))}</th>`;
    displayDS.forEach((ds) => {
      const dsId = escapeHtml(ds.id);
      const value = String(analysis.impactMatrix?.[asset.id]?.[ds.id] || 'N/A');
      const comment = getImpactComment(analysis, asset.id, ds.id);
      const label = `${tf('impact.comment.title', { assetId: asset.id, dsId: ds.id })}: ${_t(comment ? 'impact.comment.edit' : 'impact.comment.required')}`;
      const options = VALID_IMPACT_VALUES.map((v) => {
        const name = IMPACT_LABELS[v] || v;
        return `<option value="${escapeHtml(v)}"${value === v ? ' selected' : ''}>${escapeHtml(v === name ? v : `${v} (${name})`)}</option>`;
      }).join('');
      html += `<td class="score-cell"><div class="impact-cell-wrap">
        <select class="impact-select ${getImpactColorClass(value)}" data-asset-id="${assetId}" data-ds-id="${dsId}"
          aria-label="${escapeHtml(_t('impact.rating'))}: ${assetId} / ${dsId}">${options}</select>
        <button type="button" class="impact-comment-btn ${comment ? 'has-comment' : 'needs-comment'}"
          data-asset-id="${assetId}" data-ds-id="${dsId}" aria-haspopup="dialog"
          aria-label="${escapeHtml(label)}" title="${escapeHtml(comment || label)}">
          <span aria-hidden="true">…</span><span class="impact-comment-marker" aria-hidden="true">${comment ? '✓' : '*'}</span>
        </button>
      </div></td>`;
    });
    html += '</tr>';
  });
  dsMatrixContainer.innerHTML = html + '</tbody></table></div>';
  dsMatrixContainer.querySelectorAll('select').forEach((select) => {
    select.addEventListener('change', () => {
      window.updateImpactScore(select.dataset.assetId, select.dataset.dsId, select.value, select);
    });
  });
  dsMatrixContainer.querySelectorAll('.impact-comment-btn').forEach((button) => {
    button.addEventListener('click', () =>
      window.openImpactComment(button.dataset.assetId, button.dataset.dsId)
    );
  });
}

function validateImpactComments(analysis) {
  for (const asset of analysis.assets || []) {
    for (const ds of getDisplayDamageScenarios(analysis)) {
      if (getImpactComment(analysis, asset.id, ds.id)) continue;
      document.querySelector('[data-tab="tabDamageScenarios"]')?.click();
      window.openImpactComment(asset.id, ds.id);
      showToast(tf('impact.comment.requiredFor', { assetId: asset.id, dsId: ds.id }), 'warning');
      return false;
    }
  }
  return true;
}

window.openImpactComment = function (assetId, dsId) {
  const analysis = getActiveAnalysis();
  if (!analysis) return;

  const modal = document.getElementById('impactCommentModal');
  const titleEl = document.getElementById('impactCommentTitle');
  const textEl = document.getElementById('impactCommentText');
  const assetField = document.getElementById('impactCommentAssetId');
  const dsField = document.getElementById('impactCommentDsId');
  if (!modal || !textEl) return;

  const existing = _getLocalizedImpactComment(analysis, assetId, dsId, { raw: true });

  if (titleEl) {
    titleEl.textContent =
      typeof tf === 'function'
        ? tf('impact.comment.title', { assetId, dsId })
        : `Kommentar – ${assetId} / ${dsId}`;
  }
  textEl.value = existing || getImpactComment(analysis, assetId, dsId);
  textEl.setCustomValidity('');
  if (typeof syncLocalizedInputHint === 'function') {
    syncLocalizedInputHint(textEl, _impactCommentEntry(analysis, assetId, dsId) || {}, 'text', '');
  }
  if (assetField) assetField.value = assetId;
  if (dsField) dsField.value = dsId;

  modal.style.display = 'block';
  textEl.focus();
};

window.saveImpactComment = function () {
  const analysis = getActiveAnalysis();
  if (!analysis) return;

  const modal = document.getElementById('impactCommentModal');
  const textEl = document.getElementById('impactCommentText');
  const assetId = document.getElementById('impactCommentAssetId')?.value;
  const dsId = document.getElementById('impactCommentDsId')?.value;
  if (!assetId || !dsId) return;

  const comment = (textEl ? textEl.value : '').trim();
  if (!comment) {
    textEl?.setCustomValidity(t('impact.comment.required'));
    textEl?.reportValidity();
    return;
  }
  textEl?.setCustomValidity('');
  _setLocalizedImpactComment(analysis, assetId, dsId, comment);

  saveAnalyses();
  if (modal) modal.style.display = 'none';
  renderImpactMatrix();
  const button = Array.from(dsMatrixContainer.querySelectorAll('.impact-comment-btn')).find(
    (element) => element.dataset.assetId === assetId && element.dataset.dsId === dsId
  );
  button?.focus();
  showToast(
    typeof t === 'function' ? t('impact.comment.saved') : 'Kommentar gespeichert.',
    'success'
  );
};

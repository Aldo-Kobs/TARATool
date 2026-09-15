/**
 * @file        risk_analysis.js
 * @description Risk analysis overview and attack tree card rendering
 * @author      Nico Peper
 * @organization SCHUNK SE & Co. KG
 * @copyright   2026 SCHUNK SE & Co. KG
 * @license     GPL-3.0
 */

// Explicit DOM reference
const riskAnalysisContainerEl = document.getElementById('riskAnalysisContainer');

function _rootLabel(entry) {
  if (!entry) return '';
  const obj = {
    title: entry.rootName || entry.treeV2?.title || '',
    title_en: entry.rootName_en || entry.treeV2?.title_en || '',
  };
  if (typeof getLocalizedField === 'function') {
    return getLocalizedField(obj, 'title') || entry.id || '';
  }
  return obj.title || entry.id || '';
}

function renderRiskAnalysis() {
  const analysis = getActiveAnalysis();
  if (!analysis) return;
  if (!riskAnalysisContainerEl) return;
  syncAssetRisks(analysis);

  const _t = (k) => (typeof t === 'function' ? t(k) : k);

  if (!analysis.assets || analysis.assets.length === 0) {
    riskAnalysisContainerEl.innerHTML = `
            <div class="warning-box">
                <h4>${_t('risk.missingAssets')}</h4>
                <p>${_t('risk.missingAssetsHint')}</p>
            </div>
        `;
    return;
  }

  const allDS = [...DEFAULT_DAMAGE_SCENARIOS, ...(analysis.damageScenarios || [])];
  if (allDS.length === 0) {
    riskAnalysisContainerEl.innerHTML = `
            <div class="warning-box">
                <h4>${_t('risk.missingDs')}</h4>
                <p>${_t('risk.missingDsHint')}</p>
            </div>
        `;
    return;
  }

  riskAnalysisContainerEl.innerHTML = `
        <div class="success-box" style="margin-bottom:20px;">
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button id="btnOpenAttackTreeModal" class="primary-button large"><i class="fas fa-sitemap"></i> ${_t('btn.createTree')}</button>
                <button onclick="downloadDotFile()" class="action-button large"><i class="fas fa-file-export"></i> ${_t('btn.exportDot')}</button>
            </div>
        </div>
        <p class="muted-hint">${_t('risk.manualHint')}</p>
        ${renderAssetRiskCoverage(analysis)}
        <div id="rootOverviewContainer">
            ${renderRootOverview(analysis)}
        </div>
        <div id="existingRiskEntriesContainer">
            ${renderExistingRiskEntries(analysis)}
        </div>
    `;

  riskAnalysisContainerEl.querySelectorAll('[data-asset-create]').forEach((button) => {
    button.onclick = () => openAttackTreeModal(null, button.dataset.assetCreate);
  });
  riskAnalysisContainerEl.querySelectorAll('[data-risk-edit]').forEach((button) => {
    button.onclick = () => window.editAttackTree(button.dataset.riskEdit);
  });

  const btn = document.getElementById('btnOpenAttackTreeModal');
  if (btn)
    btn.onclick = () => {
      if (typeof openAttackTreeModal === 'function') openAttackTreeModal();
    };
}

function renderAssetRiskCoverage(analysis) {
  const rows = analysis.assets
    .map((asset) => {
      const linked = analysis.riskEntries.filter(
        (entry) => getRiskAsset(analysis, entry) === asset
      );
      const name =
        getLocalizedField(asset, 'name', undefined, { fallback: true }) || asset.name_en || '-';
      return `<tr data-asset-id="${escapeHtml(asset.id)}">
      <th scope="row">${escapeHtml(asset.id)}: ${escapeHtml(name)}</th>
      <td>${
        linked.length
          ? `<ul class="asset-risk-links">${linked.map((entry) => `<li><button class="action-button small" data-risk-edit="${escapeHtml(entry.id)}">${escapeHtml(entry.id)}: ${escapeHtml(_rootLabel(entry))}</button></li>`).join('')}</ul>`
          : `<span class="asset-risk-missing">${t('risk.noLinkedRisks')}</span>`
      }</td>
      <td><button class="action-button small" data-asset-create="${escapeHtml(asset.id)}"><i class="fas fa-plus" aria-hidden="true"></i> ${t('risk.createForAsset')}</button></td>
    </tr>`;
    })
    .join('');
  return `<section class="asset-risk-coverage" aria-labelledby="assetRiskCoverageTitle">
    <h4 id="assetRiskCoverageTitle">${t('risk.assetOverview')}</h4>
    <div class="asset-risk-table-scroll"><table class="asset-risk-table">
      <thead><tr><th scope="col">${t('risk.asset')}</th><th scope="col">${t('risk.linkedRisks')}</th><th scope="col">${t('risk.actions')}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </section>`;
}

/* ── Root-Node-Overview Panel ──────────────────────────────────────── */

function renderRootOverview(analysis) {
  if (!analysis.riskEntries || analysis.riskEntries.length === 0) return '';

  const _t = (k) => (typeof t === 'function' ? t(k) : k);
  const _rl = (lbl) => (typeof tRiskLabel === 'function' ? tRiskLabel(lbl) : lbl);

  const fmt = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    return String(val).replace('.', ',');
  };

  const pStr = (kstu) => {
    if (!kstu) return '- / - / - / -';
    return `${fmt(kstu.k)} / ${fmt(kstu.s)} / ${fmt(kstu.t)} / ${fmt(kstu.u)}`;
  };

  const sorted = [...analysis.riskEntries].sort((a, b) => {
    const ra = parseFloat(a.rootRiskValue) || 0;
    const rb = parseFloat(b.rootRiskValue) || 0;
    return rb - ra;
  });

  let html = `<h4>${_t('risk.rootOverview')}</h4>`;
  html += '<div class="root-overview-grid">';

  sorted.forEach((entry) => {
    const kstu = entry.kstu || {};
    const iNorm = entry.i_norm;
    const rScore = parseFloat(entry.rootRiskValue);
    const meta = getRiskMeta(entry.rootRiskValue);
    const bgClass =
      typeof getRiskBgClass === 'function' ? getRiskBgClass(rScore) : 'risk-bg-unknown';

    html += `
            <div class="root-overview-card ${bgClass}">
                <div class="root-overview-title">${escapeHtml(_rootLabel(entry))}</div>
                <div class="root-overview-row">${escapeHtml(riskAssetLabel(analysis, entry))}</div>
                ${entry.rootRiskValue === '' ? `<div class="root-overview-row">${_t('risk.unassessed')}</div>` : ''}
                ${renderSecurityLevelResult(analysis, entry)}
                <div class="root-overview-row">P = ${escapeHtml(pStr(kstu))}</div>
                <div class="root-overview-row">I[norm] = ${escapeHtml(fmt(iNorm))}</div>
                <div class="root-overview-row root-overview-risk">R = <b style="color:${meta.color}">${escapeHtml(Number.isFinite(rScore) ? fmt(rScore.toFixed(2)) : '-')}</b>
                    <span class="root-overview-badge" style="background:${meta.color}; color:#fff;">${escapeHtml(_rl(meta.label))}</span>
                </div>
            </div>`;
  });

  html += '</div>';
  return html;
}

function renderExistingRiskEntries(analysis) {
  const _t = (k) => (typeof t === 'function' ? t(k) : k);
  const _rl = (lbl) => (typeof tRiskLabel === 'function' ? tRiskLabel(lbl) : lbl);

  if (!analysis.riskEntries || analysis.riskEntries.length === 0) {
    return `<p class="muted-hint">${_t('risk.none')}</p>`;
  }

  let html = `<h4>${_t('risk.savedTrees')}</h4><ul class="entry-list">`;
  analysis.riskEntries.forEach((entry) => {
    const meta = getRiskMeta(entry.rootRiskValue);
    const eId = escapeHtml(entry.id);
    const eName =
      typeof localizeParenHtml === 'function'
        ? localizeParenHtml(_rootLabel(entry))
        : escapeHtml(_rootLabel(entry));
    const hasNotes =
      (typeof getLocalizedField === 'function'
        ? getLocalizedField(entry, 'notes', undefined, { fallback: true })
        : entry.notes || ''
      ).trim().length > 0;

    html += `
            <li class="entry-list-item" style="border-left-color:${meta.color};">
                <div>
                    <strong>${eId}</strong>: ${eName} <br>
                    <span class="entry-list-meta">${escapeHtml(riskAssetLabel(analysis, entry))}</span><br>
                    ${renderSecurityLevelResult(analysis, entry)}
                    <span class="entry-list-meta">
                        ${_t('risk.score')} <b style="color:${meta.color}">${escapeHtml(meta.display)}</b>
                        <span class="root-overview-badge" style="margin-left:5px; background:${meta.color}; color:#fff;">${escapeHtml(_rl(meta.label))}</span>
                    </span>
                </div>
                <div class="entry-list-actions">
                    <button onclick="openTreeNotes('${eId}')" class="action-button small" title="${_t('risk.notes')}">
                        <i class="fas fa-sticky-note${hasNotes ? ' tree-note-active' : ''}"></i>
                    </button>
                    <button onclick="editAttackTree('${eId}')" class="action-button small">
                        <i class="fas fa-edit"></i> ${_t('btn.edit')}
                    </button>
                    <button onclick="deleteAttackTree('${eId}')" class="action-button small dangerous">
                        <i class="fas fa-trash"></i> ${_t('btn.delete')}
                    </button>
                </div>
            </li>
        `;
  });
  html += '</ul>';
  return html;
}

/* ── Tree Notes ────────────────────────────────────────────────────── */

window.openTreeNotes = function (riskId) {
  const analysis = getActiveAnalysis();
  if (!analysis) return;
  const entry = analysis.riskEntries.find((r) => r.id === riskId);
  if (!entry) return;

  const modal = document.getElementById('treeNotesModal');
  if (!modal) return;

  const notesLabel = typeof t === 'function' ? t('risk.notes') : 'Notizen';
  document.getElementById('treeNotesTitle').textContent =
    notesLabel + ': ' + (entry.id || '') + ' – ' + (entry.rootName || '');
  const textEl = document.getElementById('treeNotesText');
  textEl.value = getLocalizedField(entry, 'notes', undefined, { raw: true });
  if (typeof syncLocalizedInputHint === 'function')
    syncLocalizedInputHint(textEl, entry, 'notes', '');
  modal.dataset.riskId = riskId;
  modal.style.display = 'block';
};

window.saveTreeNotes = function () {
  const modal = document.getElementById('treeNotesModal');
  if (!modal) return;
  const riskId = modal.dataset.riskId;
  const analysis = getActiveAnalysis();
  if (!analysis || !riskId) return;

  const entry = analysis.riskEntries.find((r) => r.id === riskId);
  if (!entry) return;

  setLocalizedField(entry, 'notes', (document.getElementById('treeNotesText').value || '').trim());
  saveAnalyses();
  modal.style.display = 'none';

  renderRiskAnalysis();
  if (typeof showToast === 'function')
    showToast(typeof t === 'function' ? t('toast.notesSaved') : 'Notiz gespeichert.', 'success');
};

window.editAttackTree = function (riskId) {
  const analysis = getActiveAnalysis();
  if (!analysis) return;
  const entry = analysis.riskEntries.find((r) => r.id === riskId);
  if (!entry) return;
  if (typeof openAttackTreeModal === 'function') openAttackTreeModal(entry);
};

function reindexRiskIDs(analysis) {
  if (!analysis || !analysis.riskEntries) return;
  const idMap = {};
  const allEntries = [
    ...analysis.riskEntries,
    ...(analysis.matrixRiskArchive || []).map((record) => record.entry),
  ];
  allEntries.forEach((entry, index) => {
    const newId = 'R' + (index + 1).toString().padStart(2, '0');
    if (entry.id !== newId) idMap[entry.id] = newId;
    entry.id = newId;
  });
  if (analysis.securityGoals) {
    const validIds = new Set(allEntries.map((e) => e.id));
    analysis.securityGoals.forEach((sg) => {
      if (Array.isArray(sg.rootRefs)) {
        sg.rootRefs = sg.rootRefs
          .map((ref) => idMap[ref] || ref)
          .filter((ref) => validIds.has(ref));
      }
    });
  }
}

window.deleteAttackTree = function (riskId) {
  const analysis = getActiveAnalysis();
  if (!analysis || !analysis.riskEntries) return;

  const entry = analysis.riskEntries.find((r) => r.id === riskId);
  if (!entry) return;

  const delLabel = typeof t === 'function' ? t('confirm.delete') : 'Löschen';
  showConfirmation({
    title: typeof t === 'function' ? t('risk.delete.title') : 'Angriffsbaum löschen',
    messageHtml:
      typeof tf === 'function'
        ? tf('risk.delete.message', { id: escapeHtml(entry.id), name: escapeHtml(entry.rootName) })
        : `<b>${escapeHtml(entry.id)}: ${escapeHtml(entry.rootName)}</b>`,
    confirmText: delLabel,
    onConfirm: () => {
      analysis.riskEntries = analysis.riskEntries.filter((r) => r.id !== riskId);
      reindexRiskIDs(analysis);

      try {
        if (typeof syncResidualRiskFromRiskAnalysis === 'function') {
          syncResidualRiskFromRiskAnalysis(analysis, false);
        }
      } catch (e) {
        console.warn('[deleteAttackTree] Residual risk sync failed:', e);
      }
      saveAnalyses();

      const attackTreeModalEl = document.getElementById('attackTreeModal');
      if (attackTreeModalEl) attackTreeModalEl.style.display = 'none';

      renderRiskAnalysis();
      showToast(
        typeof t === 'function' ? t('toast.treeDeleted') : 'Angriffsbaum gelöscht.',
        'success'
      );
    },
  });
};

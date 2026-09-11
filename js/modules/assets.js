/**
 * @file        assets.js
 * @description Asset management UI – CRUD operations and rendering
 * @author      Nico Peper
 * @organization SCHUNK SE & Co. KG
 * @copyright   2026 SCHUNK SE & Co. KG
 * @license     GPL-3.0
 */

// Explicit DOM references (robust against implicit window ID globals)
const assetsCardContainerEl = document.getElementById('assetsCardContainer');
const assetFormEl = document.getElementById('assetForm');
const assetModalEl = document.getElementById('assetModal');
const assetModalTitleEl = document.getElementById('assetModalTitle');
const closeAssetModalEl = document.getElementById('closeAssetModal');
const btnAddAssetEl = document.getElementById('btnAddAsset');

const ASSET_CRITERIA = [
  ['confidentiality', 'assets.modal.confidentiality'],
  ['integrity', 'assets.modal.integrity'],
  // Legacy storage key for Availability; Authentication is a separate criterion.
  ['authenticity', 'assets.modal.availability'],
  ['authorization', 'assets.modal.authorization'],
  ['authentication', 'assets.modal.authentication'],
];
const ASSET_TYPES = ['Component', 'Data', 'Function'];

function normalizeAssetType(value) {
  const aliases = {
    component: 'Component',
    komponente: 'Component',
    data: 'Data',
    daten: 'Data',
    function: 'Function',
    funktion: 'Function',
  };
  return (
    aliases[
      String(value || '')
        .trim()
        .toLowerCase()
    ] || ''
  );
}

function getAssetTypeLabel(asset, lang) {
  const type = normalizeAssetType(asset.type || asset.type_en);
  if (type) return t(`assets.type.${type.toLowerCase()}`, lang);
  return getLocalizedField(asset, 'type', lang, { fallback: true }) || '-';
}

function populateAssetTypeOptions(asset) {
  const select = document.getElementById('assetType');
  select.replaceChildren();
  ASSET_TYPES.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.dataset.i18n = `assets.type.${type.toLowerCase()}`;
    option.textContent = t(option.dataset.i18n);
    select.appendChild(option);
  });
  if (!asset) return;
  const type = normalizeAssetType(asset.type || asset.type_en);
  if (type) {
    select.value = type;
  } else {
    // Keep legacy free-text types intact until the user chooses a category.
    const previous = document.createElement('option');
    previous.value = '';
    previous.disabled = true;
    previous.textContent = tf('assets.type.legacy', { type: getAssetTypeLabel(asset) });
    select.prepend(previous);
    select.value = '';
  }
}

function readAssetEvaluation() {
  const evaluation = {};
  ASSET_CRITERIA.forEach(([key]) => {
    evaluation[key] = document.querySelector(`input[name="${key}"]:checked`)?.value || '-';
  });
  // Inapplicable criteria do not increase protection need.
  const levels = PROTECTION_LEVEL_RANKING;
  const maxLevel = Math.max(
    ...Object.values(evaluation).map((value) => (value === 'N/A' ? 0 : levels[value] || 0))
  );
  evaluation.schutzbedarf = ['-', 'I', 'II', 'III'][maxLevel];
  return evaluation;
}

function refreshAssetRisks(analysis) {
  /* global _recalcAllRiskEntries */
  if (typeof _recalcAllRiskEntries === 'function') _recalcAllRiskEntries(analysis);
}

function renderAssets(analysis) {
  if (!assetsCardContainerEl) return;
  assetsCardContainerEl.innerHTML = '';
  const _t = (k) => (typeof t === 'function' ? t(k) : k);
  const _loc = (obj, field) =>
    typeof getLocalizedField === 'function' ? getLocalizedField(obj, field) : obj?.[field] || '';

  if (!analysis.assets || analysis.assets.length === 0) {
    assetsCardContainerEl.innerHTML = `<p class="muted-hint" style="grid-column: 1/-1; text-align: center;">${_t('assets.empty')}</p>`;
    return;
  }

  analysis.assets.forEach((asset) => {
    const card = document.createElement('div');
    card.className = 'asset-card';
    const name = _loc(asset, 'name');
    const descRaw = _loc(asset, 'description');
    const eName =
      typeof localizeParenHtml === 'function' ? localizeParenHtml(name) : escapeHtml(name);
    const eType = escapeHtml(getAssetTypeLabel(asset));
    const eDesc = descRaw
      ? typeof localizeParenHtml === 'function'
        ? localizeParenHtml(descRaw.substring(0, 100) + (descRaw.length > 100 ? '...' : ''))
        : escapeHtml(descRaw.substring(0, 100)) + (descRaw.length > 100 ? '...' : '')
      : escapeHtml(_t('assets.noDesc'));
    const eId = escapeHtml(asset.id);

    card.innerHTML = `
            <div class="asset-card-header">${eId}: ${eName}</div>
            <div class="asset-description-area">
                <strong>${_t('assets.type')}</strong> ${eType}<br><br>
                ${eDesc}
            </div>
            <div class="asset-cia-area">
                <div class="asset-cia-label">${_t('assets.schutz')}</div>
                <dl class="asset-criteria-values">
                    ${ASSET_CRITERIA.map(([key, label]) => `<dt>${escapeHtml(_t(label))}</dt><dd>${escapeHtml(asset[key] || '-')}</dd>`).join('')}
                </dl>
            </div>
            <div class="asset-card-footer">
                <button onclick="editAsset('${eId}')" class="action-button small">${_t('btn.edit')}</button>
                <button onclick="removeAsset('${eId}')" class="action-button small dangerous">${_t('btn.delete')}</button>
            </div>
        `;
    assetsCardContainerEl.appendChild(card);
  });
}

function saveAsset(e) {
  e.preventDefault();
  const analysis = getActiveAnalysis();
  if (!analysis) return;

  const idField = document.getElementById('assetIdField');
  const nameField = document.getElementById('assetName');
  const typeField = document.getElementById('assetType');
  const descField = document.getElementById('assetDescription');

  const assetId = idField.value;
  const name = nameField.value.trim();

  if (!name) {
    showToast(
      typeof t === 'function' ? t('toast.needName') : 'Bitte einen Namen angeben.',
      'warning'
    );
    return;
  }

  if (!ASSET_TYPES.includes(typeField.value)) {
    showToast(t('assets.type.required'), 'warning');
    return;
  }
  const evaluation = readAssetEvaluation();

  if (assetId) {
    // Edit
    const index = analysis.assets.findIndex((a) => a.id === assetId);
    if (index !== -1) {
      const updated = {
        ...analysis.assets[index],
        ...evaluation,
        type: typeField.value,
      };
      if (typeof setLocalizedField === 'function') {
        setLocalizedField(updated, 'name', name);
        setLocalizedField(updated, 'description', descField.value);
      } else {
        updated.name = name;
        updated.type = typeField.value;
        updated.description = descField.value;
      }
      delete updated.type_en;
      analysis.assets[index] = updated;
      showToast(
        typeof tf === 'function' ? tf('toast.assetOk', { id: assetId }) : `Asset ${assetId} OK`,
        'success'
      );
    }
  } else {
    // New
    if (!analysis.assets) analysis.assets = [];
    const existingIds = analysis.assets
      .map((a) => parseInt(a.id.replace('A', '')))
      .filter((n) => !isNaN(n));
    const newIndex = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const newId = 'A' + newIndex.toString().padStart(2, '0');
    const created = {
      id: newId,
      name: '',
      type: typeField.value,
      description: '',
      ...evaluation,
    };
    if (typeof setLocalizedField === 'function') {
      setLocalizedField(created, 'name', name);
      setLocalizedField(created, 'description', descField.value);
    } else {
      created.name = name;
      created.type = typeField.value;
      created.description = descField.value;
    }
    analysis.assets.push(created);
    showToast(
      typeof tf === 'function' ? tf('toast.assetOk', { id: newId }) : `Asset ${newId} OK`,
      'success'
    );
  }

  refreshAssetRisks(analysis);
  saveAnalyses();
  renderAssets(analysis);
  if (typeof renderImpactMatrix === 'function') renderImpactMatrix();
  if (assetModalEl) assetModalEl.style.display = 'none';
}

window.editAsset = (id) => {
  const analysis = getActiveAnalysis();
  if (!analysis) return;
  const asset = analysis.assets.find((a) => a.id === id);
  if (!asset) return;

  if (assetModalTitleEl) {
    assetModalTitleEl.textContent =
      typeof tf === 'function' ? tf('assets.modal.edit', { id: asset.id }) : `Asset ${asset.id}`;
  }
  document.getElementById('assetIdField').value = asset.id;
  const nameEl = document.getElementById('assetName');
  const descEl = document.getElementById('assetDescription');
  const nameRaw =
    typeof getLocalizedField === 'function'
      ? getLocalizedField(asset, 'name', undefined, { raw: true })
      : asset.name || '';
  const descRaw =
    typeof getLocalizedField === 'function'
      ? getLocalizedField(asset, 'description', undefined, { raw: true })
      : asset.description || '';
  nameEl.value = nameRaw;
  populateAssetTypeOptions(asset);
  descEl.value = descRaw;
  if (typeof syncLocalizedInputHint === 'function') {
    syncLocalizedInputHint(nameEl, asset, 'name', '');
    syncLocalizedInputHint(descEl, asset, 'description', '');
  } else {
    const lang = (window.TaraPrefs && TaraPrefs.getLang()) || 'de';
    if (lang === 'en') {
      const deName =
        typeof getPrimaryField === 'function' ? getPrimaryField(asset, 'name') : asset.name || '';
      const deDesc =
        typeof getPrimaryField === 'function'
          ? getPrimaryField(asset, 'description')
          : asset.description || '';
      nameEl.placeholder = deName ? `(${deName})` : '';
      descEl.placeholder = deDesc ? `(${deDesc})` : '';
    } else {
      nameEl.placeholder = '';
      descEl.placeholder = '';
    }
  }

  // Set radio buttons
  const setRadio = (radioName, val) => {
    const els = document.querySelectorAll(`input[name="${radioName}"]`);
    els.forEach((el) => {
      el.checked = el.value === val;
    });
  };
  ASSET_CRITERIA.forEach(([key]) => setRadio(key, asset[key]));

  if (assetModalEl) assetModalEl.style.display = 'block';
};

/**
 * Renumbers all assets sequentially (A01, A02, ...) and remaps
 * impactMatrix keys to match the new IDs.
 */
function _renumberAssets(analysis) {
  if (!analysis.assets || analysis.assets.length === 0) return;

  const idMap = {}; // oldId → newId
  analysis.assets.forEach((asset, i) => {
    const newId = 'A' + (i + 1).toString().padStart(2, '0');
    if (asset.id !== newId) {
      idMap[asset.id] = newId;
      asset.id = newId;
    }
  });

  // Nothing to remap
  if (Object.keys(idMap).length === 0) return;

  // Remap impactMatrix keys
  if (analysis.impactMatrix) {
    const newMatrix = {};
    for (const oldKey in analysis.impactMatrix) {
      const newKey = idMap[oldKey] || oldKey;
      newMatrix[newKey] = analysis.impactMatrix[oldKey];
    }
    analysis.impactMatrix = newMatrix;
  }

  // Remap impactComments keys
  if (analysis.impactComments) {
    const newComments = {};
    for (const oldKey in analysis.impactComments) {
      const newKey = idMap[oldKey] || oldKey;
      newComments[newKey] = analysis.impactComments[oldKey];
    }
    analysis.impactComments = newComments;
  }
}

window.removeAsset = (id) => {
  const analysis = getActiveAnalysis();
  if (!analysis) return;
  const asset = analysis.assets.find((a) => a.id === id);
  if (!asset) return;

  showConfirmation({
    title: typeof t === 'function' ? t('assets.delete.title') : 'Asset löschen',
    messageHtml:
      typeof tf === 'function'
        ? tf('assets.delete.message', { name: escapeHtml(asset.name), id: escapeHtml(asset.id) })
        : `Möchten Sie das Asset <b>${escapeHtml(asset.name)} (${escapeHtml(asset.id)})</b> wirklich löschen?<br>Dies entfernt auch alle Einträge in der Impact-Matrix!`,
    confirmText: typeof t === 'function' ? t('confirm.delete') : 'Löschen',
    onConfirm: () => {
      analysis.assets = analysis.assets.filter((a) => a.id !== id);

      // Clean up impact matrix
      if (analysis.impactMatrix && analysis.impactMatrix[id]) {
        delete analysis.impactMatrix[id];
      }

      // Clean up impact comments
      if (analysis.impactComments && analysis.impactComments[id]) {
        delete analysis.impactComments[id];
      }

      // Renumber remaining assets (A01, A02, ...) and remap impactMatrix keys
      _renumberAssets(analysis);

      saveAnalyses();
      renderAssets(analysis);
      if (typeof renderImpactMatrix === 'function') renderImpactMatrix();
      showToast(
        typeof tf === 'function' ? tf('toast.assetDeleted', { id }) : `Asset ${id} gelöscht.`,
        'success'
      );
    },
  });
};

if (assetFormEl) {
  assetFormEl.onsubmit = saveAsset;
}

if (btnAddAssetEl) {
  btnAddAssetEl.onclick = () => {
    if (!activeAnalysisId) {
      showToast(
        typeof t === 'function'
          ? t('toast.needAnalysis')
          : 'Bitte erst eine Analyse wählen/erstellen.',
        'warning'
      );
      return;
    }
    if (assetModalTitleEl)
      assetModalTitleEl.textContent =
        typeof t === 'function' ? t('assets.modal.new') : 'Neues Asset';
    if (assetFormEl) assetFormEl.reset();
    populateAssetTypeOptions();
    document.getElementById('assetIdField').value = '';
    if (assetModalEl) assetModalEl.style.display = 'block';
  };
}

if (closeAssetModalEl) {
  closeAssetModalEl.onclick = () => {
    if (assetModalEl) assetModalEl.style.display = 'none';
  };
}

/** Persist open asset form into language slot before DE/EN switch. */
window.flushAssetModalLang = function (lang) {
  const analysis = typeof getActiveAnalysis === 'function' ? getActiveAnalysis() : null;
  if (!analysis) return;
  const id = document.getElementById('assetIdField')?.value;
  if (!id) return;
  const asset = (analysis.assets || []).find((a) => a.id === id);
  if (!asset) return;
  Object.assign(asset, readAssetEvaluation());
  const type = document.getElementById('assetType').value;
  if (ASSET_TYPES.includes(type)) {
    asset.type = type;
    delete asset.type_en;
  }
  refreshAssetRisks(analysis);
  const name = document.getElementById('assetName')?.value ?? '';
  const desc = document.getElementById('assetDescription')?.value ?? '';
  if (typeof setLocalizedField === 'function') {
    setLocalizedField(asset, 'name', name, lang);
    setLocalizedField(asset, 'description', desc, lang);
  }
  try {
    if (typeof saveAnalyses === 'function') saveAnalyses();
  } catch (_) {}
};

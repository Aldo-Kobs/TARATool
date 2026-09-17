/** User-defined SL-T targets for the seven IEC 62443 foundational requirements. */
const SECURITY_LEVEL_REQUIREMENTS = [
  { id: 'FR1', abbreviation: 'IAC' },
  { id: 'FR2', abbreviation: 'UC' },
  { id: 'FR3', abbreviation: 'SI' },
  { id: 'FR4', abbreviation: 'DC' },
  { id: 'FR5', abbreviation: 'RDF' },
  { id: 'FR6', abbreviation: 'TRE' },
  { id: 'FR7', abbreviation: 'RA' },
];

const SECURITY_LEVEL_BANDS = ['low', 'medium', 'high', 'veryHigh'];

function validSecurityLevelMatrix(settings, allowUnset = false) {
  if (!settings) return false;
  const validBounds = (bounds) =>
    Array.isArray(bounds) &&
    bounds.length === 3 &&
    bounds.every(
      (value, index) =>
        typeof value === 'number' &&
        Number.isFinite(value) &&
        value > 0 &&
        (!index || value > bounds[index - 1])
    );
  return (
    validBounds(settings.feasibilityBounds) &&
    validBounds(settings.impactBounds) &&
    Array.isArray(settings.matrix) &&
    settings.matrix.length === 4 &&
    settings.matrix.every(
      (row) =>
        Array.isArray(row) &&
        row.length === 4 &&
        row.every(
          (value) =>
            (allowUnset && value === null) || (Number.isInteger(value) && value >= 0 && value <= 4)
        )
    )
  );
}

function securityLevelTitle(analysis, lang) {
  return t('sl.recommendedTarget', lang);
}

function securityLevelBandRange(bounds, index) {
  return index === 0
    ? `0 <= x <= ${bounds[0]}`
    : index === 3
      ? `x > ${bounds[2]}`
      : `${bounds[index - 1]} < x <= ${bounds[index]}`;
}

function securityLevelForRisk(analysis, entry) {
  const settings = getSecurityLevelMatrix(analysis);
  if (!validSecurityLevelMatrix(settings)) return { status: 'notConfigured' };
  // Accept editor drafts and saved risks; never read residual assessments.
  const base =
    entry?.treeV2 || entry?.branches
      ? entry
      : analysis.riskEntries?.find((risk) => risk.uid === entry?.uid);
  if (!base || !getRiskAsset(analysis, base)) return { status: 'unassessed' };
  const numeric = (value) =>
    (typeof value === 'number' || typeof value === 'string') &&
    String(value).trim() !== '' &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0;
  let leaves = 0;
  let complete = true;
  rrIterateLeaves(base, ({ leaf }) => {
    leaves++;
    if (![leaf.i_norm, leaf.k, leaf.s, leaf.t, leaf.u].every(numeric)) complete = false;
  });
  if (!leaves || !complete) return { status: 'unassessed' };
  const metrics = base;
  if (
    ![
      metrics?.i_norm,
      metrics?.kstu?.k,
      metrics?.kstu?.s,
      metrics?.kstu?.t,
      metrics?.kstu?.u,
    ].every(numeric)
  )
    return { status: 'unassessed' };
  const feasibility = Number(
    ['k', 's', 't', 'u'].reduce((sum, key) => sum + Number(metrics.kstu[key]), 0).toFixed(10)
  );
  const impact = Number(Number(metrics.i_norm).toFixed(10));
  const band = (value, bounds) => {
    const index = bounds.findIndex((bound) => value <= bound);
    return index < 0 ? 3 : index;
  };
  const feasibilityBand = band(feasibility, settings.feasibilityBounds);
  const impactBand = band(impact, settings.impactBounds);
  return {
    status: 'ok',
    value: settings.matrix[feasibilityBand][impactBand],
    feasibility,
    impact,
    feasibilityBand,
    impactBand,
  };
}

function securityLevelResultText(result, lang) {
  return result.status === 'ok' ? `SL-T ${result.value}` : t('sl.' + result.status, lang);
}

function renderSecurityLevelResult(analysis, entry) {
  const result = securityLevelForRisk(analysis, entry);
  return `<div class="security-level-result" data-sl-risk="${escapeHtml(entry?.uid || '')}">
    <strong>${securityLevelTitle(analysis)}: ${escapeHtml(securityLevelResultText(result))}</strong>
    ${result.status === 'ok' ? `<div class="muted-hint">A = ${result.feasibility} (${t('sl.band.' + SECURITY_LEVEL_BANDS[result.feasibilityBand])}); I = ${result.impact} (${t('sl.band.' + SECURITY_LEVEL_BANDS[result.impactBand])})</div>` : ''}
  </div>`;
}

function defaultSecurityLevelMatrix() {
  return {
    feasibilityBounds: [0.8, 1.4, 1.8],
    impactBounds: [0.3, 0.6, 0.8],
    matrix: [
      [0, 0, 1, 2],
      [0, 1, 2, 3],
      [1, 2, 3, 4],
      [2, 3, 4, 4],
    ],
  };
}

function getSecurityLevelMatrix(analysis) {
  const settings = analysis?.securityLevelSettings;
  const source = settings?.matrix ? settings : settings?.legacyMatrix;
  return source
    ? {
        feasibilityBounds: structuredClone(source.feasibilityBounds),
        impactBounds: structuredClone(source.impactBounds),
        matrix: structuredClone(source.matrix),
      }
    : defaultSecurityLevelMatrix();
}

function defaultSecurityLevelSettings() {
  return {
    schemaVersion: 2,
    ...defaultSecurityLevelMatrix(),
    targets: Object.fromEntries(SECURITY_LEVEL_REQUIREMENTS.map(({ id }) => [id, null])),
  };
}

function validSecurityLevelSettings(settings) {
  return (
    settings?.schemaVersion === 2 &&
    validSecurityLevelMatrix(settings, true) &&
    settings.targets &&
    !Array.isArray(settings.targets) &&
    SECURITY_LEVEL_REQUIREMENTS.every(
      ({ id }) =>
        Object.hasOwn(settings.targets, id) &&
        (settings.targets[id] === null ||
          (Number.isInteger(settings.targets[id]) &&
            settings.targets[id] >= 0 &&
            settings.targets[id] <= 4))
    )
  );
}

function getSecurityLevelTarget(analysis, requirementId) {
  const settings = analysis?.securityLevelSettings;
  const value = settings?.schemaVersion === 2 ? settings.targets?.[requirementId] : null;
  return Number.isInteger(value) && value >= 0 && value <= 4 ? value : null;
}

function securityLevelTargetText(value, lang) {
  return value === null ? t('sl.notSet', lang) : `SL-T ${value}`;
}

function renderSecurityLevelTargets(analysis) {
  return `<section class="sl-target-summary" aria-label="${escapeHtml(t('sl.settingsTitle'))}">
    <h4>${t('sl.settingsTitle')}</h4>
    <p class="muted-hint">${t('sl.fixedTargets')}</p>
    <div class="sl-target-grid">${SECURITY_LEVEL_REQUIREMENTS.map(
      ({ id, abbreviation }) =>
        `<div data-sl-target-summary="${id}"><span title="${escapeHtml(t('sl.requirement.' + id))}">${id} · ${abbreviation}</span><strong>${securityLevelTargetText(getSecurityLevelTarget(analysis, id))}</strong><small>${t('sl.requirement.' + id)}</small></div>`
    ).join('')}</div>
  </section>`;
}

(function () {
  let editingAnalysisId = null;
  let legacyMatrix = null;
  const modal = document.getElementById('securityLevelSettingsModal');
  const form = document.getElementById('securityLevelSettingsForm');
  const body = document.getElementById('securityLevelSettingsBody');
  const error = document.getElementById('securityLevelSettingsError');
  const button = document.getElementById('btnSettings');
  const close = () => {
    modal.style.display = 'none';
    editingAnalysisId = null;
    legacyMatrix = null;
    button.focus();
  };

  function readDraft() {
    const settings = defaultSecurityLevelSettings();
    SECURITY_LEVEL_REQUIREMENTS.forEach(({ id }) => {
      const value = body.querySelector(`[data-sl-target="${id}"]`).value;
      settings.targets[id] = value === '' ? null : Number(value);
    });
    ['feasibility', 'impact'].forEach((axis) => {
      settings[axis + 'Bounds'] = Array.from(
        body.querySelectorAll(`[data-sl-bound="${axis}"]`)
      ).map((input) => (input.value === '' ? NaN : Number(input.value)));
    });
    settings.matrix = Array.from({ length: 4 }, (_, row) =>
      Array.from({ length: 4 }, (_, col) => {
        const value = body.querySelector(`[data-sl-cell="${row}-${col}"]`).value;
        return value === '' ? null : Number(value);
      })
    );
    if (legacyMatrix) settings.legacyMatrix = structuredClone(legacyMatrix);
    return settings;
  }

  function updateProgress() {
    const count = Object.values(readDraft().targets).filter((value) => value !== null).length;
    body.querySelector('#slTargetProgress').textContent = tf('sl.progress', { count });
  }

  function renderDraft(settings) {
    const axis = (name, bounds) =>
      `<fieldset><legend>${t('sl.' + name)}</legend>${bounds.map((value, index) => `<label class="sl-bound-label">${t('sl.band.' + SECURITY_LEVEL_BANDS[index])} — ${t('sl.upperBound')}<input type="number" step="any" min="0" required data-sl-bound="${name}" value="${escapeHtml(Number.isFinite(value) ? String(value) : '')}"></label>`).join('')}<p class="muted-hint">${t('sl.lastBand')}</p></fieldset>`;

    body.innerHTML = `<p>${t('sl.scope')}</p>
      <h3>${t('sl.settingsTitle')}</h3>
      <p class="muted-hint">${t('sl.fixedTargets')}</p>
      ${legacyMatrix ? `<p class="muted-hint">${t('sl.legacyNotice')}</p>` : ''}
      <p id="slTargetProgress" role="status"></p>
      <div class="sl-target-table-scroll"><table class="sl-target-table">
        <thead><tr><th scope="col">${t('sl.requirement')}</th><th scope="col">${t('sl.target')}</th></tr></thead>
        <tbody>${SECURITY_LEVEL_REQUIREMENTS.map(
          ({ id, abbreviation }) => `<tr>
          <th scope="row"><label for="slTarget-${id}">${id} — ${t('sl.requirement.' + id)} (${abbreviation})</label></th>
          <td><select id="slTarget-${id}" data-sl-target="${id}">
            <option value="">${t('sl.notSet')}</option>
            ${[0, 1, 2, 3, 4].map((value) => `<option value="${value}" ${settings.targets[id] === value ? 'selected' : ''}>SL-T ${value}</option>`).join('')}
          </select></td>
        </tr>`
        ).join('')}</tbody>
      </table></div>
      <p class="muted-hint">${t('sl.levelHint')}</p>
      <h3>${t('sl.matrixTitle')}</h3>
      <p class="muted-hint">${t('sl.standardNote')}</p>
      <p>${t('sl.formula')}</p>
      <p class="muted-hint">${t('sl.setupHint')}</p>
      <div class="sl-band-settings">${axis('feasibility', settings.feasibilityBounds)}${axis('impact', settings.impactBounds)}</div>
      <div class="sl-matrix-scroll"><table class="sl-settings-matrix">
        <caption>${t('sl.matrix')}</caption>
        <thead><tr><th scope="col">${t('sl.feasibility')} / ${t('sl.impact')}</th>${SECURITY_LEVEL_BANDS.map((name) => `<th scope="col">${t('sl.band.' + name)}</th>`).join('')}</tr></thead>
        <tbody>${SECURITY_LEVEL_BANDS.map((name, row) => `<tr><th scope="row">${t('sl.band.' + name)}</th>${SECURITY_LEVEL_BANDS.map((column, col) => `<td><select data-sl-cell="${row}-${col}" aria-label="${escapeHtml(t('sl.feasibility') + ': ' + t('sl.band.' + name) + ', ' + t('sl.impact') + ': ' + t('sl.band.' + column))}"><option value="">${t('sl.choose')}</option>${[0, 1, 2, 3, 4].map((value) => `<option value="${value}" ${settings.matrix[row][col] === value ? 'selected' : ''}>SL ${value}</option>`).join('')}</select></td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
      <p class="muted-hint">${t('sl.boundaryRule')}</p>
      <p><a href="https://webstore.iec.ch/en/publication/30727" target="_blank" rel="noopener noreferrer">IEC 62443-3-2</a> · <a href="https://webstore.iec.ch/en/publication/34421" target="_blank" rel="noopener noreferrer">IEC 62443-4-2</a></p>`;
    updateProgress();
    body
      .querySelectorAll('[data-sl-target]')
      .forEach((select) => select.addEventListener('change', updateProgress));
  }

  button.addEventListener('click', () => {
    const analysis = getActiveAnalysis();
    if (!analysis) {
      showToast(t('toast.needAnalysis'), 'warning');
      return;
    }
    editingAnalysisId = analysis.id;
    const previous = analysis.securityLevelSettings;
    legacyMatrix =
      previous?.schemaVersion === 1 ? structuredClone(previous) : previous?.legacyMatrix || null;
    error.textContent = '';
    const matrix = getSecurityLevelMatrix(analysis);
    const draft = {
      ...defaultSecurityLevelSettings(),
      ...(validSecurityLevelMatrix(matrix, true) ? matrix : defaultSecurityLevelMatrix()),
    };
    SECURITY_LEVEL_REQUIREMENTS.forEach(({ id }) => {
      draft.targets[id] = getSecurityLevelTarget(analysis, id);
    });
    renderDraft(draft);
    modal.style.display = 'block';
    document.getElementById('closeSecurityLevelSettings').focus();
  });
  document.getElementById('closeSecurityLevelSettings').addEventListener('click', close);
  document.getElementById('cancelSecurityLevelSettings').addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
  window.refreshSecurityLevelSettingsLanguage = function () {
    if (modal.style.display === 'block') renderDraft(readDraft());
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const analysis = getActiveAnalysis();
    if (!analysis || analysis.id !== editingAnalysisId) {
      close();
      return;
    }
    const draft = readDraft();
    if (!validSecurityLevelSettings(draft)) {
      error.textContent = t('sl.invalid');
      return;
    }
    analysis.securityLevelSettings = draft;
    saveAnalyses();
    renderActiveTab(analysis);
    if (document.getElementById('attackTreeModal')?.style.display === 'block') {
      window.atV2?.updateSummaries();
    }
    close();
    showToast(t('sl.saved'), 'success');
  });
})();

/** User-defined feasibility/impact mapping for security-level planning. */
const SECURITY_LEVEL_BANDS = ['low', 'medium', 'high', 'veryHigh'];

function defaultSecurityLevelSettings() {
  return {
    schemaVersion: 1,
    resultType: 'slcEstimate',
    feasibilityBounds: [0.8, 1.4, 1.8],
    impactBounds: [0.3, 0.6, 0.8],
    matrix: Array.from({ length: 4 }, () => Array(4).fill(null)),
  };
}

function validSecurityLevelSettings(settings) {
  if (
    !settings ||
    settings.schemaVersion !== 1 ||
    !['slcEstimate', 'slt'].includes(settings.resultType)
  )
    return false;
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
        row.every((value) => Number.isInteger(value) && value >= 0 && value <= 4)
    )
  );
}

function securityLevelTitle(analysis, lang) {
  return t(
    analysis?.securityLevelSettings?.resultType === 'slt' ? 'sl.target' : 'sl.capabilityEstimate',
    lang
  );
}

function securityLevelBandRange(bounds, index) {
  return index === 0
    ? `0 <= x <= ${bounds[0]}`
    : index === 3
      ? `x > ${bounds[2]}`
      : `${bounds[index - 1]} < x <= ${bounds[index]}`;
}

function securityLevelForRisk(analysis, entry, residual = false) {
  const settings = analysis?.securityLevelSettings;
  if (!validSecurityLevelSettings(settings)) return { status: 'notConfigured' };
  const base = analysis.riskEntries?.find((risk) => risk.uid === entry?.uid);
  if (!base || !getRiskAsset(analysis, base)) return { status: 'unassessed' };
  const assessedEntry = residual
    ? analysis.residualRisk?.entries?.find((risk) => risk.uid === base.uid)
    : base;
  const numeric = (value) =>
    (typeof value === 'number' || typeof value === 'string') &&
    String(value).trim() !== '' &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0;
  let leaves = 0;
  let complete = true;
  rrIterateLeaves(assessedEntry, ({ leaf }) => {
    leaves++;
    const values = residual && leaf.rr?.treatment === 'Mitigiert' ? leaf.rr : leaf;
    if (![leaf.i_norm, values.k, values.s, values.t, values.u].every(numeric)) complete = false;
  });
  if (!leaves || !complete) return { status: 'unassessed' };
  const metrics = residual ? computeResidualTreeMetrics(analysis, base.uid) : base;
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
  return result.status === 'ok' ? `SL ${result.value}` : t('sl.' + result.status, lang);
}

function renderSecurityLevelResult(analysis, entry, residual = false) {
  const result = securityLevelForRisk(analysis, entry, residual);
  return `<div class="security-level-result" data-sl-risk="${escapeHtml(entry?.uid || '')}" data-sl-residual="${residual}">
    <strong>${securityLevelTitle(analysis)}: ${escapeHtml(securityLevelResultText(result))}</strong>
    ${result.status === 'ok' ? `<div class="muted-hint">A = ${result.feasibility} (${t('sl.band.' + SECURITY_LEVEL_BANDS[result.feasibilityBand])}); I = ${result.impact} (${t('sl.band.' + SECURITY_LEVEL_BANDS[result.impactBand])})</div>` : ''}
  </div>`;
}

(function () {
  let editingAnalysisId = null;
  const modal = document.getElementById('securityLevelSettingsModal');
  const form = document.getElementById('securityLevelSettingsForm');
  const body = document.getElementById('securityLevelSettingsBody');
  const error = document.getElementById('securityLevelSettingsError');
  const button = document.getElementById('btnSettings');
  const close = () => {
    modal.style.display = 'none';
    editingAnalysisId = null;
    button.focus();
  };

  function readDraft() {
    const bounds = (axis) =>
      Array.from(body.querySelectorAll(`[data-sl-bound="${axis}"]`)).map((input) =>
        input.value === '' ? NaN : Number(input.value)
      );
    return {
      schemaVersion: 1,
      resultType: body.querySelector('#slResultType').value,
      feasibilityBounds: bounds('feasibility'),
      impactBounds: bounds('impact'),
      matrix: Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => {
          const value = body.querySelector(`[data-sl-cell="${row}-${col}"]`).value;
          return value === '' ? null : Number(value);
        })
      ),
    };
  }

  function renderDraft(settings) {
    const axis = (name, bounds) =>
      `<fieldset><legend>${t('sl.' + name)}</legend>${bounds.map((value, index) => `<label class="sl-bound-label">${t('sl.band.' + SECURITY_LEVEL_BANDS[index])} — ${t('sl.upperBound')}<input type="number" step="any" min="0" required data-sl-bound="${name}" value="${escapeHtml(Number.isFinite(value) ? String(value) : '')}"></label>`).join('')}<p class="muted-hint">${t('sl.lastBand')}</p></fieldset>`;
    body.innerHTML = `<p>${t('sl.scope')}</p>
      <p class="muted-hint">${t('sl.standardNote')}</p>
      <label for="slResultType">${t('sl.resultType')}</label>
      <select id="slResultType"><option value="slcEstimate">${t('sl.capabilityEstimate')}</option><option value="slt">${t('sl.target')}</option></select>
      <p>${t('sl.formula')}</p>
      <p class="muted-hint">${t('sl.setupHint')}</p>
      <div class="sl-band-settings">${axis('feasibility', settings.feasibilityBounds)}${axis('impact', settings.impactBounds)}</div>
      <div class="sl-matrix-scroll"><table class="sl-settings-matrix">
        <caption>${t('sl.matrix')}</caption>
        <thead><tr><th scope="col">${t('sl.feasibility')} / ${t('sl.impact')}</th>${SECURITY_LEVEL_BANDS.map((name) => `<th scope="col">${t('sl.band.' + name)}</th>`).join('')}</tr></thead>
        <tbody>${SECURITY_LEVEL_BANDS.map((name, row) => `<tr><th scope="row">${t('sl.band.' + name)}</th>${SECURITY_LEVEL_BANDS.map((column, col) => `<td><select required data-sl-cell="${row}-${col}" aria-label="${escapeHtml(t('sl.feasibility') + ': ' + t('sl.band.' + name) + ', ' + t('sl.impact') + ': ' + t('sl.band.' + column))}"><option value="">${t('sl.choose')}</option>${[0, 1, 2, 3, 4].map((value) => `<option value="${value}" ${settings.matrix[row][col] === value ? 'selected' : ''}>SL ${value}</option>`).join('')}</select></td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
      <p class="muted-hint">${t('sl.boundaryRule')}</p>
      <p><a href="https://webstore.iec.ch/en/publication/30727" target="_blank" rel="noopener noreferrer">IEC 62443-3-2</a> · <a href="https://webstore.iec.ch/en/publication/34421" target="_blank" rel="noopener noreferrer">IEC 62443-4-2</a></p>`;
    body.querySelector('#slResultType').value = settings.resultType;
  }

  button.addEventListener('click', () => {
    const analysis = getActiveAnalysis();
    if (!analysis) {
      showToast(t('toast.needAnalysis'), 'warning');
      return;
    }
    editingAnalysisId = analysis.id;
    error.textContent = '';
    renderDraft(
      validSecurityLevelSettings(analysis.securityLevelSettings)
        ? structuredClone(analysis.securityLevelSettings)
        : defaultSecurityLevelSettings()
    );
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
    syncAssetRisks(analysis);
    saveAnalyses();
    renderActiveTab(analysis);
    close();
    showToast(t('sl.saved'), 'success');
  });
})();

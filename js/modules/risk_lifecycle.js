/** Risk lifecycle: the production or product phases relevant to each risk. */
const RISK_LIFECYCLE_PHASES = [
  'design',
  'procurement',
  'manufacturing',
  'testing',
  'transport',
  'installation',
  'operation',
  'maintenance',
  'decommissioning',
  'custom',
];

// Read older single-phase records without changing version snapshots or imported data.
function riskLifecyclePhases(entry) {
  const lifecycle = entry.lifecycle || {};
  const selected = Array.isArray(lifecycle.phases) ? lifecycle.phases : [lifecycle.phase];
  return RISK_LIFECYCLE_PHASES.filter((phase) => selected.includes(phase));
}

function riskLifecycleAssigned(entry) {
  const lifecycle = entry.lifecycle || {};
  return riskLifecyclePhases(entry).some(
    (phase) =>
      phase !== 'custom' ||
      [lifecycle.customPhase, lifecycle.customPhase_en].some((name) => String(name || '').trim())
  );
}

function riskLifecyclePhaseLabels(entry, lang) {
  const lifecycle = entry.lifecycle || {};
  return riskLifecyclePhases(entry).map((phase) => {
    if (phase !== 'custom') return t('lifecycle.phase.' + phase, lang);
    return (
      String(getLocalizedField(lifecycle, 'customPhase', lang, { fallback: true }) || '').trim() ||
      String(lifecycle.customPhase_en || '').trim() ||
      t('lifecycle.customMissing', lang)
    );
  });
}

function riskLifecycleSelectionHtml(entry) {
  const labels = riskLifecyclePhaseLabels(entry);
  return labels.length
    ? `<ul>${labels.map((label) => `<li>${escapeHtml(label)}</li>`).join('')}</ul>`
    : `<span class="muted-hint">${t('lifecycle.unassigned')}</span>`;
}

function renderRiskLifecycle(analysis) {
  const container = document.getElementById('riskLifecycleContainer');
  if (!container || !analysis) return;
  const risks = analysis.riskEntries || [];
  if (!risks.length) {
    container.innerHTML = `<p class="muted-hint">${t('lifecycle.noRisks')}</p>`;
    return;
  }
  container.innerHTML = `
    <p id="riskLifecycleSummary" class="lifecycle-summary" role="status"></p>
    <div class="lifecycle-table-scroll"><table class="lifecycle-table">
      <thead><tr><th scope="col">${t('lifecycle.risk')}</th><th scope="col">${t('risk.asset')}</th><th scope="col">${t('lifecycle.phase')}</th><th scope="col">${t('lifecycle.notes')}</th></tr></thead>
      <tbody>${risks
        .map((entry) => {
          const lifecycle = entry.lifecycle || {};
          const phases = riskLifecyclePhases(entry);
          const name =
            getLocalizedField(
              { title: entry.rootName, title_en: entry.rootName_en },
              'title',
              undefined,
              { fallback: true }
            ) ||
            entry.rootName_en ||
            '';
          const uid = escapeHtml(entry.uid);
          return `<tr data-lifecycle-risk="${uid}">
          <th scope="row">${escapeHtml(entry.id)}: ${escapeHtml(name)}</th>
          <td>${escapeHtml(riskAssetLabel(analysis, entry))}</td>
          <td>
            <details class="lifecycle-phase-picker">
              <summary>${t('lifecycle.selectPhases')}</summary>
              <fieldset aria-label="${escapeHtml(entry.id + ': ' + t('lifecycle.phase'))}">
                ${RISK_LIFECYCLE_PHASES.map((phase) => `<label class="lifecycle-phase-option"><input type="checkbox" class="lifecycle-phase-checkbox" value="${phase}" ${phases.includes(phase) ? 'checked' : ''}><span>${t('lifecycle.phase.' + phase)}</span></label>`).join('')}
              </fieldset>
            </details>
            <div class="lifecycle-selected">${riskLifecycleSelectionHtml(entry)}</div>
            <div class="lifecycle-custom-wrap" ${phases.includes('custom') ? '' : 'hidden'}>
              <label for="lifecycleCustom-${uid}">${t('lifecycle.customName')}</label>
              <input id="lifecycleCustom-${uid}" class="lifecycle-custom" type="text" value="${escapeHtml(getLocalizedField(lifecycle, 'customPhase', undefined, { raw: true }))}">
            </div>
          </td>
          <td><textarea class="lifecycle-notes" rows="3" aria-label="${escapeHtml(entry.id + ': ' + t('lifecycle.notes'))}" placeholder="${t('lifecycle.notesHint')}">${escapeHtml(getLocalizedField(lifecycle, 'notes', undefined, { raw: true }))}</textarea></td>
        </tr>`;
        })
        .join('')}</tbody>
    </table></div>`;

  const updateSummary = () => {
    container.querySelector('#riskLifecycleSummary').textContent = tf('lifecycle.summary', {
      assigned: risks.filter(riskLifecycleAssigned).length,
      total: risks.length,
    });
  };
  updateSummary();
  container.querySelectorAll('[data-lifecycle-risk]').forEach((row) => {
    const entry = risks.find((risk) => risk.uid === row.dataset.lifecycleRisk);
    const checkboxes = row.querySelectorAll('.lifecycle-phase-checkbox');
    const custom = row.querySelector('.lifecycle-custom');
    const notes = row.querySelector('.lifecycle-notes');
    syncLocalizedInputHint(custom, entry.lifecycle || {}, 'customPhase', '');
    syncLocalizedInputHint(notes, entry.lifecycle || {}, 'notes', t('lifecycle.notesHint'));
    const persist = (field, value) => {
      if (!entry.lifecycle || typeof entry.lifecycle !== 'object' || Array.isArray(entry.lifecycle))
        entry.lifecycle = {};
      entry.lifecycle.phases = field === 'phases' ? value : riskLifecyclePhases(entry);
      delete entry.lifecycle.phase;
      if (field !== 'phases') setLocalizedField(entry.lifecycle, field, value);
      row.querySelector('.lifecycle-selected').innerHTML = riskLifecycleSelectionHtml(entry);
      saveAnalyses();
      updateSummary();
    };
    checkboxes.forEach((checkbox) =>
      checkbox.addEventListener('change', () => {
        const phases = Array.from(checkboxes)
          .filter((input) => input.checked)
          .map((input) => input.value);
        row.querySelector('.lifecycle-custom-wrap').hidden = !phases.includes('custom');
        persist('phases', phases);
      })
    );
    custom.addEventListener('input', () => persist('customPhase', custom.value));
    notes.addEventListener('input', () => persist('notes', notes.value));
  });
}

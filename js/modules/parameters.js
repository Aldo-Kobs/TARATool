/** Read-only Parameters reference. Editorial content lives in config/parameter_guide.js. */
(function () {
  window.renderParameters = function (analysis) {
    const container = document.getElementById('parametersContainer');
    const guide = window.PARAMETER_GUIDE;
    if (!container || !guide) return;
    const lang = TaraPrefs.getLang();
    const local = (value) => value?.[lang] || value?.en || '';
    const ui = (key) => local(guide.ui[key]);
    const esc = escapeHtml;
    const localized = (value, field) =>
      getLocalizedField(value, field, lang, { fallback: true }) || value?.[field] || '';

    const currentValues = (source) => {
      if (!source) return [];
      if (source === 'assetTypes')
        return ASSET_TYPES.map((type) => t('assets.type.option.' + type.toLowerCase(), lang));
      if (source === 'protection' || source === 'protectionNA')
        return [
          ...['I', 'II', 'III'].map(
            (level) => `${level} — ${ui('weight')}: ${PROTECTION_LEVEL_WEIGHTS[level]}`
          ),
          ui('unset'),
          ...(source === 'protectionNA' ? [ui('na')] : []),
        ];
      if (source === 'weights')
        return Object.entries(PROTECTION_LEVEL_WEIGHTS).map(
          ([level, weight]) => `${level}: ${weight}`
        );
      if (source === 'damageScale')
        return VALID_IMPACT_VALUES.map(
          (value) =>
            `${value} — ${IMPACT_LABELS[value] || value}${value === 'N/A' ? '' : `; ${ui('factor')}: ${SEVERITY_LEVEL_FACTORS[value] ?? 0}`}`
        );
      if (source === 'scenarios')
        return getDisplayDamageScenarios(analysis).map(
          (ds) => `${ds.id} — ${localized(ds, 'name')}: ${localized(ds, 'description')}`
        );
      if (source.startsWith('probability.')) {
        const criterion = PROBABILITY_CRITERIA[source.split('.')[1]];
        return (criterion?.options || []).map((option) => {
          const label = localized(option, 'text');
          const prefix = label.match(/^([0-9]+(?:[.,][0-9]+)?)\s*[-–]/);
          return prefix && Number(prefix[1].replace(',', '.')) === Number(option.value)
            ? label
            : `${option.value}: ${label}`;
        });
      }
      if (source === 'phases')
        return RISK_LIFECYCLE_PHASES.map(
          (phase) => `${t('lifecycle.phase.' + phase, lang)} — ${local(guide.phaseExamples[phase])}`
        );
      if (source === 'treatments')
        return ['rr.pleaseSelect', 'rr.treat.accept', 'rr.treat.delegate', 'rr.treat.mitigate'].map(
          (key) => t(key, lang)
        );
      if (source.startsWith('target.')) {
        const id = source.split('.')[1];
        const requirement = SECURITY_LEVEL_REQUIREMENTS.find((item) => item.id === id);
        return [
          `${id} — ${t('sl.requirement.' + id, lang)} (${requirement?.abbreviation || ''})`,
          `${t('sl.target', lang)}: ${securityLevelTargetText(getSecurityLevelTarget(analysis, id), lang)}`,
        ];
      }
      if (source.startsWith('bands.')) {
        const settings = getSecurityLevelMatrix(analysis);
        const bounds = source.endsWith('feasibility')
          ? settings.feasibilityBounds
          : settings.impactBounds;
        return Array.isArray(bounds) && bounds.length === 3
          ? SECURITY_LEVEL_BANDS.map(
              (band, index) =>
                `${t('sl.band.' + band, lang)}: ${securityLevelBandRange(bounds, index)}`
            )
          : [t('sl.notConfigured', lang)];
      }
      if (source === 'thresholds') {
        const ascending = [...RISK_THRESHOLDS].sort((a, b) => a.min - b.min);
        return ascending.map(
          (threshold, index) =>
            `${tRiskLabel(threshold.label, lang)}: ${threshold.min} ≤ R${ascending[index + 1] ? ` < ${ascending[index + 1].min}` : ''}`
        );
      }
      if (source === 'calculationExample') {
        const severity = Math.max(...Object.values(SEVERITY_LEVEL_FACTORS).map(Number));
        const weight = PROTECTION_LEVEL_WEIGHTS.II;
        const factors = ['K', 'S', 'T', 'U'].map((key) =>
          Number(PROBABILITY_CRITERIA[key]?.options?.[0]?.value)
        );
        if (![severity, weight, ...factors].every(Number.isFinite)) return [];
        const impact = severity * weight;
        const risk = impact * factors.reduce((sum, value) => sum + value, 0);
        return [
          `I = ${severity} × ${weight} = ${impact.toFixed(2)}; R = ${impact.toFixed(2)} × (${factors.join(' + ')}) = ${risk.toFixed(2)}`,
        ];
      }
      return [];
    };

    container.innerHTML = `<h3>${esc(ui('title'))}</h3>
      <p>${esc(ui('intro'))}</p>
      <label for="parameterSearch">${esc(ui('search'))}</label>
      <input id="parameterSearch" type="search" autocomplete="off" aria-controls="parameterSections">
      <p id="parameterCount" role="status"></p>
      <nav class="parameter-section-nav" aria-label="${esc(ui('title'))}">${guide.sections.map((section) => `<a href="#parameter-section-${esc(section.id)}">${esc(local(section.title))}</a>`).join('')}</nav>
      <div id="parameterSections">${guide.sections
        .map(
          (
            section
          ) => `<section id="parameter-section-${esc(section.id)}" class="parameter-section" data-parameter-section="${esc(section.id)}">
        <h4>${esc(local(section.title))}</h4>
        <div class="parameter-table-scroll"><table class="parameter-table">
          <thead><tr>${['field', 'help', 'values', 'example'].map((key) => `<th scope="col">${esc(ui(key))}</th>`).join('')}</tr></thead>
          <tbody>${section.fields
            .map((field) => {
              const values = currentValues(field.valueSource);
              return `<tr data-parameter-id="${esc(field.id)}">
              <th scope="row">${esc(local(field.label))}<span class="parameter-kind">${esc(ui(field.kind))}</span></th>
              <td>${esc(local(field.help))}</td>
              <td>${esc(local(field.values))}${values.length ? `<ul>${values.map((value) => `<li>${esc(value)}</li>`).join('')}</ul>` : ''}</td>
              <td>${esc(local(field.example))}</td>
            </tr>`;
            })
            .join('')}</tbody>
        </table></div>
      </section>`
        )
        .join('')}</div>
      <p id="parameterNoResults" hidden>${esc(ui('empty'))}</p>
      <details class="parameter-customization" open><summary>${esc(ui('editTitle'))}</summary>
        ${['guideFile', 'scoringFile', 'sync', 'editMore'].map((key) => `<p>${esc(ui(key))}</p>`).join('')}
        <p>${esc(ui('sources'))}: ${guide.sources.map((source) => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a>`).join(' · ')}</p>
      </details>`;

    const rows = Array.from(container.querySelectorAll('[data-parameter-id]'));
    const searchTexts = rows.map((row) => row.textContent.toLocaleLowerCase(lang));
    const filter = () => {
      const query = container
        .querySelector('#parameterSearch')
        .value.trim()
        .toLocaleLowerCase(lang);
      rows.forEach((row, index) => {
        row.hidden = !searchTexts[index].includes(query);
      });
      container.querySelectorAll('[data-parameter-section]').forEach((section) => {
        section.hidden = !section.querySelector('[data-parameter-id]:not([hidden])');
      });
      const count = rows.filter((row) => !row.hidden).length;
      container.querySelector('#parameterCount').textContent = ui('count').replace(
        '{count}',
        count
      );
      container.querySelector('#parameterNoResults').hidden = count !== 0;
    };
    container.querySelector('#parameterSearch').addEventListener('input', filter);
    filter();
  };
})();

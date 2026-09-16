/** CRA documentation review: Regulation (EU) 2024/2847, Annexes V and VII.
 * Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R2847
 * Checklist summaries checked on 2026-09-15. Not included in PDF reports.
 */
(function () {
  const ITEMS = [
    { id: 'V-1', annex: 'V', reference: 'V 1' },
    { id: 'V-2', annex: 'V', reference: 'V 2' },
    { id: 'V-3', annex: 'V', reference: 'V 3' },
    { id: 'V-4', annex: 'V', reference: 'V 4' },
    { id: 'V-5', annex: 'V', reference: 'V 5' },
    { id: 'V-6', annex: 'V', reference: 'V 6' },
    { id: 'V-7', annex: 'V', reference: 'V 7' },
    { id: 'V-8', annex: 'V', reference: 'V 8' },
    { id: 'VII-1', annex: 'VII', reference: 'VII 1' },
    { id: 'VII-1-a', annex: 'VII', reference: 'VII 1(a)' },
    { id: 'VII-1-b', annex: 'VII', reference: 'VII 1(b)' },
    { id: 'VII-1-c', annex: 'VII', reference: 'VII 1(c)' },
    { id: 'VII-1-d', annex: 'VII', reference: 'VII 1(d)' },
    { id: 'VII-2', annex: 'VII', reference: 'VII 2' },
    { id: 'VII-2-a', annex: 'VII', reference: 'VII 2(a)' },
    { id: 'VII-2-b', annex: 'VII', reference: 'VII 2(b)' },
    { id: 'VII-2-c', annex: 'VII', reference: 'VII 2(c)' },
    { id: 'VII-3', annex: 'VII', reference: 'VII 3' },
    { id: 'VII-4', annex: 'VII', reference: 'VII 4' },
    { id: 'VII-5', annex: 'VII', reference: 'VII 5' },
    { id: 'VII-6', annex: 'VII', reference: 'VII 6' },
    { id: 'VII-7', annex: 'VII', reference: 'VII 7' },
    { id: 'VII-8', annex: 'VII', reference: 'VII 8' },
  ];
  const isRecord = (value) => value && typeof value === 'object' && !Array.isArray(value);
  const readItems = (analysis) =>
    isRecord(analysis.craDocumentationChecklist?.items)
      ? analysis.craDocumentationChecklist.items
      : {};
  const readEntry = (analysis, id) => {
    const value = readItems(analysis)[id];
    return {
      checked: value?.checked === true,
      comment: typeof value?.comment === 'string' ? value.comment : '',
      link: typeof value?.link === 'string' ? value.link : '',
    };
  };
  const referenceUrl = (value) => {
    try {
      const url = new URL(value.trim());
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch (_) {
      return null;
    }
  };

  window.renderCraDocumentation = function (analysis) {
    const container = document.getElementById('craDocumentationContainer');
    if (!container || !analysis) return;
    container.innerHTML = `<h3>${t('tab.craDocumentation')}</h3>
      <p>${t('cra.intro')}</p>
      <p class="muted-hint">${t('cra.scope')} <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R2847" target="_blank" rel="noopener noreferrer">${t('cra.source')}</a></p>
      <p class="muted-hint">${t('cra.saved')}</p>
      <p id="craChecklistProgress" role="status"></p>
      ${['V', 'VII']
        .map(
          (
            annex
          ) => `<section class="cra-annex" data-cra-annex="${annex}" aria-labelledby="craAnnex-${annex}">
        <h4 id="craAnnex-${annex}">${t('cra.group.' + annex)}</h4>
        <p data-cra-progress="${annex}"></p>
        <div class="cra-table-scroll"><table class="cra-checklist-table">
          <thead><tr><th scope="col">${t('cra.checked')}</th><th scope="col">${t('cra.requirement')}</th><th scope="col">${t('cra.evidence')}</th></tr></thead>
          <tbody>${ITEMS.filter((item) => item.annex === annex)
            .map((item) => {
              const entry = readEntry(analysis, item.id);
              return `<tr data-cra-item="${item.id}" class="${entry.checked ? 'cra-checked' : ''}">
              <td><input id="craCheck-${item.id}" type="checkbox" class="cra-check" ${entry.checked ? 'checked' : ''} aria-labelledby="craRequirement-${item.id}"><span class="cra-item-status">${t(entry.checked ? 'cra.checked' : 'cra.open')}</span></td>
              <th scope="row"><label id="craRequirement-${item.id}" for="craCheck-${item.id}"><span class="cra-clause">${item.reference}</span>${t('cra.item.' + item.id + '.title')}</label><p>${t('cra.item.' + item.id + '.text')}</p></th>
              <td>
                <label for="craComment-${item.id}">${t('cra.comment')}</label>
                <textarea id="craComment-${item.id}" class="cra-comment" rows="3" placeholder="${escapeHtml(t('cra.commentHint'))}">${escapeHtml(entry.comment)}</textarea>
                <label for="craLink-${item.id}">${t('cra.link')}</label>
                <input id="craLink-${item.id}" class="cra-link" type="url" placeholder="https://…" value="${escapeHtml(entry.link)}" aria-describedby="craLinkError-${item.id}">
                <p id="craLinkError-${item.id}" class="cra-link-error" aria-live="polite" hidden>${t('cra.invalidLink')}</p>
                <a class="cra-open-link" target="_blank" rel="noopener noreferrer" hidden>${t('cra.openLink')}</a>
              </td>
            </tr>`;
            })
            .join('')}</tbody>
        </table></div>
      </section>`
        )
        .join('')}`;

    const updateProgress = () => {
      const summary = (items) =>
        tf('cra.summary', {
          checked: items.filter((item) => readEntry(analysis, item.id).checked).length,
          total: items.length,
        });
      container.querySelector('#craChecklistProgress').textContent = summary(ITEMS);
      for (const annex of ['V', 'VII']) {
        container.querySelector(`[data-cra-progress="${annex}"]`).textContent = summary(
          ITEMS.filter((item) => item.annex === annex)
        );
      }
    };
    updateProgress();
    container.querySelectorAll('[data-cra-item]').forEach((row) => {
      const id = row.dataset.craItem;
      const checkbox = row.querySelector('.cra-check');
      const comment = row.querySelector('.cra-comment');
      const link = row.querySelector('.cra-link');
      const updateLink = () => {
        const url = referenceUrl(link.value);
        const anchor = row.querySelector('.cra-open-link');
        anchor.hidden = !url;
        if (url) anchor.href = url;
        else anchor.removeAttribute('href');
        const invalid = link.value.trim() !== '' && !url;
        link.setAttribute('aria-invalid', String(invalid));
        row.querySelector('.cra-link-error').hidden = !invalid;
      };
      updateLink();
      const persist = () => {
        // Store only user input, using stable clause IDs rather than translated labels.
        if (!isRecord(analysis.craDocumentationChecklist))
          analysis.craDocumentationChecklist = { schemaVersion: 1, items: {} };
        const checklist = analysis.craDocumentationChecklist;
        if (!isRecord(checklist.items)) checklist.items = {};
        checklist.items[id] = {
          ...readEntry(analysis, id),
          checked: checkbox.checked,
          comment: comment.value,
          link: link.value,
        };
        row.classList.toggle('cra-checked', checkbox.checked);
        row.querySelector('.cra-item-status').textContent = t(
          checkbox.checked ? 'cra.checked' : 'cra.open'
        );
        saveAnalyses();
        updateProgress();
      };
      checkbox.addEventListener('change', persist);
      comment.addEventListener('input', persist);
      link.addEventListener('input', () => {
        updateLink();
        persist();
      });
    });
  };
})();

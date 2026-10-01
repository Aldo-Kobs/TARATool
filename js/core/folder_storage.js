/** Automatic folder storage. Modified by Aldo-Kobs, 22 September 2026. GPL-3.0-or-later. */
window.folderStorage = (() => {
  let revision = null;
  let pending = null;
  let running = null;
  let failed = false;
  let conflict = false;
  let saved = null;
  const enabled = !!window.TARA_FOLDER_STORAGE;
  const recoveryKey = 'taraFolderRecovery';
  function status(message, error = false) {
    const element = document.getElementById('folderStorageStatus');
    if (element) {
      element.textContent = message;
      element.style.color = error ? '#b42318' : '';
    }
  }
  async function request(url, options) {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
    const result = await response.json();
    if (!response.ok)
      throw Object.assign(new Error(result.error || 'Folder storage unavailable'), {
        status: response.status,
      });
    return result;
  }
  function recover(raw) {
    try {
      localStorage.setItem(recoveryKey, raw);
    } catch {
      /* Folder saves also work without browser storage. */
    }
  }
  async function drain() {
    while (pending !== null && !conflict) {
      const raw = pending;
      pending = null;
      status('Saving to analyses/…');
      try {
        const result = await request('/api/analyses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ revision, analyses: JSON.parse(raw) }),
        });
        revision = result.revision;
        saved = raw;
        failed = false;
        status('Saved to analyses/');
        try {
          if (pending === null) localStorage.removeItem(recoveryKey);
          else recover(pending);
        } catch {
          /* Optional recovery cache. */
        }
      } catch (error) {
        if (pending === null) pending = raw;
        recover(pending);
        failed = true;
        conflict = error.status === 409;
        status('Folder save failed: ' + error.message, true);
        return false;
      }
    }
    return !failed;
  }
  function flush() {
    if (conflict) return Promise.resolve(false);
    if (!running)
      running = drain().finally(() => {
        running = null;
      });
    return running;
  }
  function save(data) {
    if (revision === null) return false;
    const raw = JSON.stringify(data);
    if (raw === saved && pending === null && !running) return true;
    pending = raw;
    recover(raw);
    void flush();
    return true;
  }
  async function initialize() {
    const migration =
      location.protocol === 'file:' && location.hash.match(/^#tara-migrate=(\d+):([a-f0-9]{64})$/);
    if (migration) {
      const raw = localStorage.getItem('taraAnalyses');
      const destination = `http://127.0.0.1:${migration[1]}`;
      if (raw) {
        await request(destination + '/api/migrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Tara-Migration': migration[2] },
          body: JSON.stringify({ analyses: JSON.parse(raw) }),
        });
        location.replace(destination);
        return [];
      }
      throw new Error(
        'No analyses found in this browser/profile. Open the migration link in the browser you previously used.'
      );
    }
    if (!enabled) {
      status(
        'Browser storage only. Start with python3 scripts/server.py for automatic saving to analyses/.',
        true
      );
      return null;
    }
    const result = await request('/api/analyses');
    revision = result.revision;
    let data = result.analyses;
    let legacy = null;
    let recovery = null;
    try {
      legacy = localStorage.getItem('taraAnalyses');
      recovery = localStorage.getItem(recoveryKey);
    } catch {
      /* Browser storage is optional in folder mode. */
    }
    if (data === null) {
      data = legacy ? JSON.parse(legacy) : [createDefaultAnalysis()];
      if (!Array.isArray(data))
        throw new Error('Invalid browser data; automatic transfer stopped.');
      save(data);
      if (!(await flush()))
        throw new Error('Initial folder save failed. Check folder permissions and retry.');
    } else {
      saved = JSON.stringify(data);
      status('Saved to analyses/');
    }
    if (recovery && recovery !== JSON.stringify(data)) {
      // Keep failed edits as separate analyses; never overwrite the newer disk copy.
      const recovered = JSON.parse(recovery);
      const copies = recovered.filter(
        (a) => !data.some((d) => JSON.stringify(d) === JSON.stringify(a))
      );
      for (const a of copies) {
        a.id = generateUID('recovered');
        a.name += ' (recovered browser copy)';
        data.push(a);
      }
      if (copies.length) {
        save(data);
        if (!(await flush())) throw new Error('Could not save recovered browser edits.');
      }
    }
    return data;
  }
  window.addEventListener('hashchange', () => {
    if (location.protocol === 'file:' && location.hash.startsWith('#tara-migrate='))
      location.reload();
  });
  window.addEventListener('beforeunload', (event) => {
    if (enabled && (pending !== null || running || failed)) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  setInterval(() => {
    if (enabled && pending !== null && !conflict) void flush();
  }, 5000);
  return { enabled, initialize, save, flush, status };
})();

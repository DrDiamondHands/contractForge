/**
 * contracts.js — Contract lifecycle management
 * Handles global state, contract creation, switching, and the
 * refreshUI() orchestrator that keeps all panels in sync.
 */

// ── Global state (mutated by storage.js on load) ──────────────────
let contracts        = {};
let activeContractId = null;

// ── Accessors ─────────────────────────────────────────────────────

/** Return the currently active contract object, or null. */
function getActive() {
  return activeContractId ? contracts[activeContractId] : null;
}

// ── Modal helpers ─────────────────────────────────────────────────

function openNewContractModal() {
  document.getElementById('new-contract-modal').classList.add('open');
}

function closeNewContractModal() {
  document.getElementById('new-contract-modal').classList.remove('open');
}

// ── Contract creation ─────────────────────────────────────────────

function createNewContract() {
  const title = document.getElementById('nc-title').value.trim();
  const type  = document.getElementById('nc-type').value;
  const value = document.getElementById('nc-value').value;
  const co    = document.getElementById('nc-co').value.trim();

  if (!title) { alert('Please enter a contract title.'); return; }

  const id = 'c_' + Date.now();

  // Pre-populate checklist state from the template for this contract type
  const checklist = {};
  const tpl = CHECKLIST_TEMPLATES[type] || CHECKLIST_TEMPLATES.competitive;
  Object.values(tpl).forEach(items => items.forEach(i => { checklist[i.id] = false; }));

  contracts[id] = {
    id,
    title,
    type,
    value,
    info:       { 'ci-co': co, 'ci-value': value },
    checklist,
    clauses:    {},
    forms:      {},
    lineItems:  [],
    pwsTasks:   [],
  };

  // Reset modal inputs
  document.getElementById('nc-title').value = '';
  document.getElementById('nc-value').value = '';
  document.getElementById('nc-co').value    = '';

  closeNewContractModal();
  rebuildContractSwitcher();
  switchContract(id);
  saveAll();
}

// ── Switcher ──────────────────────────────────────────────────────

/** Rebuild the <select> in the header from the current contracts map. */
function rebuildContractSwitcher() {
  const sel = document.getElementById('contract-switcher');
  sel.innerHTML = '<option value="">— Select Contract File —</option>';
  Object.values(contracts).forEach(c => {
    const opt = document.createElement('option');
    opt.value       = c.id;
    opt.textContent = c.title;
    if (c.id === activeContractId) opt.selected = true;
    sel.appendChild(opt);
  });
}

/** Switch the active contract and refresh all panels. */
function switchContract(id) {
  activeContractId = id || null;
  document.getElementById('contract-switcher').value = id || '';
  saveAll();
  refreshUI();
}

// ── Master refresh ────────────────────────────────────────────────

/**
 * refreshUI — central orchestrator.
 * Called whenever the active contract changes. Updates every panel.
 */
function refreshUI() {
  const c      = getActive();
  const hasCon = !!c;

  // ── Dashboard ──
  document.getElementById('no-contract-notice').style.display = hasCon ? 'none' : '';
  document.getElementById('dash-content').style.display       = hasCon ? ''     : 'none';

  if (hasCon) {
    const pill = document.getElementById('dash-type-pill');
    pill.textContent = CONTRACT_TYPE_LABELS[c.type] || c.type;

    // Overwrite only the text node before the pill (leave pill in place)
    const h1 = document.getElementById('dash-title');
    h1.childNodes[0].textContent = c.title + ' ';

    // Stats
    updateStatProgress();
    const selCount = Object.values(c.clauses || {}).filter(Boolean).length;
    document.getElementById('stat-clauses').textContent = selCount;
    document.getElementById('stat-type').textContent    = CONTRACT_TYPE_LABELS[c.type] || '—';
    const val = c.info?.['ci-value'] || c.value || 0;
    document.getElementById('stat-value').textContent   = '$' + Number(val).toLocaleString();

    // Restore contract info fields
    CONTRACT_INFO_FIELDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = (c.info || {})[id] || '';
    });
  }

  // ── Show/hide no-contract notices for every sub-panel ──
  ['checklist', 'clauses', 'folder', 'sf1449', 'dd1155', 'pws'].forEach(key => {
    const notice  = document.getElementById(`${key}-no-contract`);
    const content = document.getElementById(`${key}-content`);
    if (notice)  notice.style.display  = hasCon ? 'none' : '';
    if (content) content.style.display = hasCon ? ''     : 'none';
  });

  // ── Delegate to module renderers ──
  if (hasCon) {
    renderChecklist();
    renderClauses();
    renderFolderTree();
    prefillSF1449();
    prefillDD1155();
    renderLineItems();
    renderPWSTasks();
    restoreForms();
  }
}

// ── Contract info (Dashboard card) ───────────────────────────────

function saveContractInfo() {
  const c = getActive();
  if (!c) return;
  if (!c.info) c.info = {};

  CONTRACT_INFO_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) c.info[id] = el.value;
  });

  // Live-update the value stat card
  const val = c.info['ci-value'];
  if (val) document.getElementById('stat-value').textContent = '$' + Number(val).toLocaleString();

  saveAll();
}

// ── Progress stat (shared between checklist.js and here) ─────────

function updateStatProgress() {
  const c     = getActive();
  if (!c) return;
  const items = Object.values(c.checklist || {});
  const done  = items.filter(Boolean).length;
  const pct   = items.length ? Math.round(done / items.length * 100) : 0;
  document.getElementById('stat-progress').textContent     = pct + '%';
  document.getElementById('stat-progress-sub').textContent = `${done} of ${items.length} items complete`;
}

/**
 * forms.js — Form panels: SF-1449, DD-1155, PWS/SOW
 * Handles pre-fill from contract info, save/restore, line items,
 * PWS tasks, tab switching, and text exports.
 */

// ═══════════════════════════════════════════
// SHARED FORM SAVE / RESTORE
// ═══════════════════════════════════════════

/** Persist all form field values to the active contract. */
function saveForms() {
  const c = getActive();
  if (!c) return;
  if (!c.forms) c.forms = {};

  document.querySelectorAll('[id^="sf-"],[id^="dd-"],[id^="pws-"],[id^="sow-"]')
    .forEach(el => { c.forms[el.id] = el.value; });

  saveAll();
}

/** Restore all saved form values to their fields. */
function restoreForms() {
  const c = getActive();
  if (!c || !c.forms) return;

  Object.entries(c.forms).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
}

// ═══════════════════════════════════════════
// SF-1449 PRE-FILL
// ═══════════════════════════════════════════

/**
 * Pre-fill SF-1449 fields from the contract info card.
 * Also restores any previously saved overrides.
 */
function prefillSF1449() {
  const c = getActive();
  if (!c) return;

  const info = c.info || {};
  const map = {
    'sf-contract-no': info['ci-number'],
    'sf-sol-no':      info['ci-sol'],
    'sf-award-date':  info['ci-award-date'],
    'sf-contractor':  info['ci-contractor'],
    'sf-cage':        info['ci-cage'],
    'sf-co-name':     info['ci-co'],
    'sf-perf-end':    info['ci-pop'],
    'sf-amount':      info['ci-value'],
  };

  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  });

  restoreForms(); // user overrides win over auto-fill
}

// ═══════════════════════════════════════════
// DD-1155 PRE-FILL
// ═══════════════════════════════════════════

/** Pre-fill DD-1155 fields from the contract info card. */
function prefillDD1155() {
  const c = getActive();
  if (!c) return;

  const info = c.info || {};
  const map = {
    'dd-contract-no': info['ci-number'],
    'dd-vendor':      info['ci-contractor'],
    'dd-cage':        info['ci-cage'],
    'dd-co-name':     info['ci-co'],
  };

  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  });

  restoreForms();
}

// ═══════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════

/** Export a plain-text summary of an SF-1449 or DD-1155 form. */
function exportFormText(formName) {
  const c = getActive();
  if (!c) return;

  const prefix = formName === 'SF-1449' ? 'sf-' : 'dd-';
  let out = `=== ${formName} — ${c.title} ===\n\n`;

  document.querySelectorAll(`[id^="${prefix}"]`).forEach(el => {
    if (el.value) {
      const labelEl = el.previousElementSibling;
      const label   = labelEl?.textContent || el.id;
      out += `${label}: ${el.value}\n`;
    }
  });

  download(`${formName.replace(/\W/g, '_')}_${c.title.replace(/\s/g, '_')}.txt`, out);
}

/** Export the PWS or SOW as a plain-text file. */
function exportPWS() {
  const c = getActive();
  if (!c) return;

  const f   = c.forms || {};
  let   out = `PERFORMANCE WORK STATEMENT\nContract: ${c.title}\n\n`;

  out += `1.0 PURPOSE\n${f['pws-purpose']    || ''}\n\n`;
  out += `1.2 BACKGROUND\n${f['pws-background'] || ''}\n\n`;
  out += `2.0 SCOPE\n${f['pws-scope']       || ''}\n\n`;
  out += `3.0 TASKS\n`;
  (c.pwsTasks || []).forEach((t, i) => { out += `  Task ${i + 1}: ${t}\n`; });
  out += `\n4.0 DELIVERABLES\n${f['pws-deliverables'] || ''}\n\n`;
  out += `5.0 GFE/GFI\n${f['pws-gfe']        || ''}\n\n`;
  out += `6.0 PLACE OF PERFORMANCE: ${f['pws-place']  || ''}\n`;
  out += `PERIOD OF PERFORMANCE: ${f['pws-period']    || ''}\n`;

  download(`PWS_${c.title.replace(/\s/g, '_')}.txt`, out);
}

// ═══════════════════════════════════════════
// DD-1155 LINE ITEMS
// ═══════════════════════════════════════════

function renderLineItems() {
  const c = getActive();
  if (!c) return;

  const container = document.getElementById('dd-line-items');
  container.innerHTML = '';

  (c.lineItems || []).forEach((li, i) => {
    const row = document.createElement('div');
    row.style.cssText =
      'display:grid;grid-template-columns:60px 1fr 80px 100px 120px auto;gap:8px;align-items:center;margin-bottom:8px';
    row.innerHTML = `
      <input type="text"   value="${li.clin  || ''}" placeholder="CLIN"        oninput="updateLineItem(${i},'clin',this.value)">
      <input type="text"   value="${li.desc  || ''}" placeholder="Description"  oninput="updateLineItem(${i},'desc',this.value)">
      <input type="number" value="${li.qty   || ''}" placeholder="Qty"          oninput="updateLineItem(${i},'qty',this.value)">
      <input type="text"   value="${li.unit  || ''}" placeholder="Unit"         oninput="updateLineItem(${i},'unit',this.value)">
      <input type="number" value="${li.price || ''}" placeholder="Unit Price"   oninput="updateLineItem(${i},'price',this.value)">
      <button class="btn btn-ghost btn-sm" onclick="removeLineItem(${i})">✕</button>
    `;
    container.appendChild(row);
  });
}

function addLineItem() {
  const c = getActive();
  if (!c) return;
  if (!c.lineItems) c.lineItems = [];
  c.lineItems.push({
    clin:  String(c.lineItems.length + 1).padStart(4, '0'),
    desc:  '',
    qty:   1,
    unit:  'EA',
    price: 0,
  });
  renderLineItems();
  saveAll();
}

function updateLineItem(index, field, value) {
  const c = getActive();
  if (!c || !c.lineItems) return;
  c.lineItems[index][field] = value;
  saveAll();
}

function removeLineItem(index) {
  const c = getActive();
  if (!c) return;
  c.lineItems.splice(index, 1);
  renderLineItems();
  saveAll();
}

// ═══════════════════════════════════════════
// PWS TASKS
// ═══════════════════════════════════════════

function renderPWSTasks() {
  const c = getActive();
  if (!c) return;

  const container = document.getElementById('pws-tasks');
  container.innerHTML = '';

  (c.pwsTasks || []).forEach((task, i) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center';
    row.innerHTML = `
      <span style="font-family:var(--mono);font-size:0.75rem;color:var(--muted);min-width:70px">
        Task ${i + 1}
      </span>
      <input type="text" value="${task}" placeholder="Task description..." style="flex:1"
             oninput="updatePWSTask(${i}, this.value)">
      <button class="btn btn-ghost btn-sm" onclick="removePWSTask(${i})">✕</button>
    `;
    container.appendChild(row);
  });
}

function addPWSTask() {
  const c = getActive();
  if (!c) return;
  if (!c.pwsTasks) c.pwsTasks = [];
  c.pwsTasks.push('');
  renderPWSTasks();
  saveAll();
}

function updatePWSTask(index, value) {
  const c = getActive();
  if (!c) return;
  c.pwsTasks[index] = value;
  saveAll();
}

function removePWSTask(index) {
  const c = getActive();
  if (!c) return;
  c.pwsTasks.splice(index, 1);
  renderPWSTasks();
  saveAll();
}

// ═══════════════════════════════════════════
// PWS / SOW TAB SWITCHING
// ═══════════════════════════════════════════

function switchPWSTab(tab) {
  document.querySelectorAll('#panel-pws .tab').forEach(el => {
    const t = el.getAttribute('onclick').match(/'(\w+)'/)?.[1];
    el.classList.toggle('active', t === tab);
  });
  document.querySelectorAll('[id^="pws-tab-"]').forEach(panel => {
    panel.classList.toggle('active', panel.id === `pws-tab-${tab}`);
  });
}

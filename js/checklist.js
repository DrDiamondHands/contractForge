/**
 * checklist.js — Document checklist panel
 * Renders the checklist for the active contract type and handles
 * checkbox toggle events.
 */

/** Render all checklist groups and update the progress bar. */
function renderChecklist() {
  const c = getActive();
  if (!c) return;

  const tpl       = CHECKLIST_TEMPLATES[c.type] || CHECKLIST_TEMPLATES.competitive;
  const checklist = c.checklist;
  const container = document.getElementById('checklist-groups');
  container.innerHTML = '';

  let total = 0;
  let done  = 0;

  Object.entries(tpl).forEach(([groupName, items]) => {
    const group = document.createElement('div');
    group.className  = 'checklist-group';
    group.innerHTML  = `<h3>${groupName}</h3>`;

    items.forEach(item => {
      total++;
      const checked = checklist[item.id] || false;
      if (checked) done++;

      const row = document.createElement('div');
      row.className = 'checklist-item' + (checked ? ' done' : '');
      row.innerHTML = `
        <input type="checkbox" ${checked ? 'checked' : ''}
               onchange="toggleChecklistItem('${item.id}', this.checked)">
        <span class="item-label">${item.label}</span>
        ${item.ref ? `<span class="item-req">${item.ref}</span>` : ''}
      `;
      group.appendChild(row);
    });

    container.appendChild(group);
  });

  _updateProgressBar(done, total);
}

/** Toggle a single checklist item and persist. */
function toggleChecklistItem(id, checked) {
  const c = getActive();
  if (!c) return;
  c.checklist[id] = checked;
  renderChecklist();
  updateStatProgress();
  saveAll();
}

/** Update the progress bar and label in the checklist panel. */
function _updateProgressBar(done, total) {
  const pct = total ? Math.round(done / total * 100) : 0;
  document.getElementById('cl-progress-bar').style.width     = pct + '%';
  document.getElementById('cl-progress-label').textContent   =
    `${done} of ${total} documents complete (${pct}%)`;
}

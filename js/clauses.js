/**
 * clauses.js — FAR/DFARS clause builder panel
 * Renders clause cards for each tab, handles checkbox toggles,
 * and manages the "Selected" summary tab.
 */

let activeClauseTab = 'mandatory';

/** Render all clause tab panels for the active contract. */
function renderClauses() {
  const c = getActive();
  if (!c) return;

  ['mandatory', 'commercial', 'construction', 'dfars'].forEach(tab => {
    const container = document.getElementById(`clause-tab-${tab}`);
    container.innerHTML = '';

    (CLAUSES[tab] || []).forEach(cl => {
      const selected = c.clauses[cl.num] || false;
      const card     = document.createElement('div');
      card.className = 'clause-card';
      card.innerHTML = `
        <input type="checkbox" ${selected ? 'checked' : ''}
               onchange="toggleClause('${cl.num}', this.checked)">
        <div class="clause-info">
          <div class="clause-num">${cl.num}</div>
          <div class="clause-title">${cl.title}</div>
          <div class="clause-desc">${cl.desc}</div>
          <div class="clause-tags">
            ${cl.tags.map(t => `<span class="badge badge-blue">${t}</span>`).join('')}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  });

  _updateClauseCount();
  if (activeClauseTab === 'selected') renderSelectedClauses();
}

/** Toggle a single clause and persist. */
function toggleClause(num, checked) {
  const c = getActive();
  if (!c) return;
  c.clauses[num] = checked;
  _updateClauseCount();
  saveAll();
  // Re-render the source tab so the checkbox state is consistent
  renderClauses();
}

/** Render the "Selected" summary tab. */
function renderSelectedClauses() {
  const c         = getActive();
  const container = document.getElementById('selected-clauses-list');
  if (!c) { container.innerHTML = ''; return; }

  const selected = _getAllSelectedClauses(c);

  if (!selected.length) {
    container.innerHTML = `
      <div class="text-muted" style="padding:20px">
        No clauses selected yet. Select clauses from the other tabs.
      </div>`;
    return;
  }

  container.innerHTML = selected.map(cl => `
    <div class="clause-card">
      <input type="checkbox" checked onchange="toggleClause('${cl.num}', this.checked)">
      <div class="clause-info">
        <div class="clause-num">${cl.num}</div>
        <div class="clause-title">${cl.title}</div>
        <div class="clause-desc">${cl.desc}</div>
      </div>
    </div>
  `).join('');
}

/** Switch the visible clause tab. */
function switchClauseTab(tab) {
  activeClauseTab = tab;

  document.querySelectorAll('#panel-clauses .tab').forEach(el => {
    const tabName = el.getAttribute('onclick').match(/'(\w+)'/)?.[1];
    el.classList.toggle('active', tabName === tab);
  });

  document.querySelectorAll('[id^="clause-tab-"]').forEach(panel => {
    panel.classList.toggle('active', panel.id === `clause-tab-${tab}`);
  });

  if (tab === 'selected') renderSelectedClauses();
}

// ── Helpers ───────────────────────────────────────────────────────

function _getAllSelectedClauses(c) {
  const selected = [];
  Object.entries(CLAUSES).forEach(([, cls]) =>
    cls.forEach(cl => { if (c.clauses[cl.num]) selected.push(cl); })
  );
  return selected;
}

function _updateClauseCount() {
  const c     = getActive();
  const count = c ? Object.values(c.clauses).filter(Boolean).length : 0;
  document.getElementById('selected-clause-count').textContent = count;
  document.getElementById('stat-clauses').textContent          = count;
}

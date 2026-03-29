/**
 * nav.js — Navigation and app initialization
 * This file is loaded last. It wires up panel switching and
 * bootstraps the app from localStorage.
 */

// ── Panel switching ────────────────────────────────────────────────

/** Show the named panel and mark its nav link active. */
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('panel-' + name)?.classList.add('active');
  document.getElementById('nav-'   + name)?.classList.add('active');
}

// ── Bootstrap ──────────────────────────────────────────────────────

(function init() {
  loadAll();               // restore state from localStorage
  rebuildContractSwitcher(); // populate the header <select>
  refreshUI();             // render all panels for the active contract
})();

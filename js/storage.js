/**
 * storage.js — Persistence layer
 * Wraps localStorage so the rest of the app never touches it directly.
 */

const STORAGE_KEY = 'contractforge_v2';

/** Save the full application state to localStorage. */
function saveAll() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ contracts, activeContractId }));
  flashSaveIndicator();
}

/** Load application state from localStorage on startup. */
function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const data = JSON.parse(raw);
    contracts        = data.contracts        || {};
    activeContractId = data.activeContractId || null;
  }
}

/** Flash the "✓ Saved" indicator in the header. */
function flashSaveIndicator() {
  const el = document.getElementById('save-indicator');
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1500);
}

/** Download text content as a file. */
function download(filename, text) {
  const a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  a.download = filename;
  a.click();
}

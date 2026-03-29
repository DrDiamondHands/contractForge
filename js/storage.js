/**
 * storage.js — Persistence layer
 * Syncs to Cloudflare Worker API with localStorage as local cache.
 */

const API_BASE   = 'https://contractforge-api.tylerhat12.workers.dev/api';
const STORAGE_KEY = 'contractforge_v2';

// ── Local cache ────────────────────────────────────────────────────

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ contracts, activeContractId }));
}

function loadLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const data       = JSON.parse(raw);
    contracts        = data.contracts        || {};
    activeContractId = data.activeContractId || null;
  }
}

// ── API ────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function loadFromServer() {
  try {
    showSyncStatus('syncing');
    const rows = await apiFetch('/contracts');
    const fetched = await Promise.all(rows.map(row => apiFetch(`/contracts/${row.id}`)));
    contracts = {};
    fetched.forEach(row => {
      contracts[row.id] = { id: row.id, title: row.title, type: row.type, value: row.value, ...row.data };
    });
    saveLocal();
    showSyncStatus('saved');
  } catch (err) {
    console.warn('Could not load from server, using local cache:', err);
    showSyncStatus('error');
    loadLocal();
  }
}

async function saveAll() {
  saveLocal();
  const c = getActive();
  if (!c) return;
  const { id, title, type, value, ...data } = c;
  const payload = { id, title, type, value, data };
  try {
    showSyncStatus('syncing');
    const exists = await apiFetch(`/contracts/${id}`).then(() => true).catch(() => false);
    if (exists) {
      await apiFetch(`/contracts/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await apiFetch('/contracts', { method: 'POST', body: JSON.stringify(payload) });
    }
    showSyncStatus('saved');
  } catch (err) {
    console.warn('Could not sync to server:', err);
    showSyncStatus('error');
  }
}

async function deleteContractFromServer(id) {
  try {
    await apiFetch(`/contracts/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Could not delete from server:', err);
  }
  delete contracts[id];
  if (activeContractId === id) activeContractId = null;
  saveLocal();
}

async function loadAll() {
  loadLocal();
  await loadFromServer();
}

// ── UI helpers ──────────────────────────────────
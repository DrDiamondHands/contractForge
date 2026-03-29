// ============================================================
// ContractForge — Frontend Auth Module
// File: js/auth.js
//
// Add to index.html <head> BEFORE your other scripts:
//   <script src="js/auth.js"></script>
//
// The auth gate overlay is injected automatically on load.
// The main app shell is hidden until login/register succeeds.
//
// Set this to your Cloudflare Worker URL:
const CF_WORKER_URL = 'https://contractforge-api.YOUR-SUBDOMAIN.workers.dev';
// ============================================================

(function () {
  'use strict';

  // ── Token storage ──

  function getToken() { return localStorage.getItem('cf_token'); }
  function setToken(t) { localStorage.setItem('cf_token', t); }
  function clearToken() { localStorage.removeItem('cf_token'); localStorage.removeItem('cf_user'); }
  function getUser() {
    try { return JSON.parse(localStorage.getItem('cf_user')); } catch { return null; }
  }
  function setUser(u) { localStorage.setItem('cf_user', JSON.stringify(u)); }

  // ── API calls ──

  async function apiPost(path, data) {
    const res = await fetch(`${CF_WORKER_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async function apiVerify(token) {
    const res = await fetch(`${CF_WORKER_URL}/api/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  }

  // ── Inject auth overlay HTML ──

  function injectAuthOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'cf-auth-overlay';
    overlay.innerHTML = `
      <div class="cf-auth-shell">
        <div class="cf-auth-sidebar">
          <div class="cf-auth-logo">
            <div class="cf-auth-logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L9 4L15 14H3Z" fill="#1a1200"/>
              </svg>
            </div>
            <span class="cf-auth-logo-text">ContractForge</span>
          </div>
          <p class="cf-auth-tagline">Contract lifecycle<br>management platform</p>
          <div class="cf-auth-features">
            <div class="cf-auth-feature"><div class="cf-auth-dot"></div><span>AI-assisted contract drafting</span></div>
            <div class="cf-auth-feature"><div class="cf-auth-dot"></div><span>FAR/DFARS clause builder</span></div>
            <div class="cf-auth-feature"><div class="cf-auth-dot"></div><span>SF-1449 &amp; DD-1155 forms</span></div>
            <div class="cf-auth-feature"><div class="cf-auth-dot"></div><span>Document checklist &amp; audit trail</span></div>
            <div class="cf-auth-feature"><div class="cf-auth-dot"></div><span>Cross-device sync</span></div>
          </div>
          <p class="cf-auth-footer-note">SOC 2 Type II · 256-bit encryption</p>
        </div>

        <div class="cf-auth-main">
          <div class="cf-auth-tabs">
            <button class="cf-auth-tab active" id="tab-signup" onclick="cfAuth.showTab('signup')">Create account</button>
            <button class="cf-auth-tab" id="tab-login" onclick="cfAuth.showTab('login')">Sign in</button>
          </div>

          <!-- SIGN UP -->
          <div class="cf-auth-section" id="cf-section-signup">
            <p class="cf-auth-heading">Start forging contracts</p>
            <p class="cf-auth-sub">Set up your workspace in under 2 minutes.</p>

            <div class="cf-auth-row">
              <div class="cf-auth-field">
                <label class="cf-auth-label">First name</label>
                <input class="cf-auth-input" id="su-first" type="text" placeholder="Jane" />
              </div>
              <div class="cf-auth-field">
                <label class="cf-auth-label">Last name</label>
                <input class="cf-auth-input" id="su-last" type="text" placeholder="Doe" />
              </div>
            </div>

            <div class="cf-auth-field">
              <label class="cf-auth-label">Work email</label>
              <input class="cf-auth-input" id="su-email" type="email" placeholder="jane@agency.gov" />
              <span class="cf-auth-error" id="su-email-err"></span>
            </div>

            <div class="cf-auth-field">
              <label class="cf-auth-label">Organization</label>
              <input class="cf-auth-input" id="su-company" type="text" placeholder="Defense Logistics Agency" />
            </div>

            <div class="cf-auth-row">
              <div class="cf-auth-field">
                <label class="cf-auth-label">Role</label>
                <select class="cf-auth-select" id="su-role">
                  <option value="">Select role</option>
                  <option>Legal counsel</option>
                  <option>Procurement</option>
                  <option>Finance</option>
                  <option>Operations</option>
                  <option>Executive</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="cf-auth-field">
                <label class="cf-auth-label">Team size</label>
                <select class="cf-auth-select" id="su-team">
                  <option value="">Select size</option>
                  <option>1–10</option>
                  <option>11–50</option>
                  <option>51–200</option>
                  <option>200+</option>
                </select>
              </div>
            </div>

            <div class="cf-auth-field">
              <label class="cf-auth-label">Password</label>
              <input class="cf-auth-input" id="su-pass" type="password" placeholder="Min. 8 characters" oninput="cfAuth.checkStrength(this.value)" />
              <div class="cf-auth-strength"><div class="cf-auth-strength-bar" id="strength-bar"></div></div>
              <span class="cf-auth-strength-label" id="strength-label"></span>
              <span class="cf-auth-error" id="su-pass-err"></span>
            </div>

            <div class="cf-auth-agree">
              <input type="checkbox" id="su-terms" />
              <label for="su-terms">I agree to the <a href="#" onclick="return false">Terms of Service</a> and <a href="#" onclick="return false">Privacy Policy</a></label>
            </div>

            <span class="cf-auth-error" id="su-general-err" style="display:block;margin-bottom:8px;"></span>
            <button class="cf-auth-btn accent" id="su-submit" onclick="cfAuth.register()">Create my account</button>
          </div>

          <!-- SIGN IN -->
          <div class="cf-auth-section" id="cf-section-login" style="display:none">
            <p class="cf-auth-heading">Welcome back</p>
            <p class="cf-auth-sub">Sign in to your ContractForge workspace.</p>

            <div class="cf-auth-field">
              <label class="cf-auth-label">Email</label>
              <input class="cf-auth-input" id="li-email" type="email" placeholder="jane@agency.gov" />
              <span class="cf-auth-error" id="li-email-err"></span>
            </div>

            <div class="cf-auth-field">
              <label class="cf-auth-label">Password</label>
              <input class="cf-auth-input" id="li-pass" type="password" placeholder="Your password" />
              <span class="cf-auth-error" id="li-pass-err"></span>
            </div>

            <span class="cf-auth-error" id="li-general-err" style="display:block;margin-bottom:8px;"></span>
            <button class="cf-auth-btn accent" id="li-submit" onclick="cfAuth.login()">Sign in</button>
          </div>
        </div>
      </div>
    `;
    document.body.prepend(overlay);
    injectAuthStyles();
  }

  function injectAuthStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #cf-auth-overlay {
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(10,10,14,0.85);
        backdrop-filter: blur(4px);
        font-family: 'IBM Plex Sans', sans-serif;
      }
      .cf-auth-shell {
        display: flex; width: 720px; max-width: 96vw;
        min-height: 520px; border-radius: 12px; overflow: hidden;
        box-shadow: 0 24px 64px rgba(0,0,0,0.5);
      }
      .cf-auth-sidebar {
        width: 220px; flex-shrink: 0; background: #0f1117;
        padding: 2rem 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;
      }
      .cf-auth-logo { display: flex; align-items: center; gap: 10px; }
      .cf-auth-logo-icon {
        width: 30px; height: 30px; background: #e8b84b;
        border-radius: 6px; display: flex; align-items: center; justify-content: center;
      }
      .cf-auth-logo-text {
        font-family: 'IBM Plex Mono', monospace; font-size: 14px;
        font-weight: 600; color: #f5f0e8; letter-spacing: 0.01em;
      }
      .cf-auth-tagline {
        font-size: 11px; color: #5a5a6a;
        font-family: 'IBM Plex Mono', monospace;
        letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.6;
      }
      .cf-auth-features { display: flex; flex-direction: column; gap: 10px; flex: 1; }
      .cf-auth-feature { display: flex; align-items: flex-start; gap: 8px; }
      .cf-auth-dot {
        width: 5px; height: 5px; border-radius: 50%;
        background: #e8b84b; flex-shrink: 0; margin-top: 5px;
      }
      .cf-auth-feature span { font-size: 12px; color: #8888a0; line-height: 1.4; }
      .cf-auth-footer-note { font-size: 10px; color: #3a3a4a; font-family: 'IBM Plex Mono', monospace; }

      .cf-auth-main {
        flex: 1; padding: 2rem 1.75rem;
        background: #1a1b23; display: flex; flex-direction: column;
      }
      .cf-auth-tabs { display: flex; border-bottom: 1px solid #2a2b35; margin-bottom: 1.5rem; }
      .cf-auth-tab {
        font-size: 13px; font-weight: 500; color: #5a5a72;
        padding: 0.5rem 1rem; cursor: pointer; border: none;
        background: none; border-bottom: 2px solid transparent;
        margin-bottom: -1px; font-family: 'IBM Plex Sans', sans-serif;
        transition: color 0.15s, border-color 0.15s;
      }
      .cf-auth-tab.active { color: #e8b84b; border-bottom-color: #e8b84b; }

      .cf-auth-heading {
        font-family: 'IBM Plex Mono', monospace; font-size: 18px;
        font-weight: 600; color: #f0ece0; margin-bottom: 4px;
      }
      .cf-auth-sub { font-size: 12px; color: #5a5a72; margin-bottom: 1.25rem; }

      .cf-auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
      .cf-auth-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
      .cf-auth-row .cf-auth-field { margin-bottom: 0; }

      .cf-auth-label {
        font-size: 10px; font-weight: 600; color: #5a5a72;
        letter-spacing: 0.08em; text-transform: uppercase;
        font-family: 'IBM Plex Mono', monospace;
      }
      .cf-auth-input, .cf-auth-select {
        height: 36px; padding: 0 10px;
        border: 1px solid #2a2b38; border-radius: 6px;
        font-size: 13px; color: #e0ddd0;
        background: #13141c; font-family: 'IBM Plex Sans', sans-serif;
        outline: none; transition: border-color 0.15s; width: 100%;
      }
      .cf-auth-input:focus, .cf-auth-select:focus { border-color: #c49b2e; }
      .cf-auth-input.invalid { border-color: #c0392b; }
      .cf-auth-select option { background: #1a1b23; }

      .cf-auth-strength {
        height: 3px; border-radius: 2px; background: #2a2b35; margin-top: 5px; overflow: hidden;
      }
      .cf-auth-strength-bar { height: 100%; width: 0; border-radius: 2px; transition: width 0.3s, background 0.3s; }
      .cf-auth-strength-label { font-size: 10px; color: #5a5a72; font-family: 'IBM Plex Mono', monospace; }

      .cf-auth-agree { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; }
      .cf-auth-agree input { margin-top: 2px; flex-shrink: 0; accent-color: #c49b2e; }
      .cf-auth-agree label { font-size: 11px; color: #5a5a72; line-height: 1.5; }
      .cf-auth-agree a { color: #c49b2e; text-decoration: none; }

      .cf-auth-error { font-size: 11px; color: #e05555; font-family: 'IBM Plex Mono', monospace; display: none; }

      .cf-auth-btn {
        width: 100%; height: 38px; border: none; border-radius: 6px;
        font-size: 13px; font-weight: 600; cursor: pointer;
        font-family: 'IBM Plex Sans', sans-serif; transition: opacity 0.15s;
        letter-spacing: 0.03em;
      }
      .cf-auth-btn.accent { background: #c49b2e; color: #0f0d00; }
      .cf-auth-btn.accent:hover { background: #d4ab3e; }
      .cf-auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    `;
    document.head.appendChild(style);
  }

  // ── Auth logic ──

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  }

  function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading
      ? (btnId === 'su-submit' ? 'Creating account…' : 'Signing in…')
      : (btnId === 'su-submit' ? 'Create my account' : 'Sign in');
  }

  function dismissOverlay(user) {
    setUser(user);
    // Inject user badge into app header
    const header = document.querySelector('header');
    if (header) {
      const badge = document.createElement('div');
      badge.id = 'cf-user-badge';
      badge.style.cssText = 'display:flex;align-items:center;gap:10px;margin-left:auto;';
      badge.innerHTML = `
        <span style="font-size:12px;color:var(--text-muted,#888);font-family:IBM Plex Mono,monospace;">
          ${user.firstName} ${user.lastName}
        </span>
        <button onclick="cfAuth.logout()" style="
          font-size:11px;padding:4px 10px;border-radius:4px;
          border:1px solid #3a3a4a;background:transparent;
          color:#888;cursor:pointer;font-family:IBM Plex Sans,sans-serif;
        ">Sign out</button>
      `;
      header.appendChild(badge);
    }
    const overlay = document.getElementById('cf-auth-overlay');
    if (overlay) overlay.remove();
  }

  // ── Public API ──

  window.cfAuth = {

    showTab(tab) {
      document.getElementById('cf-section-signup').style.display = tab === 'signup' ? '' : 'none';
      document.getElementById('cf-section-login').style.display = tab === 'login' ? '' : 'none';
      document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
      document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    },

    checkStrength(val) {
      const bar = document.getElementById('strength-bar');
      const lbl = document.getElementById('strength-label');
      if (!val) { bar.style.width = '0'; lbl.textContent = ''; return; }
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      const levels = [
        { w: '20%', c: '#e05555', t: 'Weak' },
        { w: '45%', c: '#e8963a', t: 'Fair' },
        { w: '70%', c: '#c49b2e', t: 'Good' },
        { w: '100%', c: '#3aae6e', t: 'Strong' },
      ];
      const l = levels[Math.max(0, score - 1)];
      bar.style.width = l.w;
      bar.style.background = l.c;
      lbl.textContent = l.t;
      lbl.style.color = l.c;
    },

    async register() {
      showError('su-email-err', '');
      showError('su-pass-err', '');
      showError('su-general-err', '');

      const firstName = document.getElementById('su-first').value.trim();
      const lastName = document.getElementById('su-last').value.trim();
      const email = document.getElementById('su-email').value.trim();
      const company = document.getElementById('su-company').value.trim();
      const role = document.getElementById('su-role').value;
      const teamSize = document.getElementById('su-team').value;
      const password = document.getElementById('su-pass').value;
      const terms = document.getElementById('su-terms').checked;

      if (!firstName || !lastName) { showError('su-general-err', 'First and last name are required.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('su-email-err', 'Enter a valid email address.'); return; }
      if (password.length < 8) { showError('su-pass-err', 'Password must be at least 8 characters.'); return; }
      if (!terms) { showError('su-general-err', 'Please agree to the terms to continue.'); return; }

      setLoading('su-submit', true);
      try {
        const data = await apiPost('/api/auth/register', { firstName, lastName, email, company, role, teamSize, password });
        if (data.error) { showError('su-general-err', data.error); return; }
        setToken(data.token);
        dismissOverlay(data.user);
      } catch (e) {
        showError('su-general-err', 'Network error — please try again.');
      } finally {
        setLoading('su-submit', false);
      }
    },

    async login() {
      showError('li-email-err', '');
      showError('li-general-err', '');

      const email = document.getElementById('li-email').value.trim();
      const password = document.getElementById('li-pass').value;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('li-email-err', 'Enter a valid email address.'); return; }
      if (!password) { showError('li-general-err', 'Password is required.'); return; }

      setLoading('li-submit', true);
      try {
        const data = await apiPost('/api/auth/login', { email, password });
        if (data.error) { showError('li-general-err', data.error); return; }
        setToken(data.token);
        dismissOverlay(data.user);
      } catch (e) {
        showError('li-general-err', 'Network error — please try again.');
      } finally {
        setLoading('li-submit', false);
      }
    },

    logout() {
      clearToken();
      const badge = document.getElementById('cf-user-badge');
      if (badge) badge.remove();
      injectAuthOverlay();
    },
  };

  // ── Boot: check for existing valid session ──

  async function boot() {
    // Hide the app shell immediately until auth is confirmed
    document.documentElement.style.visibility = 'hidden';

    const token = getToken();
    if (token) {
      try {
        const data = await apiVerify(token);
        if (data.valid && data.user) {
          document.documentElement.style.visibility = '';
          // Inject user badge without showing overlay
          const header = document.querySelector('header');
          if (header) {
            const badge = document.createElement('div');
            badge.id = 'cf-user-badge';
            badge.style.cssText = 'display:flex;align-items:center;gap:10px;margin-left:auto;';
            badge.innerHTML = `
              <span style="font-size:12px;color:var(--text-muted,#888);font-family:IBM Plex Mono,monospace;">
                ${data.user.firstName} ${data.user.lastName}
              </span>
              <button onclick="cfAuth.logout()" style="
                font-size:11px;padding:4px 10px;border-radius:4px;
                border:1px solid #3a3a4a;background:transparent;
                color:#888;cursor:pointer;font-family:IBM Plex Sans,sans-serif;
              ">Sign out</button>
            `;
            header.appendChild(badge);
          }
          return;
        }
      } catch (_) { /* fall through to show auth */ }
    }

    clearToken();
    document.documentElement.style.visibility = '';
    injectAuthOverlay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

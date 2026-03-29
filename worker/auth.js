// ============================================================
// ContractForge — Auth Worker Module
// Drop this file into worker/ and import it in your index.js:
//
//   import { handleAuth } from './auth.js';
//
// Then in your fetch handler, add BEFORE your existing routes:
//
//   if (url.pathname.startsWith('/api/auth')) {
//     return handleAuth(request, env);
//   }
//
// Required: D1 binding named DB (already in wrangler.worker.toml)
// Required: Run the SQL migration below once via Wrangler:
//
//   wrangler d1 execute contractforge-db --file=./worker/schema.sql
//
// Required: Set a secret in your Worker environment:
//   wrangler secret put JWT_SECRET
//   (enter any long random string, e.g. 64 hex chars)
// ============================================================

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

// ── Crypto helpers (Web Crypto API — native in CF Workers) ──

async function hashPassword(password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const hashArr = new Uint8Array(bits);
  const saltHex = [...salt].map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = [...hashArr].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':');
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map(h => parseInt(h, 16)));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const hashArr = new Uint8Array(bits);
  const computed = [...hashArr].map(b => b.toString(16).padStart(2, '0')).join('');
  return computed === hashHex;
}

// ── Minimal signed token (HMAC-SHA256, no external deps) ──

async function signToken(payload, secret) {
  const enc = new TextEncoder();
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${data}.${sigB64}`;
}

async function verifyToken(token, secret) {
  try {
    const [header, body, sig] = token.split('.');
    const enc = new TextEncoder();
    const data = `${header}.${body}`;
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data));
    if (!valid) return null;
    const payload = JSON.parse(atob(body));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ── Route handlers ──

async function register(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { firstName, lastName, email, company, role, teamSize, password } = body;

  if (!email || !password || !firstName || !lastName) {
    return json({ error: 'Missing required fields' }, 400);
  }
  if (password.length < 8) {
    return json({ error: 'Password must be at least 8 characters' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email address' }, 400);
  }

  const existing = await env.DB.prepare(
    'SELECT id FROM cf_users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  if (existing) {
    return json({ error: 'An account with this email already exists' }, 409);
  }

  const passwordHash = await hashPassword(password);
  const userId = crypto.randomUUID();
  const now = Date.now();

  await env.DB.prepare(`
    INSERT INTO cf_users (id, email, password_hash, first_name, last_name, company, role, team_size, created_at, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `).bind(
    userId,
    email.toLowerCase(),
    passwordHash,
    firstName,
    lastName,
    company || '',
    role || '',
    teamSize || '',
    now
  ).run();

  // Issue session token (7 day expiry)
  const token = await signToken(
    { sub: userId, email: email.toLowerCase(), exp: now + 7 * 24 * 60 * 60 * 1000 },
    env.JWT_SECRET
  );

  return json({
    success: true,
    token,
    user: { id: userId, email: email.toLowerCase(), firstName, lastName, company, role },
  });
}

async function login(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { email, password } = body;
  if (!email || !password) return json({ error: 'Email and password required' }, 400);

  const user = await env.DB.prepare(
    'SELECT * FROM cf_users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  if (!user) return json({ error: 'Invalid email or password' }, 401);

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return json({ error: 'Invalid email or password' }, 401);

  // Update last login
  await env.DB.prepare('UPDATE cf_users SET last_login = ? WHERE id = ?')
    .bind(Date.now(), user.id).run();

  const now = Date.now();
  const token = await signToken(
    { sub: user.id, email: user.email, exp: now + 7 * 24 * 60 * 60 * 1000 },
    env.JWT_SECRET
  );

  return json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      company: user.company,
      role: user.role,
    },
  });
}

async function verify(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return json({ error: 'No token' }, 401);

  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload) return json({ error: 'Invalid or expired token' }, 401);

  const user = await env.DB.prepare(
    'SELECT id, email, first_name, last_name, company, role FROM cf_users WHERE id = ?'
  ).bind(payload.sub).first();

  if (!user) return json({ error: 'User not found' }, 404);

  return json({
    valid: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      company: user.company,
      role: user.role,
    },
  });
}

// ── Main router ──

export async function handleAuth(request, env) {
  const url = new URL(request.url);

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (url.pathname === '/api/auth/register' && request.method === 'POST') {
    return register(request, env);
  }
  if (url.pathname === '/api/auth/login' && request.method === 'POST') {
    return login(request, env);
  }
  if (url.pathname === '/api/auth/verify' && request.method === 'GET') {
    return verify(request, env);
  }

  return json({ error: 'Not found' }, 404);
}

// ── Middleware: use this to protect any existing Worker routes ──
// Call at top of your fetch handler:
//
//   const authUser = await requireAuth(request, env);
//   if (authUser instanceof Response) return authUser; // 401
//   // authUser.sub, authUser.email now available
//
export async function requireAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return json({ error: 'Unauthorized' }, 401);
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload) return json({ error: 'Unauthorized' }, 401);
  return payload;
}

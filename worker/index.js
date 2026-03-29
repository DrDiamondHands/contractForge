const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Always handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url      = new URL(request.url);
    const pathname = url.pathname;

    // Ignore favicon requests
    if (pathname === '/favicon.ico') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      if (pathname === '/api/contracts') {
        if (request.method === 'GET')  return await listContracts(env);
        if (request.method === 'POST') return await createContract(request, env);
      }

      const match = pathname.match(/^\/api\/contracts\/([^/]+)$/);
      if (match) {
        const id = match[1];
        if (request.method === 'GET')    return await getContract(id, env);
        if (request.method === 'PUT')    return await updateContract(id, request, env);
        if (request.method === 'DELETE') return await deleteContract(id, env);
      }

      return json({ error: 'Not found' }, 404);

    } catch (err) {
      console.error(err);
      return json({ error: 'Internal server error', detail: err.message }, 500);
    }
  },
};

async function listContracts(env) {
  const { results } = await env.DB.prepare(
    `SELECT id, title, type, value, updated_at FROM contracts ORDER BY updated_at DESC`
  ).all();
  return json(results);
}

async function getContract(id, env) {
  const row = await env.DB.prepare(
    `SELECT * FROM contracts WHERE id = ?`
  ).bind(id).first();
  if (!row) return json({ error: 'Contract not found' }, 404);
  return json({ ...row, data: JSON.parse(row.data) });
}

async function createContract(request, env) {
  const body = await request.json();
  const { id, title, type, value, data } = body;
  if (!id || !title) return json({ error: 'id and title are required' }, 400);
  await env.DB.prepare(
    `INSERT INTO contracts (id, title, type, value, data, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`
  ).bind(id, title, type || '', value || '', JSON.stringify(data || {})).run();
  return json({ ok: true, id }, 201);
}

async function updateContract(id, request, env) {
  const body = await request.json();
  const { title, type, value, data } = body;
  const result = await env.DB.prepare(
    `UPDATE contracts SET title = ?, type = ?, value = ?, data = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(title, type || '', value || '', JSON.stringify(data || {}), id).run();
  if (result.changes === 0) return json({ error: 'Contract not found' }, 404);
  return json({ ok: true });
}

async function deleteContract(id, env) {
  await env.DB.prepare(
    `DELETE FROM contracts WHERE id = ?`
  ).bind(id).run();
  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
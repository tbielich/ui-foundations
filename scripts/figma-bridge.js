#!/usr/bin/env node
// Kiro Bridge Server — polling-based (fetch-compatible with Figma Plugin sandbox)

const http = require('http');
const { randomUUID } = require('crypto');

const PORT = 3846;

// queue of pending commands waiting to be picked up by the plugin
const commandQueue = [];
// map of id → { resolve, reject } waiting for plugin result
const pending = new Map();

const server = http.createServer((req, res) => {
  // CORS headers so Figma plugin iframe can reach localhost
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Plugin polls for next command
  if (req.method === 'GET' && req.url === '/poll') {
    const cmd = commandQueue.shift();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(cmd || {}));
  }

  // Plugin posts result back
  if (req.method === 'POST' && req.url === '/result') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const msg = JSON.parse(body);
        const handler = pending.get(msg.id);
        if (handler) {
          pending.delete(msg.id);
          msg.ok ? handler.resolve(msg.result) : handler.reject(new Error(msg.error));
        }
      } catch (e) {
        console.error('[bridge] result parse error', e.message);
      }
      res.writeHead(204);
      res.end();
    });
    return;
  }

  // External caller sends a command (e.g. from curl or MCP)
  if (req.method === 'POST' && req.url === '/') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      try {
        const cmd = JSON.parse(body);
        const result = await sendToPlugin(cmd);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, result }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

function sendToPlugin(cmd) {
  return new Promise((resolve, reject) => {
    const id = randomUUID();
    pending.set(id, { resolve, reject });
    commandQueue.push({ ...cmd, id });
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error('Timeout — is the Figma plugin running?'));
      }
    }, 10000);
  });
}

server.listen(PORT, () => {
  console.log(`[bridge] Listening on http://localhost:${PORT}`);
  console.log('[bridge] Plugin polls GET /poll, posts results to POST /result');
  console.log('[bridge] Send commands via POST /, e.g.:');
  console.log(`  curl -X POST http://localhost:${PORT} -d '{"type":"get_pages"}'`);
});

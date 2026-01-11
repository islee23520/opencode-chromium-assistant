const assert = require('assert');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const MOCK_SCRIPT = path.join(ROOT, 'tools', 'opencode-mock', 'server.js');
const BASE = process.env.MOCK_URL || 'http://localhost:4096';

function waitForUrl(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function poll() {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 500) return resolve(true);
        if (Date.now() - start > timeout) return reject(new Error('timeout'));
        setTimeout(poll, 300);
      }).on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('timeout'));
        setTimeout(poll, 300);
      });
    })();
  });
}

async function ensureMockServer() {
  try {
    await waitForUrl(BASE + '/health', 1000);
    console.log('Mock server already running');
    return null;
  } catch (e) {
    console.log('Starting mock server for unit tests...');
    const proc = spawn('node', [MOCK_SCRIPT], { cwd: ROOT, shell: true, detached: true, stdio: 'ignore' });
    if (proc && typeof proc.unref === 'function') proc.unref();
    await waitForUrl(BASE + '/health', 10000);
    return proc;
  }
}

async function postJson(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res;
}

(async () => {
  let mockProc;
  try {
    mockProc = await ensureMockServer();

    console.log('Testing 200 response...');
    let r = await postJson('/v1/chat', { prompt: 'hello' });
    assert.strictEqual(r.status, 200, 'Expected 200 OK');
    let json = await r.json();
    assert.ok(json.output && json.output.includes('Echo'), 'Expected echo output');

    console.log('Testing 401 response...');
    r = await postJson('/v1/chat', { simulate: 401 });
    assert.strictEqual(r.status, 401, 'Expected 401 Unauthorized');

    console.log('Testing 429 response...');
    r = await postJson('/v1/chat', { simulate: 429 });
    assert.strictEqual(r.status, 429, 'Expected 429 Rate Limit');

    console.log('All unit/integration checks passed');

    // Cleanup: kill spawned mock server if we started it, destroy HTTP agent sockets
    if (mockProc) {
      try { process.kill(mockProc.pid); } catch (e) { /* ignore */ }
    }
    try { if (http && http.globalAgent && typeof http.globalAgent.destroy === 'function') http.globalAgent.destroy(); } catch (e) { }

    // Log active handles to help diagnose Windows libuv assertion (temporary)
    try {
      if (typeof process._getActiveHandles === 'function') {
        const names = process._getActiveHandles().map(h => h && h.constructor && h.constructor.name ? h.constructor.name : typeof h);
        console.log('Active handles before exit:', names);
      }
    } catch (e) { }

    // Allow a short delay for handles to close cleanly, then exit
    setTimeout(() => process.exit(0), 50);
  } catch (err) {
    console.error('Test failed', err);
    if (mockProc) {
      try { process.kill(mockProc.pid); } catch (e) { /* ignore */ }
    }
    try { if (http && http.globalAgent && typeof http.globalAgent.destroy === 'function') http.globalAgent.destroy(); } catch (e) { }
    setTimeout(() => process.exit(1), 50);
  }
})();
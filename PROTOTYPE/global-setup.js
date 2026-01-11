const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname);
const MOCK_SCRIPT = path.resolve(ROOT, '..', 'tools', 'opencode-mock', 'server.js');
const PROTO_DIR = ROOT;
const SERVERS_FILE = path.join(ROOT, '.playwright-servers.json');

function waitForUrl(url, timeout = 15000) {
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

async function startIfNeeded(command, args, cwd, healthUrl) {
  // Check health first
  try {
    await waitForUrl(healthUrl, 1000);
    console.log(`Service at ${healthUrl} already up.`);
    return null;
  } catch (e) {
    console.log(`Starting: ${command} ${args.join(' ')} (cwd=${cwd})`);
    const proc = spawn(command, args, { cwd, shell: true, detached: true, stdio: 'ignore' });
    // Ensure child doesn't hold the parent event loop
    if (proc && typeof proc.unref === 'function') proc.unref();
    // wait for health
    await waitForUrl(healthUrl, 10000);
    return proc.pid;
  }
}

module.exports = async () => {
  const servers = {};
  // Start mock server at http://localhost:4096/health
  const mockPid = await startIfNeeded('node', [MOCK_SCRIPT], path.dirname(MOCK_SCRIPT), 'http://localhost:4096/health').catch((e) => { throw e; });
  if (mockPid) servers.mock = mockPid;

  // Start static server for PROTOTYPE at http://localhost:3000/index.html
  const protoPid = await startIfNeeded('npx', ['http-server', '.', '-p', '3000', '--silent'], PROTO_DIR, 'http://localhost:3000/index.html').catch((e) => { throw e; });
  if (protoPid) servers.prototype = protoPid;

  fs.writeFileSync(SERVERS_FILE, JSON.stringify(servers));
  console.log('global-setup: servers started', servers);
};
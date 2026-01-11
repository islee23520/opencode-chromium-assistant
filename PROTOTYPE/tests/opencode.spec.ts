import { test, expect } from '@playwright/test';
import child_process from 'child_process';
import path from 'path';

const WORKSPACE_ROOT = path.resolve(__dirname, '../../../../');
const MOCK_SERVER = path.join(WORKSPACE_ROOT, 'tools', 'opencode-mock', 'server.js');
const PROTOTYPE_DIR = path.join(WORKSPACE_ROOT, 'repos', 'opencode-chromium-assistant', 'PROTOTYPE');

let mockProc: child_process.ChildProcessWithoutNullStreams | undefined;
let webProc: child_process.ChildProcessWithoutNullStreams | undefined;

async function waitForUrl(url: string, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Timeout waiting for ${url}`);
}

test.beforeAll(async () => {
  // Start mock server
  mockProc = child_process.spawn('node', [MOCK_SERVER], {
    cwd: WORKSPACE_ROOT,
    shell: true,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  // Start static web server serving PROTOTYPE at /PROTOTYPE
  webProc = child_process.spawn('npx', ['http-server', '.', '-p', '3000', '--silent'], {
    cwd: PROTOTYPE_DIR,
    shell: true,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  await waitForUrl('http://localhost:4096/health');
  await waitForUrl('http://localhost:3000/index.html');
});

test.afterAll(() => {
  if (mockProc) mockProc.kill();
  if (webProc) webProc.kill();
});

test('side panel opens and shows response from mock', async ({ page }) => {
  await page.goto('http://localhost:3000/index.html');
  await page.getByRole('button', { name: 'Open Opencode Assistant' }).click();
  await page.getByLabel('Prompt input').fill('Hello');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText(/Echo:/)).toHaveCount(1);
});

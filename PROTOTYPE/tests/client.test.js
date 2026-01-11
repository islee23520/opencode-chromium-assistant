const assert = require('assert');

const BASE = process.env.MOCK_URL || 'http://localhost:4096';

async function postJson(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res;
}

(async () => {
  try {
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
    process.exit(0);
  } catch (err) {
    console.error('Test failed', err);
    process.exit(1);
  }
})();
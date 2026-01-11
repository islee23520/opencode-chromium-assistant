const EventSource = require('eventsource');
const assert = require('assert');

const URL = process.env.MOCK_URL || 'http://localhost:4096/v1/chat/stream?prompt=hello&api_key=dummy';

(async () => {
  console.log('Testing SSE stream...');
  const es = new EventSource(URL);
  let received = 0;
  let finished = false;
  const timeout = setTimeout(() => {
    if (finished) return;
    finished = true;
    try { es.close(); } catch (e) {}
    try { if (global && globalThis && globalThis.EventSource) {} } catch (e) {}
    try { if (require('http') && require('http').globalAgent && typeof require('http').globalAgent.destroy === 'function') require('http').globalAgent.destroy(); } catch (e) {}
    setTimeout(() => process.exit(1), 200);
  }, 5000);

  es.onmessage = (evt) => {
    if (finished) return;
    try {
      const data = JSON.parse(evt.data);
      if (data.delta) {
        received++;
        console.log('SSE got delta:', data.delta);
        if (received >= 1) {
          finished = true;
          clearTimeout(timeout);
          try { es.close(); } catch (e) {}
          try { if (require('http') && require('http').globalAgent && typeof require('http').globalAgent.destroy === 'function') require('http').globalAgent.destroy(); } catch (e) {}
          console.log('SSE test passed');
          setTimeout(() => process.exit(0), 200);
        }
      }
    } catch (e) { console.error('bad json', e); }
  };
  es.onerror = (e) => {
    if (finished) return;
    finished = true;
    console.error('SSE error', e);
    try { es.close(); } catch (err) {}
    try { if (require('http') && require('http').globalAgent && typeof require('http').globalAgent.destroy === 'function') require('http').globalAgent.destroy(); } catch (err) {}
    setTimeout(() => process.exit(1), 200);
  };
})();
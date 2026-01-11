const EventSource = require('eventsource');
const assert = require('assert');

const URL = process.env.MOCK_URL || 'http://localhost:4096/v1/chat/stream?prompt=hello&api_key=dummy';

(async () => {
  console.log('Testing SSE stream...');
  const es = new EventSource(URL);
  let received = 0;
  const timeout = setTimeout(() => { es.close(); process.exit(1); }, 5000);
  es.onmessage = (evt) => {
    try {
      const data = JSON.parse(evt.data);
      if (data.delta) {
        received++;
        console.log('SSE got delta:', data.delta);
        if (received >= 1) {
          clearTimeout(timeout);
          es.close();
          console.log('SSE test passed');
          process.exit(0);
        }
      }
    } catch (e) { console.error('bad json', e); }
  };
  es.onerror = (e) => { console.error('SSE error', e); es.close(); process.exit(1); };
})();
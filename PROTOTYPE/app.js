// Prototype app.js for PROTOTYPE - calls mock server at http://localhost:4096
// Lightweight, accessible, and intended for local development only

const API_BASE = 'http://localhost:4096';

const openBtn = document.getElementById('open-assistant');
const panel = document.getElementById('opencode-panel');
const closeBtn = document.getElementById('close-panel');
const sendBtn = document.getElementById('send');
const promptInput = document.getElementById('prompt');
const messages = document.getElementById('messages');
const status = document.getElementById('status');
const demoBtn = document.getElementById('demo-btn');
const bubbleTemplate = document.getElementById('bubble-template');

function appendMessage(text, cls='assistant'){
  const node = bubbleTemplate.content.firstElementChild.cloneNode(true);
  node.classList.add(cls);
  node.textContent = text;
  messages.appendChild(node);
  node.scrollIntoView({behavior:'smooth', block:'end'});
}

function setStatus(text, cls=''){
  status.className = 'status';
  if(cls) status.classList.add(cls);
  status.textContent = text;
}

function openPanel(){
  console.debug('opencode-prototype: openPanel called');
  panel.setAttribute('aria-hidden', 'false');
  const input = panel.querySelector('input');
  if (input) input.focus();
}
function closePanel(){
  console.debug('opencode-prototype: closePanel called');
  panel.setAttribute('aria-hidden', 'true');
  openBtn.focus();
}

openBtn.addEventListener('click', openPanel);
closeBtn.addEventListener('click', closePanel);

panel.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closePanel();
});

sendBtn.addEventListener('click', sendPrompt);
promptInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') sendPrompt();
});

demoBtn.addEventListener('click', ()=>{
  promptInput.value = 'Hello Opencode, summarize this page for me.';
  sendPrompt();
});

async function sendPrompt(){
  const prompt = promptInput.value.trim();
  if(!prompt) return;
  appendMessage(prompt, 'user');
  promptInput.value = '';
  setStatus('Sending...');

  try{
    const resp = await fetch(API_BASE + '/v1/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({prompt})
    });
    console.debug('opencode-prototype: fetch status', resp.status);
    if(resp.status === 401){ setStatus('Unauthorized - missing/invalid API key', 'error'); appendMessage('Error: Unauthorized', 'assistant'); return; }
    if(resp.status === 429){ setStatus('Rate limited - try again later', 'error'); appendMessage('Error: Rate limited', 'assistant'); return; }
    if(!resp.ok){ setStatus('Server error', 'error'); appendMessage('Error: Server returned ' + resp.status, 'assistant'); return; }
    const json = await resp.json();
    appendMessage(json.output || 'No response', 'assistant');
    setStatus('Done');
  }catch(e){
    setStatus('Network error', 'error');
    appendMessage('Network error: ' + e.message, 'assistant');
  }
}

// Expose streaming for console testing
async function streamPrompt(prompt){
  setStatus('Streaming...');
  const evtSource = new EventSource(API_BASE + '/v1/chat/stream?prompt=' + encodeURIComponent(prompt) + '&api_key=dummy');
  evtSource.onmessage = (evt)=>{
    try{
      const data = JSON.parse(evt.data);
      appendMessage(data.delta, 'assistant');
    }catch(e){ console.error('bad json', e); }
  };
  evtSource.addEventListener('done', ()=>{ setStatus('Done (stream)'); evtSource.close(); });
  evtSource.onerror = (e)=>{ setStatus('Stream error', 'error'); evtSource.close(); };
}

window._opencode = {sendPrompt, streamPrompt};

// Auto-open helper: if URL has ?open=true, open panel (for tests)
if (typeof window !== 'undefined' && window.location && window.location.search.includes('open=true')) {
  setTimeout(() => {
    try { openPanel(); } catch (e) { console.error('auto-open failed', e); }
  }, 50);
}

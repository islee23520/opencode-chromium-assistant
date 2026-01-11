API — Opencode Mock Server

Endpoints used by the prototype

1) Health
- GET /health
- Response: 200 OK

Example:

```bash
curl -sS http://localhost:4096/health
# { "ok": true }
```

2) POST /v1/chat (non-streaming)
- Request: JSON { prompt: string }
- Response: 200 OK with JSON { id: string, output: string }
- Simulated errors: include `simulate: 401` or `simulate: 429` in the request body to trigger 401/429 responses.

Example:

```bash
curl -sS -X POST http://localhost:4096/v1/chat \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Hello"}'
# { "id": "mock-123", "output": "Echo: Hello" }
```

Errors
- 401 Unauthorized: returned when simulate=401 or missing credentials in SSE endpoint
- 429 Rate limit: returned when simulate=429

3) GET /v1/chat/stream (SSE streaming)
- Query parameters: prompt, api_key
- SSE format: data: JSON
- Example SSE event message: `data: {"delta":"Echoing: Hello"}`
- End event: `event: done` (with JSON finish: true)

Example (curl)

```bash
curl -N "http://localhost:4096/v1/chat/stream?prompt=hello&api_key=dummy"
# data: {"delta":"Echoing: hello"}
# data: {"delta":"This is a streaming response from the mock server."}
# event: done
data: {"finish": true}
```

Notes
- The prototype expects SSE messages with `data:` lines containing JSON objects with a `delta` field. The mock server sends several deltas and then a final `done` event.
- For local dev, `api_key` is a dummy value — in production, API keys should be provided by user via secure store.

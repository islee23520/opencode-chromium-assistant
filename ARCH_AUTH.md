# Authentication & Privacy Architecture for OpenCode Assistant (Chromium)

Status: Draft

Summary
- Recommendation (MVP): BYOM-first (Bring Your Own Model/API key). The user provides an OpenCode API key which is stored securely on-device and used for direct calls to OpenCode endpoints.
- Optional future mode: Brave-managed proxy (server-side requests using Brave-owned credentials), gated behind explicit opt-in and a signed commercial agreement with OpenCode.

Goals
- Privacy by default: no user content or keys are proxied through Brave servers unless the user explicitly opts in.
- Secure key storage: use platform native secure storage (Keychain on macOS, Windows Credential Manager / DPAPI on Windows, libsecret or keyring on Linux). Fallback: encrypted profile storage.
- Minimal telemetry: only allow telemetry with explicit opt-in; never include prompt or output content in telemetry.

Architecture overview
- Client-side flow (BYOM):
  1. User enables assistant in Settings and chooses provider (OpenCode selected by default).
  2. User supplies an API key (or uses device OAuth flow in the future).
  3. Key is validated via health check (GET /health or test request). Only success/failure status returned to UI.
  4. Client performs direct calls to OpenCode REST endpoints (e.g., POST /v1/chat) with Authorization: Bearer <key>.
  5. Streaming (SSE) or non-streaming responses rendered in side-panel WebUI; streaming uses an aria-live region.

- Brave-managed proxy (opt-in-only, future):
  - Brave hosts a proxy with its own (enterprise) OpenCode credentials. Users opting in route requests through proxy.
  - Proxy responsibilities: rate-limiting, quota management, authentication, and moderation (optional).
  - Privacy: Proxy must have a clear data retention policy and, ideally, not use prompts/outputs for model training. Signed contract required.

Key storage
- Use platform native secure key stores: Windows DPAPI/Credential Manager, macOS Keychain, Linux libsecret/secret-service.
- Display only masked key in Settings (e.g., "****-abcd").
- Provide UI to remove/revoke key; when removed, clear all local traces.
- Prefer not to store keys in plaintext in prefs or logs.

Authentication variants
- API Key (MVP): simplest, user-managed key. Stored in keychain.
- OAuth / Device flow (future): useful for tokens with scopes and expirations; requires additional server or device flow support.
- Proxy Token: when using Brave-managed proxy, the proxy returns a short-lived session token for the client to use; this avoids exposing long-lived keys on client devices.

Network & Transport
- Always use TLS (HTTPS) with strict host verification.
- For proxy mode, add strict certificate checks and consider certificate pinning for extra safety.

Security & Threat Model (high level)
- Threats:
  - Key exfiltration from a compromised device
  - Man-in-the-middle attacks during API calls
  - Unintended logging of prompts/outputs
- Mitigations:
  - Native key storage; no plaintext in prefs
  - Network TLS and optional pinning for proxy
  - Redact prompt/output from logs and telemetry; permit only aggregate metrics
  - UI confirmation for any proxy usage or telemetry opt-in

Error handling & Rate limiting
- Map common errors to user-friendly messages (401 → "Invalid API key", 429 → "Rate limit reached, try later").
- Implement retry/backoff strategy with jitter for transient errors (5xx, network timeouts).
- For streaming endpoints, support graceful cancellation and resume.

Telemetry & Privacy
- Telemetry is opt-in only. When enabled, only emit deltas such as:
  - Assistant.Enabled (boolean)
  - Assistant.SessionStarted (count)
  - Assistant.ResponseLatency (histogram buckets)
  - Assistant.Error (code buckets)
- NEVER include prompt text, user content, or assistant outputs in telemetry.

Logging
- Avoid logging secrets. When logging errors, include only status codes and non-sensitive metadata.

Policy & Legal
- When using OpenCode paid plans (Zen/Enterprise), verify Data Use policies — paid plans typically do not use content for training.
- For default bundling or pre-configured proxy, obtain written permission from OpenCode for branding and deployment.

Prefs & Configuration
- Pref names (suggested):
  - kOpencodeAssistantEnabled (bool)
  - kOpencodeAssistantApiEndpoint (string) — default to https://api.opencode.ai
  - kOpencodeAssistantApiKey (secure store reference)
  - kOpencodeAssistantProxyEnabled (bool)
  - kOpencodeAssistantTelemetryEnabled (bool)
- GN args:
  - enable_opencode_assistant (bool)
  - opencode_api_endpoint (string)

Testing & Verification
- Unit tests: Key storage functions (write/read/delete), API client success/error handling, streaming behavior (mock SSE).
- Integration tests: e2e mock server tests (Playwright) for UI flows (key entry, prompt→response, error states).
- Security tests: validate that keys are not present in logs, and that telemetry does not include user content.

TDD Workflow (auth features)
1. SPEC: Add tests confirming correct behavior when an invalid key is used (expected 401 and UI message).
2. RED: Write failing unit tests for key storage and retrieval.
3. GREEN: Implement secure storage (platform wrappers) to satisfy tests.
4. REFACTOR: Ensure code is maintainable and run full test suite.

Success Criteria
- Users can add/remove API keys and use the assistant successfully.
- Keys are stored in platform-secure storage and never appear in logs or prefs in plaintext.
- All tests pass (unit + e2e), and a Playwright smoke test demonstrates a prompt→response roundtrip via mock server.

Appendices
- Minimal example: client.js fetch snippet

```js
// Example: call OpenCode chat
async function askOpenCode(apiKey, prompt){
  const r = await fetch('https://api.opencode.ai/v1/chat', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ prompt })
  });
  return r.json();
}
```

- Note: follow OpenCode's API docs for endpoints & streaming usage.


Contributors: islee23520


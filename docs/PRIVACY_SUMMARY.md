OpenCode Assistant — Privacy Summary

Short summary for users
- The OpenCode Assistant is disabled by default. You must explicitly enable it.
- BYOM (Bring Your Own Model/API Key) is the recommended option: you supply your OpenCode API key and requests are sent directly from your device to OpenCode.
- If you opt into a Brave-managed proxy (optional, requires agreement), your requests will be routed through Brave servers — we will provide a separate consent flow and written terms before enabling this.
- Telemetry and usage metrics are opt-in only and will never contain your prompt text or assistant responses.

What data is sent
- BYOM: your prompts and related request metadata go directly to OpenCode; Brave does not receive the content or your key.
- Proxy mode: if you opt into Brave proxy, requests will transit Brave servers. We will document retention and handling and obtain written permission from OpenCode before enabling proxy by default.

Why we recommend BYOM
- More privacy: your key and data remain under your control.
- Cost containment: BYOM avoids transferring cost/rate-limits to the project.

Control & deletion
- Remove API key: Settings → OpenCode Assistant → Remove API key (this removes local key and prevents further requests).
- Delete conversation history: Currently stored only locally in the side-panel session; provide a "Clear history" button in settings to delete local history.
- To request deletion of data held by OpenCode, follow OpenCode's published process (link to OpenCode Privacy Policy). If you used Brave proxy and we retained any data, we will provide a deletion endpoint and instructions.

Telemetry (opt-in only)
- Telemetry events (if enabled) are strictly aggregate and never contain prompt text or assistant outputs. Examples: session starts, latency histograms, error buckets.

Consent modal copy (suggested)
Title: "Enable OpenCode Assistant"
Body: "OpenCode Assistant can summarize pages and answer questions using OpenCode's API. By enabling, your prompts may be sent to OpenCode. Use your OpenCode API key to keep your usage private. Read OpenCode's Terms and Privacy Policy before enabling."
Options (checkboxes):
- "Use my OpenCode API key (recommended — private)"
- "Allow Brave proxying of requests (requires agreement)"
- "Allow anonymous telemetry to help improve the assistant (opt-in)"
Actions: [Enable] [Cancel]

Developer notes
- Before enabling proxy mode or pre-selecting OpenCode in default builds, obtain written confirmation from OpenCode about data usage, retention, and training policies. Document any enterprise opt-out options.
- Ensure UI links to current OpenCode Terms & Privacy Policy.

If you have questions about privacy or want to request deletion, open an issue or contact the project maintainers.

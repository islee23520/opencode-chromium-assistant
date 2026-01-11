Components

1) SidePanel
- Path: chrome/browser/ui/webui/opencode_assistant/side_panel.html (prototype: PROTOTYPE/index.html)
- Responsibilities: host assistant UI, display conversation stream, handle file uploads, keyboard navigation
- Props/State: open (bool), conversation list (array), current input (string), streaming (bool)
- Accessibility: role="dialog", aria-hidden toggled, aria-labelledby for title, aria-live="polite" for messages
- Localization keys:
  - opencode.panel.title: "Opencode Assistant"
  - opencode.panel.open: "Open Opencode Assistant"

2) ConsentModal
- Path: chrome/browser/ui/webui/opencode_assistant/consent_modal.html
- Responsibilities: show first-run consent, API key input option, proxy opt-in, telemetry opt-in
- Props/State: show (bool), apiKeyOption (bool), proxyOption (bool), telemetryOption (bool)
- Accessibility: role="dialog", focus trap, keyboard tab order, links to TOS & Privacy
- Localization keys:
  - opencode.consent.title: "Enable OpenCode Assistant"
  - opencode.consent.description: "Opencode Assistant helps summarize pages and answer questions..."
  - opencode.consent.enable: "Enable"

3) SettingsPage
- Path: chrome/browser/ui/webui/settings/opencode_settings.html
- Responsibilities: provider selection, API key add/remove, toggle enable/disable
- Props/State: selectedProvider (string), apiKeyExists (bool), enabled (bool)
- Accessibility: form labels, aria-describedby for API key storage notes
- Localization keys:
  - opencode.settings.title: "OpenCode Assistant"
  - opencode.settings.apiKey: "Your OpenCode API key"

4) OmniboxSuggestion
- Path: components/opencode/omnibox_suggestion.{js,cc}
- Responsibilities: inline quick prompts, show suggestion, open side panel when invoked
- Props/State: suggestionText (string)
- Accessibility: role="option", accessible name
- Localization keys:
  - opencode.omnibox.prompt: "Ask Opencode"

5) ConversationHandler Client
- Path: components/opencode/opencode_client.{cc,js}
- Responsibilities: REST & streaming client, retry/backoff, error mapping
- Props/State: endpoint (string), apiKey (string), onMessage callbacks
- Tests: unit tests for 200, 401, 429, streaming

QA Checklist
- Keyboard: Tab order, Esc to close panel, Enter to send
- Focus: Focus trap inside modal when open
- Screen reader: aria-live for streaming; each message announces role (user/assistant)
- Contrast: All text passes WCAG 2.1 AA (contrast >= 4.5:1)
- Localization: All UI strings externalized

Implementation Notes
- prefs: kOpencodeAssistantEnabled, kOpencodeAssistantApiEndpoint, kOpencodeAssistantApiKey
- Feature flag: enable_opencode_assistant
- Use ConversationHandler pattern from components/ai_chat for conversation lifecycle and storage

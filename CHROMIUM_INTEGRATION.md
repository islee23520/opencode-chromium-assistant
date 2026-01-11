# Chromium Integration Plan

This document describes a pure Chromium-based integration plan for setting OpenCode as the default AI provider via BYOM (Bring Your Own Model/API key). It is intended as a clean-room plan (not tied to Brave code specifics) for upstream Chromium or Chromium-based forks.

Key Principles
- Privacy-first: BYOM default, assistant disabled until explicit user consent
- Minimal footprint: add side panel WebUI and omnibox hinting; keep core changes modular and feature-flagged
- Security: use OS-level secret storage where available

MVP Feature list
- Side-panel WebUI (chrome://opencode-assistant) with toolbar toggle
- Omnibox inline suggestions for quick prompts
- Settings page with API-key entry and enable/disable toggles
- Opencode REST client (support streaming and non-streaming) and unit tests

Implementation notes
- File-path suggestions reflect Chromium layout: chrome/browser/ui/webui/opencode_assistant/, chrome/browser/side_panel/, components/opencode/
- GN build flags: enable_opencode_assistant, opencode_api_endpoint

Testing
- Unit tests (components/opencode/test)
- Browser tests (content_browsertests) for side-panel and settings
- Playwright e2e smoke test for the PoC

Legal & Release
- Use "Powered by OpenCode" text badge. Get written permission for naming & bundling before pre-selecting in default builds.

Roadmap & Issues
- Create POC, design, and legal issues in GitHub to track progress.

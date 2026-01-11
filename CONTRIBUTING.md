Contributing to Opencode Chromium Assistant

Thanks for your interest in contributing! This repository is a small Chromium-based project that demonstrates integrating OpenCode as a BYOM assistant.

Before you start
- Read the repository README and ARCH_AUTH.md to understand the authentication and privacy design.
- If your change touches legal/branding or proxy behavior, contact the maintainers and wait for explicit sign-off.

How to contribute
1. Open an issue describing the change or bug. Discuss the design with maintainers before large changes.
2. Create a feature branch from main: git checkout -b feat/your-short-description
3. Keep changes small and focused. One feature or bugfix per PR.
4. Follow commit message format: type(scope): short description
   - Types: feat, fix, docs, test, chore, ci, refactor

Running the prototype locally
- Start the mock server:
  node tools/opencode-mock/server.js
- Serve the static prototype:
  npx http-server PROTOTYPE -p 3000
- Run unit/integration checks:
  node PROTOTYPE/tests/client.test.js
- Run Playwright e2e tests (install browsers first):
  cd PROTOTYPE
  npm ci
  npx playwright install --with-deps
  npx playwright test

Testing
- Add unit tests for client logic (200/401/429 and streaming behavior).
- Add Playwright tests for UI flows (side-panel, streaming, settings).
- Ensure tests pass locally before opening a PR.

UI changes (Chrome WebUI)
- Follow the component mapping in PROTOTYPE/COMPONENTS.md.
- For visual-only changes, consult or delegate to the frontend design owner listed in the issue.
- Include screenshots or a short GIF for UI changes.

AI-assisted content
- If you used AI tools to help write code or content, update CITATION.md and mention what was AI-assisted in your PR description.

Security & Privacy
- Never commit API keys or secrets. Use the prototype's mock server for tests.
- If you propose a Brave-managed proxy or server-side component, include a privacy impact and retention policy draft.

Code review checklist
- [ ] Changes are small and focused
- [ ] Tests added/updated and pass locally
- [ ] CI green on GitHub Actions
- [ ] Documentation updated (if behavior changes)
- [ ] CITATION.md updated if AI used

Thanks for contributing — we read all pull requests and will review them as soon as possible.
Developer Guide — Opencode Chromium Assistant

Overview
This guide helps contributors set up a dev environment, run unit and Playwright tests locally, and debug CI failures for the Opencode prototype.

Prerequisites
- Node.js 20+ and npm (use nvm or system package manager)
- Git and a GitHub account
- (Optional) Playwright CLI: installed via `npx playwright install` when running e2e
- For full Chromium development: see DEV_ENV_SETUP.md (depot_tools, GN/Ninja, disk/ram requirements)

Run the mock server
- Start the mock server (used by unit & e2e tests):

```bash
# from repository root
node tools/opencode-mock/server.js
# or (in PROTOTYPE) run the provided script
cd PROTOTYPE
npm run start-mock # if defined
```

Unit tests (fast)
- Run unit tests (includes client and SSE checks):

```bash
cd PROTOTYPE
npm ci
npm run test:unit
```

- The unit test scripts start the mock server if not already running and write logs into `PROTOTYPE/test-results` when run under CI.

Playwright e2e tests (end-to-end)
- Install browsers and run the Chromium project:

```bash
cd PROTOTYPE
npm ci
npx playwright install --with-deps
npx playwright test --project=chromium
```

- Run a single test or spec file (helpful for iteration):

```bash
npx playwright test tests/opencode.spec.ts -g "side panel opens"
npx playwright show-report
```

Adding tests
- Unit tests: add Node scripts under `PROTOTYPE/tests/` (e.g., `client.test.js`, `sse.test.js`). Keep them deterministic and avoid calling `process.exit()` inside shared runners (tests will run directly in CI as standalone scripts).
- Playwright tests: add `.ts` tests under `PROTOTYPE/tests/` using `@playwright/test`. Follow existing patterns for `beforeAll` and `afterAll` to manage the mock and static servers.

Running language server diagnostics
- If you use TypeScript files, install the TypeScript LSP and run `lsp_diagnostics` for changed files. On the dev machine:

```bash
# Install server if needed
npm i -g typescript typescript-language-server
# Use editor integration or run saved checks via the project's tooling (if available)
```

Debugging tips
- When a test fails locally:
  - Start the mock server manually and re-run the test to get reproducible logs.
  - For Playwright tests, run in headed mode: `npx playwright test --project=chromium --headed` and add `page.on('console', msg => console.log(msg.text()));` in the test to capture page logs.
  - Use `npx playwright show-report` to browse the HTML report in `playwright-report/`.

Troubleshooting CI failures
- CI captures logs and artifacts:
  - Unit/test logs and mock logs are saved to `PROTOTYPE/test-results/` and uploaded as `unit-test-logs` artifacts.
  - Playwright artifacts are uploaded as `playwright-report` and `test-results` (if configured).
- Use the GitHub CLI to inspect runs and download artifacts:

```bash
gh run list --repo <owner>/<repo>
gh run view <run-id> --repo <owner>/<repo> --log
gh run download <run-id> --repo <owner>/<repo> --name unit-test-logs -D ./tmp_artifacts
```

PR checklist for authors
- Include a short description and link to any issues
- Add tests for bug fixes or new features (unit and/or e2e)
- Run `npm ci` and `npm run test:unit` locally
- Run `npx playwright test --project=chromium` if you added UI tests
- Ensure no API keys or secrets are included (use OS keychain for keys)
- Update documentation (README, docs/DEVELOPER_GUIDE.md, docs/API.md) if API/behavior changes

Reviewer checklist
- [ ] Tests added or existing tests updated
- [ ] CI passes in unit and Playwright jobs
- [ ] Privacy & branding checked (see PRIVACY_SUMMARY.md); if branding or bundling OpenCode is mentioned, verify written permission from OpenCode (contact@anoma.ly)
- [ ] Documentation updated and clear

Notes
- This guide is intentionally concise — expand sections as needed for larger contributor audiences.
- For platform-specific build steps (Chromium/Brave integration) follow CHROMIUM_INTEGRATION.md.

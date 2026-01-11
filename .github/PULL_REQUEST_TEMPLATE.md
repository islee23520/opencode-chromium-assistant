## Summary

<!-- Short description of the change and why it was made -->

Related issue: #

## Testing

- How to run unit tests locally:

```bash
cd PROTOTYPE
npm ci
npm run test:unit
```

- How to run Playwright e2e locally:

```bash
cd PROTOTYPE
npx playwright install --with-deps
npx playwright test --project=chromium
```

Include screenshots or link to test report if applicable.

## CI expectations
- Unit tests and Playwright smoke tests must pass on PR
- CI uploads `unit-test-logs` and `playwright-report` artifacts for debugging

## Privacy & Branding checklist
- [ ] No API keys or secrets committed
- [ ] Privacy summary updated and consent flow implemented if necessary (see docs/PRIVACY_SUMMARY.md)
- [ ] If this PR touches branding or sets OpenCode as default, obtain written permission from OpenCode (contact@anoma.ly)

## Reviewer checklist
- [ ] Tests added/updated
- [ ] Docs updated where applicable
- [ ] Code follows project style
- [ ] Linting and basic diagnostics run
- [ ] Privacy/branding questions answered

Notes: Attach screenshots as files in the PR or link to report artifacts.

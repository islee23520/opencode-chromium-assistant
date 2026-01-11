Release Checklist — Opencode Chromium Assistant

Purpose: A step-by-step checklist for preparing, validating, and performing releases.

Pre-Release
- [ ] Legal & Branding: Confirm written permission from OpenCode for "Powered by OpenCode" and pre-selection; ensure Issue #3 resolved.
- [ ] License & Third-Party: Confirm THIRD-PARTY-LICENSES.md and LICENSE are up to date.
- [ ] Feature flags: Ensure enable_opencode_assistant default is disabled for official builds until legal signoff; set feature gating if needed.
- [ ] CI green: All unit and e2e tests pass in GitHub Actions across matrix (Ubuntu/macOS/Windows).
- [ ] Accessibility & Localization: Run A11y checks and verify localization strings coverage (COMPONENTS.md).
- [ ] Security review: Confirm threat model items addressed (ARCH_AUTH.md), no secrets or plaintext API keys in repo or logs.
- [ ] Performance smoke: Basic latency and error checks; confirm streaming behavior is responsive.
- [ ] Packaging approval: Confirm installers/build artifacts list and target platforms.
- [ ] Release notes: Draft release notes and changelog entries referencing PRs.
- [ ] Sign-offs: Obtain sign-off from Engineering lead, QA, Security, and Legal (if brand/bundling involved).

Release Steps
1. Create release branch: release/vX.Y.Z from main.
2. Run release build(s) on target platforms (GN args if applicable).
3. Run full test suite and packaging scripts locally/CI.
4. Upload artifacts to release storage (or create GitHub Release draft if releasing source only).
5. Publish release notes & changelog.
6. Deploy canary/staged rollout (if applicable) per rollout plan.

Post-Release (Monitoring)
- Monitor metrics for 72 hours (or per release policy):
  - Assistant Opt-in Rate
  - API Error Rate (4xx/5xx)
  - Average Response Latency
  - Rate-limit events (429)
- Rollback criteria: >5% error rate increase or sustained latency >2x baseline for >1 hour.
- Collect user feedback and iterate on any bug fixes.

Rollback
- Have a pre-defined rollback procedure: revert release branch, notify stakeholders, and open emergency fix PR.

Release Communications
- Prepare short announcement (what changed, privacy note, how to opt-in/out).
- Update README and docs with any new behavior/flags.

Release artifacts & checklists
- Attach the following to the Release PR/draft:
  - Link to CI run and test artifacts
  - Changelog entries
  - Accessibility audit report
  - Security sign-off summary
  - Packaging artifacts (binary or build logs)

Reference commands (examples)
- Build (Linux): ./src/build/install-build-deps.sh && gn gen out/Default --args='is_debug=true' && autoninja -C out/Default brave
- Run unit tests: autoninja -C out/Default <test_target>
- Run prototype e2e: cd PROTOTYPE && npx playwright test

Sign-off checklist (must be completed before publishing):
- [ ] Engineering
- [ ] QA
- [ ] Security
- [ ] Legal (brand/proxy confirmation)
- [ ] Product/PM

Notes
- For any proxy-based deployment, require a written agreement with OpenCode that specifies data-use restrictions, pricing/quotas, and SLAs.
- Keep release steps minimal and reversible for the first public release.

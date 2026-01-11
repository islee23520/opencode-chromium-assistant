Packaging notes — Opencode Chromium Assistant (prototype)

Objectives
- Provide guidance for packaging the prototype as an installable assistant or for mapping changes into Chromium/Brave build.

MacOS / Windows notes
- For an initial developer preview, provide an unsigned installer and clear instructions for installing the Side Panel extension and launching the prototype.
- For distribution inside Brave/Chromium: follow the browser's contribution and build processes. Do not pre-select OpenCode branding without written permission.

Binary distribution
- Provide packaged static assets for PROTOTYPE and simple scripts to host locally.
- For native installers, wrap the prototype into an application shell (e.g., Electron wrapper) if required, and ensure license files are included.

Licensing
- Project uses MIT. Include CITATION.md and THIRD-PARTY-LICENSES.md in release bundles.

Security checks
- Ensure no API keys or secrets are included in release artifacts.
- Verify that production builds use OS keychain for storing API keys rather than localStorage.

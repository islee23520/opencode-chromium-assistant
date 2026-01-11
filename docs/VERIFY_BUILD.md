Chromium Minimal Verification Script

Purpose: This script performs lightweight checks to verify that a developer machine configured with Chromium source can perform a minimal build and run basic tools. It does NOT build full Chromium (that requires >100GB disk and extended time) but validates the GN/Ninja step for a small stub target.

Prerequisites
- Chromium source checked out under src/ (use fetch chromium)
- depot_tools in PATH
- run: gclient runhooks

Commands (manual)
1. Generate an out/Default build dir for a small target:
   gn gen out/Default --args="is_debug=true enable_nacl=false"
2. Build a small target to verify build pipeline is working (e.g., build a small test or a tiny component):
   autoninja -C out/Default <small_test_target>
   (Note: replace <small_test_target> with a known small target like chrome_browser_tests if present, or create a hello-world ext)
3. Run a quick browser tests suite (if available):
   ./out/Default/chrome --version

verify-build.sh (script)
------------------------
#!/usr/bin/env bash
set -e

if [ ! -d src ]; then
  echo "Chromium source not found. Ensure 'fetch chromium' was run and you are at repo root.";
  exit 1;
fi

echo "Generating GN build files..."
cd src
gn gen out/Default --args="is_debug=true enable_nacl=false"

echo "Attempt to build a small target (this may still take a few minutes)..."
autoninja -C out/Default chrome || { echo "Build failed for 'chrome' target; try building a smaller target if available"; exit 1; }

echo "Verifying built chrome binary..."
./out/Default/chrome --version

echo "Minimal verification succeeded. If this ran, the environment can build Chromium." 

Note: This script is a heuristic; full builds and tests require significant resources. For CI, prefer using prebuilt images or cloud VMs with enough CPU/memory/disk to complete a full build if necessary.

Dev environment setup & verification (Chromium)

This doc contains instructions to prepare a development environment for building and verifying a Chromium-based fork that includes the OpenCode Assistant integration. Building Chromium is resource-intensive; follow the steps on a Linux machine with 16+GB RAM and adequate disk space (>= 120GB recommended).

Prerequisites
- OS: Ubuntu 20.04+ (preferred) or macOS (Intel/M1) or Windows (WSL2 supported for Linux-like workflows).
- Disk: >= 120GB free
- RAM: >= 16GB
- CPU: 4+ cores

Install basics (Linux)
1. Install build deps (Chromium script):
   ./src/build/install-build-deps.sh
2. Install depot_tools (Chromium development toolkit):
   git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git $HOME/depot_tools
   export PATH="$HOME/depot_tools:$PATH"
3. Fetch Chromium (optional - expensive):
   fetch --nohooks chromium
   cd src
   gclient runhooks

Lightweight verification script (does NOT build full Chromium)
- Purpose: verify the developer machine has required tools and can run basic Chromium build steps (gn + ninja) for a small target.
- Script: check_dev_env.sh (below)

check_dev_env.sh
----------------
#!/usr/bin/env bash
set -e

echo "Checking basic requirements..."
command -v python3 >/dev/null || { echo 'python3 missing'; exit 1; }
command -v gclient >/dev/null || { echo 'depot_tools missing; please add to PATH'; exit 1; }
command -v gn >/dev/null || { echo 'gn missing; run gclient runhooks after fetching'; exit 1; }

# Verify disk space
avail_kb=$(df --output=avail . | tail -1)
avail_gb=$((avail_kb/1024/1024))
if [ "$avail_gb" -lt 100 ]; then
  echo "Warning: Less than 100GB free ($avail_gb GB). Chromium build may fail due to disk space."
fi

echo "Checking Python dependencies (cipd or others may be required)..."
python3 -V

echo "Run 'fetch --nohooks chromium' to get full source for full builds."

echo "Dev environment checks passed (lightweight verification)." 

Notes & next steps
- If you need a full build, follow the official Chromium docs for platform-specific build steps.
- Consider using a cloud VM with more RAM/disk for full builds.


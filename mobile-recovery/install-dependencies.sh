#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-_mobile}"
cd "${APP_DIR}"

# First honour the audited manifest exactly. If npm detects an irreconcilable
# version left by the failed SDK migration, rebuild only the dependency
# versions through Expo's compatibility resolver; never alter app identity.
if npm install --no-audit --no-fund; then
  exit 0
fi

echo "Initial npm install failed; rebuilding dependency versions through Expo SDK compatibility resolution." >&2
rm -rf node_modules package-lock.json

node <<'NODE'
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const original = Object.keys(p.dependencies || {});
const base = new Set(['expo', 'react', 'react-native']);
const runtime = original.filter((name) => !base.has(name));
fs.writeFileSync('/tmp/divyanexus-runtime-dependencies.txt', runtime.join('\n'));
p.dependencies = {
  expo: p.dependencies.expo,
  react: p.dependencies.react,
  'react-native': p.dependencies['react-native'],
};
fs.writeFileSync('package.json', JSON.stringify(p, null, 2) + '\n');
NODE

npm install --no-audit --no-fund

mapfile -t RUNTIME_DEPS < <(grep -v '^$' /tmp/divyanexus-runtime-dependencies.txt || true)
if ((${#RUNTIME_DEPS[@]})); then
  npx expo install "${RUNTIME_DEPS[@]}"
fi

npx expo install --fix
npm install --no-audit --no-fund

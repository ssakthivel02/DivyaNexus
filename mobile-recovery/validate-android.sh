#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-_mobile}"
cd "${APP_DIR}"
mkdir -p reports

npm run validate:source
npx expo install --check
npx expo-doctor
npm run check
npm run lint

npx expo config --type public --json > reports/expo-config.json
node <<'NODE'
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('reports/expo-config.json', 'utf8'));
const checks = [
  [config.android?.package, 'com.divyanexus.app', 'Android package'],
  [config.android?.versionCode, 4, 'Android versionCode'],
  [config.version, '1.0.3', 'version name'],
  [config.extra?.eas?.projectId, 'e7251fb7-a83e-4834-b0d5-b6a4eab0e654', 'EAS project ID'],
];
for (const [actual, expected, label] of checks) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
  console.log(`PASS ${label}: ${actual}`);
}
NODE

npx expo export --platform android --clear
npx expo prebuild --platform android --clean --no-install

grep -R --line-number 'applicationId.*com.divyanexus.app' android/app/build.gradle
grep -R --line-number 'versionCode 4' android/app/build.gradle
grep -R --line-number 'versionName "1.0.3"' android/app/build.gradle

pushd android >/dev/null
chmod +x gradlew
./gradlew :app:assembleDebug :app:bundleRelease :app:lintRelease --stacktrace --no-daemon
popd >/dev/null

APK="android/app/build/outputs/apk/debug/app-debug.apk"
AAB="android/app/build/outputs/bundle/release/app-release.aab"
test -s "${APK}"
test -s "${AAB}"

APKANALYZER="$(find "${ANDROID_HOME}" -type f -name apkanalyzer | sort | tail -n 1)"
test -x "${APKANALYZER}"
APP_ID="$(${APKANALYZER} manifest application-id "${APK}")"
VERSION_CODE="$(${APKANALYZER} manifest version-code "${APK}")"
VERSION_NAME="$(${APKANALYZER} manifest version-name "${APK}")"
TARGET_SDK="$(${APKANALYZER} manifest target-sdk "${APK}")"

printf 'applicationId=%s\nversionCode=%s\nversionName=%s\ntargetSdk=%s\n' \
  "${APP_ID}" "${VERSION_CODE}" "${VERSION_NAME}" "${TARGET_SDK}" \
  | tee reports/android-manifest.txt

test "${APP_ID}" = "com.divyanexus.app"
test "${VERSION_CODE}" = "4"
test "${VERSION_NAME}" = "1.0.3"
test "${TARGET_SDK}" = "36"

sha256sum "${APK}" "${AAB}" > reports/artifact-sha256.txt
du -h "${APK}" "${AAB}" | tee reports/artifact-sizes.txt
npm audit --omit=dev --json > reports/npm-audit.json || true

echo "DivyaNexus Android compile validation passed."

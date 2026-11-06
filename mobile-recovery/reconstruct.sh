#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-${ROOT}/_mobile}"
ARCHIVE="${RUNNER_TEMP:-/tmp}/divyanexus-source-build.tar.xz"
EXPECTED_SHA256="88e9ca929d8ccd757d92feb5070deff7f1c40782b58c3d83e11dc509c875571d"

PARTS=(
  "${ROOT}/mobile-recovery/payload/source-build.tar.xz.part-00"
  "${ROOT}/mobile-recovery/payload/source-build.tar.xz.part-01"
  "${ROOT}/mobile-recovery/payload/source-build.tar.xz.part-02"
  "${ROOT}/mobile-recovery/payload/source-build.tar.xz.part-03.00"
  "${ROOT}/mobile-recovery/payload/source-build.tar.xz.part-03.01"
  "${ROOT}/mobile-recovery/payload/source-build.tar.xz.part-03.02"
  "${ROOT}/mobile-recovery/payload/source-build.tar.xz.part-03.03"
  "${ROOT}/mobile-recovery/payload/source-build.tar.xz.part-03.04"
  "${ROOT}/mobile-recovery/payload/source-build.tar.xz.part-04"
)

for part in "${PARTS[@]}"; do
  test -s "${part}" || { echo "Missing recovery payload: ${part}" >&2; exit 1; }
done

cat "${PARTS[@]}" > "${ARCHIVE}"
echo "${EXPECTED_SHA256}  ${ARCHIVE}" | sha256sum --check --strict -

rm -rf "${OUT}"
mkdir -p "${OUT}"
tar -xJf "${ARCHIVE}" -C "${OUT}"
python3 "${ROOT}/mobile-recovery/generate_assets.py" "${OUT}/assets/images"

test -s "${OUT}/assets/images/icon.png"
test -s "${OUT}/assets/images/android-icon-foreground.png"
test -s "${OUT}/assets/images/android-icon-background.png"
test -s "${OUT}/assets/images/android-icon-monochrome.png"
test -s "${OUT}/assets/images/favicon.png"

echo "Reconstructed DivyaNexus mobile source at ${OUT}"

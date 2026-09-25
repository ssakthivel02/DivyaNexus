# DivyaNexus production release checklist

Use this checklist for every production-affecting change. A green build alone is not production evidence.

## 1. Change identity

- [ ] Release/change name recorded
- [ ] Pull request number recorded
- [ ] Reviewed head SHA recorded
- [ ] Merged `main` SHA recorded
- [ ] Intended hostname and deployment environment recorded
- [ ] Related issue and acceptance criteria linked

## 2. Repository and build quality

- [ ] Clean install succeeds using the lockfile
- [ ] Production build succeeds
- [ ] Unit/component tests pass
- [ ] Route registry and static validators pass
- [ ] Playwright/browser regression passes
- [ ] Broken-link/missing-asset checks pass where applicable
- [ ] Security/dependency checks pass where applicable
- [ ] Deployment artifact identity is traceable to the merged SHA

## 3. Evidence and content trust

- [ ] Changed Tamil text received human editorial review where required
- [ ] Transliteration and English meaning were reviewed where applicable
- [ ] Deity, scripture, temple, history, governance, timing, price, condition, and support-link claims use approved evidence states
- [ ] A relationship/navigation edge is not treated as source evidence
- [ ] A source reference string is not treated as a reviewed source edition
- [ ] Image/audio rights and source records are present
- [ ] Generated guidance is not presented as scripture or primary-source evidence

## 4. Accessibility and user experience

- [ ] Keyboard navigation verified
- [ ] Visible focus verified
- [ ] Landmark and heading structure verified
- [ ] Interactive controls have accessible names
- [ ] Mobile layout has no unintended horizontal overflow
- [ ] Reduced-motion behavior is preserved
- [ ] Manual visual/device checks are explicitly recorded when they cannot be automated

## 5. Deployment safety

- [ ] Production secrets are injected, not committed
- [ ] Deployment target is explicit
- [ ] DNS/custom-domain assumptions are unchanged or explicitly reviewed
- [ ] PWA/service-worker cache marker is preserved or deliberately versioned
- [ ] Rollback commit/procedure is documented
- [ ] Emergency bypass, if used, records reason, approver, evidence, rollback path, and follow-up PR

## 6. Post-deployment evidence

Record the exact production URL, merged SHA, workflow run, and timestamp for each applicable check.

- [ ] Homepage returns expected HTTP status and release marker
- [ ] `release.json` identifies the deployed merged SHA
- [ ] `health.json` reports healthy status
- [ ] Critical direct routes return expected HTTP status
- [ ] Wave-specific routes are included in production smoke coverage
- [ ] `robots.txt`, sitemap, manifest, service worker, offline page, and security.txt are reachable
- [ ] Service-worker cache marker matches the intended release policy
- [ ] Owner-selected production assets return expected media type and bytes where checked
- [ ] Browser/manual evidence is recorded separately from automated HTTP evidence

Current Wave 10 critical production routes include `/nexus`, `/temples`, and `/learning` in addition to the established scripture, deity, audio, guidance, library, source, privacy, and status routes.

## 7. Decision

- Decision: GO / NO-GO
- Evidence owner:
- Manual acceptance owner:
- Known limitations:
- Rollback trigger:

A release is GO only when every applicable control has evidence. Mark non-applicable controls explicitly with a reason; do not silently skip them.

# DivyaNexus production release checklist

Use this checklist for every production-affecting change. A green build alone is not production evidence.

## 1. Change identity

- [ ] Release/change name recorded
- [ ] Pull request number recorded
- [ ] Reviewed head SHA recorded
- [ ] Merged SHA recorded
- [ ] Intended hostname and deployment environment recorded
- [ ] Related issue and acceptance criteria linked

## 2. Build and repository quality

- [ ] Clean install succeeds using the lockfile
- [ ] Production build succeeds
- [ ] Unit/component tests pass
- [ ] Route registry and route contracts pass
- [ ] Direct-route materialisation checks pass
- [ ] JSON/content schema checks pass
- [ ] Broken-link and missing-asset checks pass
- [ ] Dependency and code-security checks pass
- [ ] Build artifact ID and digest are recorded

## 3. Content trust

- [ ] Changed Tamil text received human editorial review
- [ ] Transliteration and English meaning were reviewed where applicable
- [ ] Deity, scripture, temple and tradition claims have approved provenance
- [ ] “Verified” and “Needs Review” status is correct
- [ ] Image/audio rights and source records are present
- [ ] No placeholder or unsupported AI-generated claim is presented as authoritative

## 4. Accessibility and user experience

- [ ] Keyboard navigation verified
- [ ] Visible focus verified
- [ ] Landmark and heading structure verified
- [ ] Accessible names and informative image text verified
- [ ] Mobile, tablet and desktop layouts reviewed
- [ ] Failure of optional PWA/AI capabilities does not break core reading/navigation

## 5. Deployment safety

- [ ] Production secrets are injected, not committed
- [ ] Deployment target is explicit
- [ ] DNS and custom-domain ownership are confirmed
- [ ] HTTPS certificate is healthy
- [ ] Rollback commit/procedure is documented
- [ ] Emergency bypass, when used, records reason, approver and follow-up PR

## 6. Post-deployment evidence

Record the exact production URL and timestamp for each check.

- [ ] Homepage returns expected HTTP status
- [ ] Critical direct routes return expected HTTP status
- [ ] Health/status endpoint reports the merged release/SHA
- [ ] Security headers match policy
- [ ] Canonical URLs and sitemap reference the production hostname
- [ ] Browser smoke test passes without console errors
- [ ] Deity search and detail navigation pass
- [ ] Tamil rendering and key bilingual content are visually reviewed
- [ ] Monitoring/nightly drift validation is active

## 7. Decision

- Decision: GO / NO-GO
- Evidence owner:
- Manual acceptance owner:
- Known limitations:
- Rollback trigger:

A release is GO only when every applicable control has evidence. Mark non-applicable controls explicitly with a reason; do not silently skip them.

# DivyaNexus Deity Encyclopedia — Wave 3

Date: 28 July 2026

## Objective

Replace the ten homepage-level deity orientation cards with a real, navigable bilingual encyclopedia foundation that remains transparent about scope, sources, confidence, and editorial limits.

## Quality tasks completed

1. Added a dedicated `/deities` encyclopedia directory.
2. Added direct detail routes at `/deities/:slug`.
3. Added ten reviewed foundational records.
4. Added English names.
5. Added Tamil names and Tamil summaries.
6. Added common transliteration aliases.
7. Added broad tradition filters.
8. Added Tamil, English, and transliteration search.
9. Added global-search integration.
10. Added iconographic orientation with explicit variation cautions.
11. Added forms and named pathways.
12. Added relationship context.
13. Added associated-text pathways without invented quotations.
14. Added observance context without current date or timing claims.
15. Added study questions for further learning.
16. Added source-category and confidence labels.
17. Added visible review dates.
18. Added external museum and scholarly references.
19. Added local bookmarks.
20. Added copy and share controls.
21. Added Ask Divya contextual links.
22. Added related-deity navigation.
23. Added an honest unknown-record fallback.
24. Added responsive layouts from 320px to desktop.
25. Added reduced-motion support.
26. Added detail-route Playwright coverage.
27. Added Tamil/transliteration search coverage.
28. Added mobile overflow checks.

## Records

- Shiva / சிவன்
- Parvati / பார்வதி
- Vishnu / விஷ்ணு
- Lakshmi / லட்சுமி
- Ganesha / விநாயகர்
- Murugan / முருகன்
- Saraswati / சரஸ்வதி
- Rama / ராமர்
- Krishna / கிருஷ்ணர்
- Nataraja / நடராஜர்

## Source approach

This wave uses museum collection records and scholarly orientation resources to support broad identification and iconographic context. It does not claim that a museum overview replaces a primary text, a living temple tradition, an initiated theological school, or specialist philological work.

Sources are registered centrally in `client/src/features/deities/sources.ts` and rendered on every deity detail page.

## Editorial safeguards

- No Sanskrit or Tamil verse is generated for deity pages.
- No unsupported temple foundation date is supplied.
- No current festival date or local ritual timing is supplied.
- No tradition is presented as the single universal Hindu view.
- Alternate names are treated as discovery aliases, not automatic theological equivalence.
- Primary text pathways are listed separately from museum and scholarly orientation.
- Confidence applies to the orientation layer, not to every possible theological interpretation.

## Files changed

Wave 3 contains 28 changed files: 26 added files and two modified application files.

## Validation gates

Required before merge:

- `pnpm install --frozen-lockfile`
- `pnpm run check`
- `pnpm run build`
- `pnpm exec playwright test`

## Next content wave

1. Add specialist-reviewed primary-text excerpts per deity.
2. Add licensed or original deity-specific artwork with provenance.
3. Add record-level temple relationships only after verification.
4. Add Tamil native-language editorial review.
5. Add source-version and reviewer metadata.
6. Add deity-to-scripture graph navigation.
7. Add deity-to-festival graph navigation.
8. Add scholar mode for terminology and textual witnesses.

## Rollback

Revert the final merge commit for this pull request. The prior ten-card editorial orientation remains preserved in Git history.

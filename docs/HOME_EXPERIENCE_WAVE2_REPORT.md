# DivyaNexus Home Experience Wave 2

Date: 28 July 2026

## Objective

Improve homepage brightness, make the archive pathways visible without opening another menu, add a fourth hero scene, strengthen truthful content signals, and expand missing deity orientation data without inventing unsupported claims.

## Completed quality tasks

1. Added a visible **Choose a path into the archive** panel to the homepage hero.
2. Included the four requested pathway ideas: Explore all, Deity universe, Life guidance, and Kids universe.
3. Added a direct **View all pathways** action.
4. Added a fourth hero visual scene using an existing production-owned image.
5. Added automatic hero rotation at a calm nine-second interval.
6. Added accessible pause/resume controls.
7. Disabled automatic motion when the visitor prefers reduced motion.
8. Added a prominent global-search launch control inside the hero.
9. Added five popular bilingual/source-oriented search chips.
10. Increased hero image brightness, saturation, and contrast without removing the dark luxury identity.
11. Reduced the darkness of the hero veil so imagery remains visible.
12. Added a four-part trust ribbon: Tamil-first, Source-aware, Local-first, and Family-friendly.
13. Added truthful collection evidence calculated from real application arrays.
14. Added a direct **Read source** action to Daily Wisdom.
15. Updated scripture homepage language to reflect the newly verified Sanskrit records.
16. Expanded the deity orientation collection from three cards to ten foundational cards.
17. Added responsive layouts for 320px, 375px, 430px, 768px, and desktop widths.
18. Added Playwright regression coverage for pathways, hero controls, brightness, search links, trust signals, deity count, and horizontal overflow.

## Deity orientation records added

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

These are editorial orientation records only. They do not introduce verse quotations, historical dates, temple claims, or school-specific theology before record-level source review.

## Files

### Added

- `client/src/data/homeExperience.ts`
- `client/src/data/deityEditorial.ts`
- `client/src/home-wave2.css`
- `tests/e2e/home-experience-wave2.spec.ts`
- `docs/HOME_EXPERIENCE_WAVE2_REPORT.md`

### Modified

- `client/src/pages/Home.tsx`
- `client/src/pages/ContentDirectory.tsx`

## Validation gates

Required before merge:

- `pnpm install --frozen-lockfile`
- `pnpm run check`
- `pnpm run build`
- `pnpm exec playwright test`

## Remaining high-value backlog

1. Produce and rights-clear additional original hero artwork rather than reusing an existing production image.
2. Add record-level deity citations and dedicated detail routes.
3. Add verified temple records with history, architecture, location, and current visitor data separately sourced.
4. Add reviewed Upanishad passages one text at a time.
5. Add production error monitoring, uptime checks, and broken-link scanning.
6. Add screenshot-diff visual regression for the homepage.
7. Review Tamil line wrapping with native-language editorial QA across all mobile sizes.
8. Add a content editorial workflow and review timestamps for deity and temple records.

## Rollback

Revert the final merge commit for this pull request. The previous homepage and three-card deity collection remain preserved in Git history.

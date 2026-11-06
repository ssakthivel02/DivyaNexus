# Deity Encyclopedia Feature

## Structure

- `types.ts` — stable content contract
- `sources.ts` — central source registry
- `records/*.ts` — one reviewed deity orientation per file
- `index.ts` — collection index, normalised search, slug resolution, and related-record resolution
- `components/deities/*` — reusable visual and provenance layers
- `pages/DeityDirectory.tsx` — discovery, Tamil/English/transliteration search, and broad filters
- `pages/DeityDetail.tsx` — direct record route, local actions, sources, and related pathways
- `deity-wave3.css` — responsive visual system

## Adding a record

1. Create one record file implementing `DeityRecord`.
2. Use a stable lowercase slug.
3. Add Tamil name, Tamil summary, and transliteration aliases.
4. Register every source in `sources.ts`.
5. Add source IDs to the record.
6. Mark uncertainty instead of filling gaps.
7. Add the record to `deityRecords` in `index.ts`.
8. Add Playwright coverage for the route and at least one discovery alias.
9. Review 320px, 390px, 768px, and desktop layouts.
10. Update the source register and editorial report.

## Non-negotiable boundaries

Do not add an unattributed quotation, fabricated date, unsupported temple claim, current festival timing, universalised school doctrine, or unlicensed image. Museum object context, primary text, lived practice, and generated explanation must remain separate layers.

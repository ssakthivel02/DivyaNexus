# DivyaNexus Speech & Reader Hardening — Wave 9

## Scope

Wave 9 continues from the verified Wave 8 production line. It strengthens browser-generated Tamil, Sanskrit and English reading aids without presenting synthetic speech as human recitation, chanting or reviewed pronunciation.

## Implemented quality controls

1. Clean feature branch created from the current `main` head.
2. No self-mutating or branch-writing pull-request workflow introduced.
3. Reusable typed `useSpeechSynthesis` controller retained and hardened.
4. Explicit unsupported, loading, ready, speaking, paused, stopped, completed and error states.
5. Voice discovery refreshes through `voiceschanged`.
6. Empty initial voice lists settle safely and can refresh later.
7. Exact language and language-prefix voice preference logic.
8. User-selectable device voice when multiple matching voices exist.
9. Play, Pause, Resume and Stop controls with truthful states.
10. Rapid repeat starts and overlapping utterances are blocked.
11. Speech resets when the selected listening room changes.
12. Speech resets when the selected language/text layer changes.
13. Speech cancels on component unmount and route removal.
14. Unsupported-browser guidance is visible without requiring a disabled-button click.
15. Synthesis errors preserve a transcript-first fallback.
16. Rate, selected text layer and voice choices use a versioned validated local schema.
17. The selected transcript remains visible before, during and after playback.
18. One atomic live-status surface avoids duplicate screen-reader announcements.
19. Audio-room tabs support Arrow keys, Home and End with roving tab focus.
20. Reduced-motion rules disable decorative waveform movement.
21. Tamil-only, English-only and bilingual reader modes remain available.
22. Reader language preference persists locally.
23. Reader speech remains separated from primary text, transliteration, editorial translation and reflection.
24. Every currently verified word note includes a Tamil meaning.
25. Pure unit tests validate preference versions, sanitisation and rate bounds.
26. Browser tests cover unsupported speech, delayed voices, cancellation and persistence.
27. Browser checks retain 320-pixel overflow coverage, alongside the Wave 8 responsive suite.
28. A dedicated static Wave 9 validator enforces truth, lifecycle and accessibility markers.
29. Pull-request validation runs TypeScript, all static gates, unit tests, production build, route materialisation and artifact validation.
30. Browser-local export, import and clear-data flows now include reader and speech preferences.

## Truth boundaries

- Playback never starts automatically.
- Speech quality and language availability depend on the browser and operating system.
- Synthetic speech is an accessibility and reading aid, not a reviewed recitation.
- Vedic accent, meter and pronunciation must not be inferred from device speech.
- The verified text and linked source remain authoritative for the displayed source layer.
- Local preferences do not imply an account, cloud synchronisation or cross-device backup.

## Required release evidence

Before merge:

```bash
pnpm install --frozen-lockfile
pnpm run check
node scripts/validate-source-boundaries.mjs
pnpm exec tsx scripts/validate-route-manifest.ts
pnpm exec tsx scripts/validate-route-metadata.ts
pnpm exec tsx scripts/validate-editorial-registry.ts
node scripts/validate-pwa-assets.mjs
node scripts/validate-owner-artwork.mjs
node scripts/validate-readability-audio.mjs
node scripts/validate-speech-reader-wave9.mjs
pnpm run test:unit
pnpm run build
pnpm exec tsx scripts/materialize-pages-routes.ts
node scripts/validate-build-artifact.mjs
pnpm exec playwright test
```

After merge, production smoke must verify the deployed commit, `/audio`, `/rig-veda`, `/bhagavad-gita`, visible transcripts, owner artwork and release evidence. Manual acceptance remains necessary on Windows Chrome, Firefox and Edge plus one mobile device because installed voice inventories cannot be proven by CI.

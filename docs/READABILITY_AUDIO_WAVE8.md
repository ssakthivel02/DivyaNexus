# DivyaNexus Readability & Audio Wave 8

Date: 28 July 2026

## Production defects addressed

1. The owner-selected WebP existed in the repository and deployment, but the intended homepage component was not rendered in the prominent content sequence.
2. The site-wide night palette, image veils and muted labels were darker than required at normal browser zoom.
3. Tamil reader content was smaller and visually weaker than adjacent English content.
4. Current verified key-term notes were English-only.
5. The audio route exposed a preparation experience rather than source-specific multilingual listening.
6. The scripture reader's Listen action navigated away instead of providing contextual playback.
7. A prior global artwork render could duplicate the intended homepage placement after integration.
8. Service-worker caching could make the artwork fallback test non-deterministic.

## Completed quality tasks

1. Render the approved artwork in the homepage content sequence.
2. Place it immediately after trust and collection evidence.
3. Add a hero shortcut to the artwork.
4. Add a stable `owner-portal-vision` anchor.
5. Prioritise the selected image for immediate discovery.
6. Preserve uncropped `object-fit: contain` presentation.
7. Preserve a repository-owned local fallback image.
8. Remove duplicate App-shell artwork rendering.
9. Brighten the global night colour palette.
10. Increase dark-panel separation.
11. Increase muted-text contrast.
12. Increase hero-image brightness and saturation.
13. Reduce excessive hero veil opacity.
14. Brighten the scripture-reader environment.
15. Increase manuscript-paper luminance.
16. Increase Sanskrit source-text contrast.
17. Increase transliteration size and line height.
18. Use a cross-platform Tamil font stack.
19. Increase Tamil translation size and weight.
20. Increase Tamil line spacing.
21. Add Tamil-only reader mode.
22. Add English-only reader mode.
23. Retain bilingual reader mode.
24. Expand the reader font-size range.
25. Add Tamil explanations for all 16 current verified word notes.
26. Add reusable browser speech-synthesis support.
27. Add exact and language-prefix voice selection.
28. Add Tamil device-speech selection.
29. Add Sanskrit device-speech selection.
30. Add IAST transliteration speech selection.
31. Add English device-speech selection.
32. Add language-specific recommended speech rates.
33. Add Play, Pause, Resume and Stop controls.
34. Add adjustable speech speed and reset.
35. Keep the selected transcript visible during playback.
36. Embed speech controls in the scripture reader.
37. Replace the generic audio page with verified Agni, Pūṣan and Gita listening paths.
38. Route each audio record to the correct full reader.
39. Update the compact global audio launcher.
40. Prohibit autoplay.
41. Label device speech as synthetic.
42. State that device speech is not reviewed recitation.
43. State that Vedic accents are not preserved by device speech.
44. Explain fallback behaviour when a matching Tamil or Sanskrit voice is unavailable.
45. Add responsive speech-control layouts.
46. Add Tamil readability and language-mode browser tests.
47. Add speech lifecycle, rate, voice and route browser tests.
48. Add 320, 390, 768 and 1440 pixel overflow tests.
49. Bump the service-worker cache to `divyanexus-stage-b-wave8-v1`.
50. Add Wave 8 checks to pull-request, deployment, nightly and production-smoke workflows.

## Audio truth boundary

The speech feature uses the Web Speech API and a voice installed by the browser or operating system. It is an accessibility and study aid. It is not a human recording, traditional chanting performance, pronunciation certification or teacher-reviewed Vedic recitation.

Voice availability and quality vary by browser, operating system, installed language packs and device settings. Tamil or Sanskrit may use a fallback voice when a matching voice is unavailable. Vedic accent marks and recitation discipline are not preserved by synthetic speech.

## Release gates

- Frozen dependency installation
- TypeScript
- Source, route, metadata and editorial contracts
- PWA and offline contracts
- Owner-artwork contract
- Wave 8 readability and audio contract
- Production build
- GitHub Pages direct-route materialisation
- Deployable artifact validation
- Complete Playwright browser suite
- Post-deployment production smoke

## Manual device dependency

No manual repository edit is required. On a device that does not report a Tamil or Sanskrit voice, install or enable the corresponding operating-system speech language. The application remains readable and clearly reports when it must use a fallback voice.

# DivyaNexus Readability & Audio Wave 8

Date: 28 July 2026

## Production issues addressed

1. The owner-selected WebP was deployed but the homepage never rendered `PortalArtworkPanel`.
2. The night palette and image veils made several sections appear darker than intended.
3. Tamil reader text was smaller and lighter than the surrounding English content.
4. Reader word notes were English-only.
5. The audio route intentionally exposed a preparation screen with no playback.
6. The reader's Listen action navigated away instead of providing contextual playback.

## Completed quality tasks

1. Render the approved owner artwork on the homepage.
2. Place it immediately after the trust and collection-evidence area.
3. Add a hero shortcut to the artwork.
4. Add a stable artwork anchor.
5. Prioritise the selected image for immediate discovery.
6. Preserve the uncropped presentation contract.
7. Preserve the safe local fallback.
8. Brighten the global night colour palette.
9. Increase dark-panel separation.
10. Increase muted-text contrast.
11. Increase hero-image brightness and saturation.
12. Reduce excessive hero veil opacity.
13. Brighten the scripture reader environment.
14. Increase manuscript-paper luminance.
15. Increase Sanskrit source-text contrast.
16. Increase transliteration size and line height.
17. Use Noto Sans Tamil for Tamil body text.
18. Increase Tamil translation size and weight.
19. Increase Tamil line spacing.
20. Add Tamil-only reader mode.
21. Add English-only reader mode.
22. Retain bilingual reader mode.
23. Expand the reader font-size range.
24. Add Tamil explanations for all 16 current verified word notes.
25. Add reusable browser speech synthesis support.
26. Add Tamil device-speech selection.
27. Add Sanskrit device-speech selection.
28. Add IAST transliteration speech selection.
29. Add English device-speech selection.
30. Add Play, Pause, Resume and Stop controls.
31. Add adjustable speech speed.
32. Keep the selected transcript visible during playback.
33. Embed speech controls in the scripture reader.
34. Replace the audio preparation screen with a working listening room.
35. Add verified Agni, Pūṣan and Gita listening paths.
36. Route each listening item to the correct full reader.
37. Update the compact audio launcher.
38. Prohibit autoplay.
39. Label device speech as synthetic.
40. State that device speech is not reviewed recitation.
41. State that Vedic accents are not preserved by device speech.
42. Add responsive speech-control layouts.
43. Add Tamil readability browser tests.
44. Add reader language-switch browser tests.
45. Add speech lifecycle browser tests.
46. Add 320, 390 and 768 pixel overflow tests.
47. Add static Wave 8 source-contract validation.
48. Bump the service-worker cache to Wave 8.
49. Add Wave 8 checks to pull-request, deployment and nightly workflows.
50. Add production smoke coverage for audio, Rig Veda, Bhagavad Gita and the Wave 8 service worker.

## Truth boundary

The speech feature uses the Web Speech API and a voice installed by the browser or operating system. It is an accessibility and study aid. It is not a human recording, traditional chanting performance, pronunciation certification, or teacher-reviewed Vedic recitation.

Voice availability and quality vary by browser, operating system, installed language packs and device settings. Tamil or Sanskrit may use a fallback voice when a matching voice is unavailable.

## Release gates

- Frozen dependency installation
- TypeScript
- Source, route, metadata and editorial contracts
- PWA and offline contracts
- Owner artwork contract
- Wave 8 readability and audio contract
- Production build
- GitHub Pages direct-route materialisation
- Deployable artifact validation
- Complete Playwright browser suite
- Post-deployment production smoke

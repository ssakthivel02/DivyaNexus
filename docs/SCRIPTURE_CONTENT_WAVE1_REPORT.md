# DivyaNexus Scripture Content Wave 1

Date: 27 July 2026

## Objective

Replace the scripture reader's generic "source edition pending" panel with a transparent, source-grounded reading layer for the five existing verse records that can be verified now.

## Records completed

1. Rig Veda 1.1.1 — Agni
2. Rig Veda 1.42.1 — Pūṣan
3. Rig Veda 1.50.1 — Sūrya
4. Bhagavad Gita 2.47
5. Bhagavad Gita 4.7

The existing Upanishads introduction remains an editorial overview. It does not display an invented quotation.

## Source method

### Rig Veda 1.1.1

- Primary reference: Vedic Heritage Portal, Rigveda Shakala Shakha, Mandala 1, Sukta 1
- Link: https://vedicheritage.gov.in/rigveda-shakala-shakha-mandala-01-sukta-01/

### Rig Veda 1.42.1

- Sanskrit text mirror: Sanskrit Wikisource, Rigveda Sukta 1.42
- Link: https://sa.wikisource.org/wiki/%E0%A4%8B%E0%A4%97%E0%A5%8D%E0%A4%B5%E0%A5%87%E0%A4%A6%E0%A4%83_%E0%A4%B8%E0%A5%82%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%82_%E0%A5%A7.%E0%A5%AA%E0%A5%A8

### Rig Veda 1.50.1

- Sanskrit text mirror: Sanskrit Wikisource, Rigveda Sukta 1.50
- Link: https://sa.wikisource.org/wiki/%E0%A4%8B%E0%A4%97%E0%A5%8D%E0%A4%B5%E0%A5%87%E0%A4%A6%E0%A4%83_%E0%A4%B8%E0%A5%82%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%82_%E0%A5%A7.%E0%A5%AB%E0%A5%A6

### Bhagavad Gita 2.47

- Primary text platform: Gita Supersite, IIT Kanpur
- Link: https://www.gitasupersite.iitk.ac.in/srimad?choose=1&field_chapter_value=2&field_nsutra_value=47&language=dv&show_mool=1

### Bhagavad Gita 4.7

- Primary text platform: Gita Supersite, IIT Kanpur
- Link: https://www.gitasupersite.iitk.ac.in/srimad?choose=1&field_chapter_value=4&field_nsutra_value=7&language=dv&show_mool=1

## Editorial boundaries

- Original Sanskrit is shown separately from translation and reflection.
- Vedic accent marks are omitted in the application display for cross-device readability.
- Tamil and English renderings are original DivyaNexus editorial translations.
- No third-party commentary is copied into the records.
- Word notes are concise orientation aids, not exhaustive philological definitions.
- The source URL and review date remain visible in every completed record.
- Readers are encouraged to consult a qualified teacher for recitation, accent, school-specific interpretation, and deeper commentary.

## User-visible improvements

- Verified primary text replaces the generic missing-edition notice for five records.
- IAST transliteration is displayed.
- Tamil and English translations are displayed side by side.
- Key terms are explained separately.
- Source provenance and review date are visible.
- Copy Reference includes the source URL.
- The record trail uses corrected mantra-level titles for Rig Veda 1.42.1 and 1.50.1.
- Unverified records continue to show an honest source-required fallback.

## Automated coverage added

`tests/e2e/scripture-content.spec.ts` checks:

- all five records render the expected Sanskrit opening text;
- the previous generic placeholder is absent;
- Tamil and English editorial layers are present;
- source provenance is visible;
- external source links open in a new tab;
- record switching does not create a blank state.

## Remaining content backlog

1. Add reviewed Upanishad passages one text at a time with edition-level provenance.
2. Add Vedic accent display as an optional scholar-mode layer.
3. Add verified audio only where recitation provenance and usage rights are documented.
4. Add word-by-word parsing reviewed by a Sanskrit or Vedic-language editor.
5. Expand Rig Veda hymns at mantra level rather than representing an entire Sukta with a generic summary.
6. Add source-version identifiers and editorial review workflow.

## Validation status

- Source-level implementation: complete
- TypeScript: pending GitHub Actions
- Production build: pending GitHub Actions
- Playwright: pending GitHub Actions
- Production deployment: not performed by this branch

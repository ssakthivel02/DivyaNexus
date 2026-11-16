# DivyaNexus mantra library — candidate intake (16 November 2026)

**Release status: EDITORIAL HOLD.** This branch is a draft candidate, not authorisation to publish. No deployment or merge is included.

## Scope
- Sixteen high-priority mantra/name-japa candidates covering Murugan, Shiva, Ganesha, Vishnu, Rama, Krishna, Devi, Hanuman, Lakshmi, Saraswati, Ayyappa, the Gayatri, and Upanishadic peace prayers.
- Tamil reading aid, Devanagari where applicable, IAST-style Roman transliteration, concise original editorial Tamil/English explanations and source-review status.
- Search and deity/tradition filter in a standalone `/mantras` route.
- Client-only japa counter, targets 11/21/54/108/1008, persistent per-mantra counts, Undo and confirmed Reset. It is manual and optional. No autoplay, recording, voice validation, login, API bill, analytics, or server write.
- Metadata `noindex,follow` until a human editor approves publication.
- Global browser-local clear-data action removes `divyanexus.japa.v1`. Existing local-library export/import does NOT yet include japa progress. No cross-device synchronisation.

## Content evidence boundaries
- **Source-linked** is not the same as **verified or editorially approved**. A link is a comparison lead, not a certification of the displayed wording.
- Five widely used devotional forms have **editorial-review-needed** and no invented text-level citation: Sri Rama Jayam; Durga, Hanuman, Lakshmi and Saraswati invocations.
- Murugan and Vel Vel entries link to the existing OmSaravanaBhava mantra collection; they are not claimed as Rig Vedic quotations.
- Hare Krishna entry is the Krishna-first Gaudiya usage; Kali-Santarana Upanishad editions may use the Rama-first ordering. Review textual witnesses and school-specific context.
- Rig Veda recitation accents are omitted from the readable candidate. Tamil phonetics are approximations and should not be treated as a substitute for Vedic oral transmission.
- Sources for research comparison:
  - https://omsaravanabhava.org/murugan-mantras.html
  - https://sanskritdocuments.org/doc_devii/shivapanchAkSharIbhAShyam-ta.pdf
  - https://www.arshavidya.org.uk/a/pdfs/GanapatiAtharvashirshaUpanishad.pdf
  - https://ignca.gov.in/Asi_data/16305.pdf
  - https://indike.org/pramana/in.veda.upanisad.vaisnava.kalisantarana
  - https://www.swamiayyappan.in/mantras
  - https://vedshala.org/rigveda/3/62/10
  - https://www.vedicsamhita.in/vedas/rigveda/7/59
  - https://upanishads.org.in/u/brihadaranyaka/p/1.3.28
  - https://upanishads.org.in/u/taittiriya/p/2.invocation

## Pre-merge gate
1. Have a Sanskrit/Tamil subject matter reviewer verify all displayed scripts, sandhi, line boundaries, and pronunciation approximations, including variant/lineage context.
2. Reconcile with existing `client/src/data/verifiedScripture.ts`, `client/src/data/provenance.ts`, and pending Murugan literature PR #81. Avoid duplicate catalog records or conflicting claims.
3. Run `pnpm check`, `pnpm test:unit`, `pnpm build`, and mobile + desktop accessibility/browser checks on the exact PR head. Record the exact SHA and test evidence; do not invent results.
4. Check local privacy: per-mantra persistence, target changes, private-mode storage denial, Undo, confirmed Reset, navigation, keyboard/touch and clear-local-data behaviour.
5. Human approval before removing `noindex` or publishing. No GitHub merge, production change, paid-provider action or release until explicit user permission.

## Out of scope
- No promises of health, wealth, relief, or other guaranteed outcomes from chanting.
- No mandatory ritual count (108 is a configurable option, not a universal rule).
- No unverified long stotras, copyrighted audio, phonetic grading or audio synthesis.
- No modifications to the separate Murugan literature PR #81 or DivyaNexus content factory.

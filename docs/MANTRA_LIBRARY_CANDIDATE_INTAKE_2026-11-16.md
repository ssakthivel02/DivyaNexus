# DivyaNexus mantra library — candidate intake (16 November 2026)

**Release status: EDITORIAL HOLD.** This branch is a draft candidate, not authorisation to publish. No deployment or merge is included.

## Scope
- Nineteen high-priority mantra/name-japa candidates covering Murugan, Shiva, Ganesha, Vishnu, Rama, Krishna, Devi, Hanuman, Lakshmi, Saraswati, Ayyappa, the Gayatri, and Upanishadic peace prayers.
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
  - https://sanskritdocuments.org/doc_devii/shivapanchAkSharIbhAShyam.html
  - https://www.arshavidya.org.uk/a/pdfs/GanapatiAtharvashirshaUpanishad.pdf
  - https://ignca.gov.in/Asi_data/16305.pdf
  - https://iskcon.org/meditation/ (Krishna-first displayed tradition)
  - https://indike.org/pramana/in.veda.upanisad.vaisnava.kalisantarana (Rama-first comparison only)
  - https://www.swamiayyappan.in/mantras
  - https://vedshala.org/rigveda/3/62/10
  - https://www.vedicsamhita.in/vedas/rigveda/7/59
  - https://heritage.iitk.ac.in/BRU/1.3.28 (institutional comparison)
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

## 20 November 2026 continuation — targeted source and engineering reconciliation
- Viewed the OmSaravanaBhava mantra page and confirmed the displayed short Tamil forms for Skanda Sharanam, Shanmuga Sharanam and Muruga Sharanam. Added only these three short devotional invocations with original explanatory summaries; no long-stotra or audio copying. Total 19 candidates (14 with source leads, five exact-source pending).
- Compared the ISKCON official meditation page with the Kali-Santarana Upanishad witness: use ISKCON for the displayed Krishna-first form, and retain Rama-first as a distinct witness, not a conflicting proof of identical text.
- Confirmed a verse-level Rigveda 3.62.10 reading aid, Rigveda 7.59.12 location, and IIT Kanpur Heritage 1.3.28 location. Improved Tamil summary of the latter to retain the third clause about mortality. These checks are not a completed human Sanskrit/Tamil review.
- Source pages, editions, and any modern commentary/reuse licences must be checked separately before release. This repository is public: draft/noindex is not a copyright, confidentiality, or access-control boundary. No modern source translation, audio, or long text imported by this continuation.
- Fixed target reduction followed by Undo so that one tap removes just one previously counted repetition, rather than silently truncating saved counts to the new goal. Neutral bilingual completion text is appropriate across traditions. Added deterministic regressions.
- Keep the existing PR #83 runner fix separate; no duplicate workflow edits here. No merge/deploy. The five outstanding source records, human text/rights approval and exact-head browser validation remain open.

## Additional source reconciliation — 20 November 2026
All 19 displayed candidates now have a linked research reference; this is not 19 verified canonical texts. The five previously unlinked records were compared to the following rendered public pages:

| Record | Evidence and limitation |
|---|---|
| rama-jayam | [Covaipost, Rama Nama Japa report](https://www.covaipost.com/coimbatore360/on-a-mission-to-complete-100-crore-rama-nama-japa/) (2016): documents chanting and writing Sri Rama Jayam. This is devotional usage evidence, not proof of a Sanskrit original or ancient verse. |
| devi-durgayai | [Drik Panchang, Durga Beeja Mantra](https://www.drikpanchang.com/vedic-mantra/goddesses/durga/mantra/durga-beej-mantra.html): displayed short Devanagari form matches. Earliest edition and lineage remain unestablished. |
| hanuman-namah | [Drik Panchang, Hanuman Sahasranamavali](https://www.drikpanchang.com/deities-namavali/gods/god-hanuman/1000-hanuman-names.html?lang=en): name 1 matches; not a claim of universal initiation practice. |
| lakshmi-mahalakshmi | [Drik Panchang, Adi Lakshmi Ashtottara](https://www.drikpanchang.com/deities-namavali/goddesses/lakshmi/ashta-lakshmi/adi-lakshmi/108-adi-lakshmi-names.html): name 55 matches; not an authenticated critical edition. |
| saraswati-aim | [Drik Panchang, Saraswati mantras](https://www.drikpanchang.com/vedic-mantra/goddesses/saraswati/saraswati-mantras.html): item 1 matches; earliest textual lineage remains unestablished. |

These are supplemental bibliographic links only. No modern prose translations, complete namavali, ritual instructions, copyrighted images or recordings were imported. Textual edition, Tamil transliteration, lineage, bīja/teacher-guidance context, and rights review remain mandatory before publication. All older counts in this document are historical snapshots. No new mantra entries were added in this cycle.

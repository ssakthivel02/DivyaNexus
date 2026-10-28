# Murugan Tamil works — publication intake register

This register is for **website-hosted original Tamil text**, not links replacing the actual works. All existing routes and external links must remain unchanged. Never claim a work is complete because its title appears in the catalog.

## First source candidate: Kandar Anubhuti (கந்தர் அனுபூதி)

- Attributed author: Arunagirinathar (classical work).
- Primary public transcription candidate: Tamil Wikisource, page title “கந்தர் அனுபூதி”.
- Source locator for editorial verification: https://ta.wikisource.org/wiki/கந்தர்_அனுபூதி
- Source structure: opening invocation plus verses numbered 1–51 on that page.
- Source license: inspect work-specific public-domain statement **and** Wikimedia contributor/attribution and ShareAlike requirements before republishing editorial elements. Record the permanent page revision ID, retrieval date, edition variance and the applicable terms.
- **Current decision: NOT IMPORTED, NOT PUBLISHED.** Full text has not been compared and approved. No claim is made that the external page is this product's source-controlled text.

## Import acceptance for EACH work

1. Preserve complete UTF-8 Tamil text **inside the repository**; no runtime redirect or third-party iframe.
2. Save the exact source edition, stable locator/revision, author, editor if relevant, original license, attribution and redistribution basis.
3. Identify canonical boundaries from the source, including invocation and stanza numbering. Do not infer verse boundaries from display line wrapping.
4. Check missing/duplicate verses, source order, Unicode encoding and unexpected HTML/application-shell contamination.
5. Record an explicit reviewer and date; check text content against the selected source edition.
6. Supply automated tests for exact count (when source establishes one), opening and closing content, intra-site navigation and mobile usability.
7. Only after all evidence is verified, set `reviewStatus: "published"` and attach `textTa` in `client/src/data/muruganTamilLibrary.ts` (or a local imported module).
8. Run exact-head CI and approve a narrow release. Never deploy an empty catalog as a complete corpus.

## Current catalog queue

- Kandar Anubhuti, Kandar Alankaram, Kandar Andhadhi, Kandar Kalivenba
- Tirumurukarruppatai, Tiruppugazh
- Kanda Sashti Kavasam, Shanmuga Kavasam
- Vel Virutham, Mayil Virutham, Seval Virutham

Additional works need separate entry records and verified source/rights evidence. Music recordings are separate assets with separate performance and recording rights.

## Important caveats

- Classical composition rights and rights in a modern digitization, editorial apparatus, translation, and recording may differ.
- Wikisource availability is not automatically permission to republish every modern annotation or musical performance.
- The currently listed eleven works are **pending review**. They are not a complete public library.

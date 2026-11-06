# Murugan Tamil works — publication intake register

This register is for **website-hosted original Tamil text**, not links replacing the actual works. All existing routes and external links must remain unchanged. Never claim a work is complete because its title appears in the catalog.

## First source candidate: Kandar Anubhuti (கந்தர் அனுபூதி)

- Attributed author: Arunagirinathar (classical work).
- Primary public transcription candidate: Tamil Wikisource, page title “கந்தர் அனுபூதி”.
- Selected source witness for editorial comparison: Tamil Wikisource, fixed revision **1526108** (2023-10-03): https://ta.wikisource.org/w/index.php?title=கந்தர்_அனுபூதி&oldid=1526108
- Selected witness structure: opening invocation (`காப்பு`) plus numbered verses **1–51**, or 52 sections including the invocation. These counts describe this selected witness, **not** every Kandar Anubhuti edition. Other editions may contain additional numbered poems (e.g. https://kaumaram.com/anuboothi/index.html); do not silently mix editions.
- Source reuse: verify the revision-specific contributor credits, relevant license or public-domain status, attribution and any ShareAlike obligations. Classical authorship alone does not clear editorial/transcription or recording rights.
- **Current decision: IMPORTED FOR EDITORIAL REVIEW ONLY; NOT APPROVED FOR PUBLICATION.** A local 52-section candidate transcription is stored in `client/src/data/murugan/kandarAnubhutiTa.ts`, but the public reader does **not** import it and the library registry retains `reviewStatus: "pending-source-review"`. Structural checks passed. A manually transferred **rendered-page** source-to-repository collation matched all **52/52 sections with zero differences** (see PR #81 discussion, 2026-11-05). This is **not** an authenticated export of the fixed `oldid=1526108` source revision: immutable source acquisition, provenance/permission review, edition-scope approval and named editorial sign-off remain outstanding. The draft transcription is committed to the repository and therefore may be visible to anyone with repository access, even though the site reader does not import it. No published-work claim is authorized.

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

# DivyaNexus Wave 10 — Provenance and Evidence Contract

## Purpose

Wave 10 separates three concepts that must never be collapsed:

1. **Knowledge record** — the user-facing learning unit.
2. **Navigation relationship** — an editorial recommendation for where to study next.
3. **Provenance object** — evidence metadata describing what source/reference support is actually registered for a record.

A relationship edge is never evidence for a textual, historical, doctrinal or causal claim.

## Evidence strength states

### `primary-reference`

Reserved for a record whose reviewed source edition is actually registered and validated. Wave 10 currently assigns **no record** this state.

### `editorial-source-needed`

A precise traditional/canonical reference location is present, but a reviewed source edition is still required before quotation-grade evidence can be claimed.

### `editorial-overview`

The content is explicitly an editorial orientation, glossary, learning overview or reflective guide. It must not be rendered as a primary-source quotation.

## Review states

- `source-edition-needed` — an explicit open provenance requirement.
- `editorial-reviewed` — the record is intentionally editorial; this does not convert it into primary evidence.

## Ranking contract

Provenance can provide only a bounded ranking boost after lexical relevance exists. Evidence strength must never create a search match by itself. This prevents a strongly-labelled record from outranking unrelated but genuinely matching material.

## User-interface contract

The Knowledge Nexus must expose:

- the source kind;
- source label and reference;
- evidence-strength language;
- English evidence note;
- Tamil evidence note;
- open source-edition requirements;
- an explicit boundary that no record is labelled `Primary reference linked` until the reviewed source edition exists and passes validation.

## Prohibited representations

Wave 10 must not:

- infer a quotation from a navigation relationship;
- represent editorial translation or explanation as primary text;
- promote a reference string to verified-source status without a reviewed edition;
- use citation count as a proxy for truth or confidence;
- fabricate source URLs, editions, translators, publication details, manuscript lineage or recitation authority;
- present generated text as scripture, reviewed commentary or human recitation.

## Validation obligations

The Wave 10 static validator and unit tests must fail when:

- provenance points to an unknown record;
- evidence levels are weakened or reordered incorrectly;
- a `primary-reference` claim is introduced without the corresponding reviewed-source implementation and validation update;
- evidence notes or Tamil evidence notes are missing;
- provenance ranking produces a result without lexical relevance;
- the Knowledge Nexus provenance ledger or truth boundary is removed.

This contract is deliberately conservative. DivyaNexus should become more authoritative by adding inspectable evidence, not by increasing confidence language ahead of the evidence.

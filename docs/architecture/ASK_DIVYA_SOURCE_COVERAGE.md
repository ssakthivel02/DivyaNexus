# Ask Divya reviewed-corpus coverage

Ask Divya may retrieve only records that pass the repository review gate in `server/askDivya/corpus.ts`.

## Current review gate

The canonical content model currently exposes two review states:

- `Editorial overview` — eligible for Ask Divya retrieval.
- `Starter record — source edition to be linked` — not eligible for Ask Divya retrieval.

The runtime must not promote a starter record into the reviewed corpus simply because it has a matching keyword, route, deity, temple, scripture, or other topic label.

## Coverage accounting

`getAskDivyaCorpusCoverage()` reports the number of eligible records in every canonical content category.

A category with a count of zero is explicitly **unavailable to Ask Divya from the reviewed corpus**. It must not be treated as implicitly covered by another page, a keyword match, a relationship edge, or an external web source.

At the time this guard was introduced, reviewed coverage exists for categories including Scripture, Glossary and Guidance. Deity and Temple currently report zero eligible records. This is intentional evidence of a content-review gap, not a signal to fabricate or automatically promote records.

## Safety consequence

If a user supplies an unknown or non-eligible context record ID, retrieval remains fail-closed: no fabricated citation or substitute reviewed record is created for that ID. Existing Gate A tests also enforce exclusion of source-edition-pending starter records.

This coverage summary is provider-neutral. It does not select a provider, enable production Ask Divya, create an editorial queue, or alter frontend capability claims.

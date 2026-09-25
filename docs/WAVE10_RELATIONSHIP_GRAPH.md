# DivyaNexus Wave 10 — Relationship Graph Contract

## Purpose

The Knowledge Nexus relationship graph makes useful next-step navigation explicit without turning editorial links into invented textual, historical, doctrinal, or causal claims.

## Edge classes

- `study-next`: a recommended continuation into a broader or adjacent learning pathway.
- `context`: contextual navigation that may help a learner inspect a theme from another DivyaNexus surface.
- `concept`: a link to a concept or glossary pathway useful for clarifying terminology.
- `practice`: a non-guaranteed educational or reflective next step.

## Required evidence boundary

Every edge must include a stable id, a valid existing source record, a valid record or approved route target, an English label, a Tamil label, and an explicit rationale. An edge is not evidence that two texts are equivalent, that one historically caused the other, that a temple is directly mentioned by a source, or that a generated explanation is scripture.

## Quality gates

The Wave 10 unit suite rejects dangling record ids, unknown route targets, duplicate edge ids, missing rationale, missing Tamil labels, and undeclared relation types. The Wave 10 static validator also requires the graph surface and its truth-boundary language to remain present.

## Product direction

Future graph expansion should add provenance strength and evidence type before adding scale. Verified source citations should be represented as separate evidence objects rather than being inferred from a navigation edge.

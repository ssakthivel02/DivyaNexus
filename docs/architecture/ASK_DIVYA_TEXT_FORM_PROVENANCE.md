# Ask Divya citation text-form provenance

Issue #4 requires Sanskrit/Tamil text to be preserved accurately and transliteration to be distinguished from translation.

The Ask Divya citation contract therefore models text forms explicitly:

- `transliteration` — a repository field that renders source-language words in another script. It is not a translation.
- `translation` — reserved for a separately reviewed translation tied to source material. Current reviewed Ask Divya records do not provide this field, so current citations must not emit it.
- `educational-meaning` — Tamil or English explanatory meaning from the current reviewed editorial-overview records. It must not be presented as a verified scripture translation.

Current eligible Ask Divya records are reviewed editorial overviews. Their citations may include an explicit transliteration when the underlying record has one, and include Tamil/English educational meanings. They must not imply that those meanings are canonical source text or reviewed translations.

When reviewed canonical source text or a reviewed translation is introduced later, it should be added as a separate typed form with provenance rather than replacing or relabeling the existing educational meaning.

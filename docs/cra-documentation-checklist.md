# CRA documentation checklist

The final tab provides a documentation review checklist based on [Regulation (EU) 2024/2847, Annexes V and VII](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R2847), checked on 15 September 2026.

- **Annex V:** all eight points covering the EU declaration of conformity.
- **Annex VII:** all eight numbered points plus the subclauses of points 1 and 2 (15 checklist items).

The interface uses plain-language summaries in English and German. It preserves conditional requirements, including hardware illustrations, notified-body information and SBOM disclosure following a reasoned market-surveillance request. The last condition does not remove the separate SBOM documentation in Annex VII 2(b).

Tick an item after reviewing its documentation. Each item has an optional comment and an optional reference link, which can be used independently. For conditional requirements, record any non-applicability in the comment. The counters show items reviewed, not a conformity score.

Changes save with the active analysis immediately. Comments and links are shared across display languages. HTTP and HTTPS references can be opened in a new tab; other values remain editable text and are never made into executable links. Clearing a checkmark preserves its comment and link.

The checklist persists through reloads, JSON export/import, analysis copies and version snapshots. Old analyses start with an empty checklist; opening the tab does not alter existing data. Restoring a version without checklist data restores an empty checklist.

Checklist data is stored in `craDocumentationChecklist` with stable clause IDs. Catalogue text is maintained in the app, rather than duplicated into saved analyses. The checklist and its evidence remain excluded from PDF reports.

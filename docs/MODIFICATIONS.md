# Fork modification record

**Modified by Aldo-Kobs, 10–17 September 2026. Notice recorded 17 September 2026.**

This record accompanies the modified TARA Tool under GPL-3.0-or-later. Original work: Copyright (C) 2026 SCHUNK SE & Co. KG. Fork modifications: Copyright (C) 2026 Aldo-Kobs. See [NOTICE.md](../NOTICE.md) for attribution, license and warranty notices and [LICENSE](../LICENSE) for the license terms.

## Comparison basis

- Upstream: <https://github.com/SCHUNK-SE-Co-KG/TARATool>.
- Last upstream commit before this fork's changes: `4bbc354b0be2030daf3acd59a3589dd52207beec`, dated 10 September 2026.
- Fork: <https://github.com/Aldo-Kobs/TARATool>.
- Recorded fork revision: `fac28fc3712350b622e91107448a5452aa405c3d`, dated 17 September 2026, before the licensing documentation update below.

The comparison uses the upstream baseline in this repository's history, not the changing upstream branch tip. The notices and inventory remain available when the source is distributed without Git history.

## Changes in this fork

- Expanded Overview with product and assessment context, images, original/residual risk charts and corresponding PDF content.
- Expanded asset classification and evaluation, including authentication and authorization protection needs, and required explanations for damage ratings.
- Linked risks to individual assets and damage scenarios; added matrix/risk synchronization, archiving and asset-specific impact calculations.
- Added risk lifecycle tracking and revised security-goal links, residual-risk treatments, notes and requirement references.
- Added editable recommended security-level matrices and separate SL-T targets for the seven foundational requirements, with persistence and migration support.
- Added the bilingual CRA documentation checklist and searchable parameter reference with editable guidance and examples.
- Updated PDF reporting, version handling, translations, styling, configuration synchronization, lint configuration and regression tests; added the user guide and supporting documentation.

These summaries describe modifications, not certification against the standards discussed by the tool.

## Dated implementation commits

Merge commits are omitted; implementation commits are listed in history order. Commit subjects are reproduced from this fork.

| Date       | Commit                                                            | Recorded change                                                                                                      |
| ---------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 2026-09-10 | [`e332fb5`](https://github.com/Aldo-Kobs/TARATool/commit/e332fb5) | Fields added to cover IEC 62443 requirements                                                                         |
| 2026-09-10 | [`e524e12`](https://github.com/Aldo-Kobs/TARATool/commit/e524e12) | Inclusion of two pie charts to represent evaluation of risks                                                         |
| 2026-09-11 | [`e6d232d`](https://github.com/Aldo-Kobs/TARATool/commit/e6d232d) | Changes to Assets tab to reflect requirements from MVO                                                               |
| 2026-09-11 | [`ed126b3`](https://github.com/Aldo-Kobs/TARATool/commit/ed126b3) | Visual modifications to Overview page and fixed PDF export                                                           |
| 2026-09-11 | [`ae74943`](https://github.com/Aldo-Kobs/TARATool/commit/ae74943) | Made the commend field in Damage Scenarios mandatory and more visible                                                |
| 2026-09-15 | [`74c3a1d`](https://github.com/Aldo-Kobs/TARATool/commit/74c3a1d) | Changes to the risk calculation and analysis logic                                                                   |
| 2026-09-16 | [`a943d14`](https://github.com/Aldo-Kobs/TARATool/commit/a943d14) | Inclusion of CRA Documentation Checklist Annex V and VII, Parameters Tab to describe all fields and required inputs. |
| 2026-09-16 | [`883fc5f`](https://github.com/Aldo-Kobs/TARATool/commit/883fc5f) | Minor changes to parameter guide                                                                                     |
| 2026-09-17 | [`9ab4098`](https://github.com/Aldo-Kobs/TARATool/commit/9ab4098) | Fixed multiple issues and rework of SL implementation.                                                               |
| 2026-09-17 | [`fac28fc`](https://github.com/Aldo-Kobs/TARATool/commit/fac28fc) | Expansion of explanations and examples for the parameters.                                                           |

## File inventory for the recorded revision

Dates are the first and last non-merge commit dates affecting each path in the comparison above. “Added” means absent from the upstream baseline. The PDF lock file is an editor artifact present in that revision, not application source.

| File                                      | Change   | Modification dates      |
| ----------------------------------------- | -------- | ----------------------- |
| `README.md`                               | Modified | 2026-09-17              |
| `config/assessment_config.js`             | Modified | 2026-09-11 – 2026-09-16 |
| `config/assessment_config.json`           | Modified | 2026-09-11              |
| `config/parameter_guide.js`               | Added    | 2026-09-16 – 2026-09-17 |
| `css/style.css`                           | Modified | 2026-09-10 – 2026-09-17 |
| `docs/.~lock.user-guide.pdf#`             | Added    | 2026-09-17              |
| `docs/cra-documentation-checklist.md`     | Added    | 2026-09-16              |
| `docs/parameters-customization.md`        | Added    | 2026-09-16 – 2026-09-17 |
| `docs/security-level-matrix.md`           | Added    | 2026-09-15 – 2026-09-17 |
| `docs/user-guide.md`                      | Added    | 2026-09-17              |
| `docs/user-guide.pdf`                     | Added    | 2026-09-17              |
| `eslint.config.js`                        | Modified | 2026-09-11 – 2026-09-17 |
| `index.html`                              | Modified | 2026-09-10 – 2026-09-17 |
| `js/attack_tree/attack_tree_calc.js`      | Modified | 2026-09-15              |
| `js/attack_tree/attack_tree_editor_v2.js` | Modified | 2026-09-15 – 2026-09-17 |
| `js/attack_tree/attack_tree_ui.js`        | Modified | 2026-09-15              |
| `js/attack_tree/dot_export.js`            | Modified | 2026-09-15              |
| `js/core/about.js`                        | Modified | 2026-09-17              |
| `js/core/analysis_core.js`                | Modified | 2026-09-10 – 2026-09-16 |
| `js/core/globals.js`                      | Modified | 2026-09-10 – 2026-09-16 |
| `js/core/i18n.js`                         | Modified | 2026-09-10 – 2026-09-17 |
| `js/core/init.js`                         | Modified | 2026-09-10 – 2026-09-15 |
| `js/core/risk_sync.js`                    | Added    | 2026-09-15 – 2026-09-16 |
| `js/core/tab_dispatcher.js`               | Modified | 2026-09-15 – 2026-09-16 |
| `js/core/utils.js`                        | Modified | 2026-09-10 – 2026-09-15 |
| `js/modules/assets.js`                    | Modified | 2026-09-11 – 2026-09-16 |
| `js/modules/cra_documentation.js`         | Added    | 2026-09-16              |
| `js/modules/damage_scenarios.js`          | Modified | 2026-09-15              |
| `js/modules/impact_matrix.js`             | Modified | 2026-09-11 – 2026-09-17 |
| `js/modules/parameters.js`                | Added    | 2026-09-16              |
| `js/modules/risk_analysis.js`             | Modified | 2026-09-15 – 2026-09-17 |
| `js/modules/risk_lifecycle.js`            | Added    | 2026-09-15              |
| `js/modules/security_goals.js`            | Modified | 2026-09-17              |
| `js/modules/security_level_settings.js`   | Added    | 2026-09-15 – 2026-09-17 |
| `js/modules/versioning.js`                | Modified | 2026-09-10 – 2026-09-16 |
| `js/report/report_export.js`              | Modified | 2026-09-11 – 2026-09-17 |
| `js/report/report_i18n.js`                | Modified | 2026-09-11 – 2026-09-17 |
| `js/report/report_pdf_builder.js`         | Modified | 2026-09-11              |
| `js/report/report_pdf_helpers.js`         | Modified | 2026-09-11              |
| `js/residual_risk/residual_risk_data.js`  | Modified | 2026-09-15 – 2026-09-17 |
| `js/residual_risk/residual_risk_ui.js`    | Modified | 2026-09-15 – 2026-09-17 |
| `scripts/sync_assessment_config.py`       | Modified | 2026-09-16              |
| `tests/conftest.py`                       | Modified | 2026-09-11 – 2026-09-16 |
| `tests/fixtures/calc_test_fixture.json`   | Modified | 2026-09-15              |
| `tests/requirements.txt`                  | Modified | 2026-09-11              |
| `tests/test_about.py`                     | Added    | 2026-09-17              |
| `tests/test_asset_evaluation.py`          | Added    | 2026-09-11 – 2026-09-15 |
| `tests/test_asset_risks.py`               | Added    | 2026-09-15              |
| `tests/test_assets.py`                    | Modified | 2026-09-11              |
| `tests/test_backward_compat.py`           | Modified | 2026-09-15              |
| `tests/test_calculations.py`              | Modified | 2026-09-15              |
| `tests/test_config.py`                    | Modified | 2026-09-11              |
| `tests/test_core.py`                      | Modified | 2026-09-15              |
| `tests/test_cra_documentation.py`         | Added    | 2026-09-16              |
| `tests/test_damage_scenarios.py`          | Modified | 2026-09-11              |
| `tests/test_e2e_workflow.py`              | Modified | 2026-09-11              |
| `tests/test_impact_comments.py`           | Added    | 2026-09-11              |
| `tests/test_overview_charts.py`           | Added    | 2026-09-10              |
| `tests/test_overview_details.py`          | Added    | 2026-09-11              |
| `tests/test_overview_images.py`           | Added    | 2026-09-10 – 2026-09-11 |
| `tests/test_overview_pdf.py`              | Added    | 2026-09-11              |
| `tests/test_parameters.py`                | Added    | 2026-09-16 – 2026-09-17 |
| `tests/test_report_versioning.py`         | Modified | 2026-09-11              |
| `tests/test_residual_goals_status.py`     | Added    | 2026-09-15 – 2026-09-17 |
| `tests/test_residual_notes.py`            | Added    | 2026-09-17              |
| `tests/test_residual_requirement_link.py` | Added    | 2026-09-17              |
| `tests/test_risk_damage_impacts.py`       | Added    | 2026-09-16              |
| `tests/test_risk_lifecycle.py`            | Added    | 2026-09-15              |
| `tests/test_security_level_settings.py`   | Added    | 2026-09-15 – 2026-09-17 |

## Licensing documentation update — 17 September 2026

Added this record, `NOTICE.md` and `docs/DISTRIBUTION.md`; updated the README, contribution instructions, changelog, Linux startup instructions and user guide (Markdown and PDF). Preserved upstream credits and the GPL text, added fork attribution and dated notices, and documented redistribution with corresponding source. Corrected the application license in `package.json`, the root entry in `package-lock.json` and the SBOM to GPL-3.0-or-later. Updated the existing About dialog and translations with copyright, warranty, redistribution, license and fork-source notices.

For future modifications, add a dated entry describing the changes and retain the earlier notices.

## User guide review — 17 September 2026

Reviewed `docs/user-guide.md` against revision `fac28fc` and the GPL notice updates. Expanded protection and damage-rating guidance, documented current scoring thresholds and the default recommended SL-T matrix, clarified older-analysis migration and About/SBOM behavior, and recorded the unresolved Parameters loading issue. Regenerated `docs/user-guide.pdf` from the revised Markdown with the license attached. Added `scripts/build_user_guide.py` and `scripts/requirements-docs.txt`, and documented the repeatable build in `scripts/README.md`. Updated the changelog accordingly. Application behavior is unchanged by this documentation review.

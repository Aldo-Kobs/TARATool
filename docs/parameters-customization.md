# Customising Parameters for your company

The **Parameters** tab is the last tab. It is a searchable, read-only reference covering 57 fields and calculated values, from Assets through Residual Risk plus the associated security-level settings. It does not change analysis data and is not an additional PDF report chapter.

## 1. Edit explanations and examples

Edit **[`config/parameter_guide.js`](../config/parameter_guide.js)**.

The file assigns `window.PARAMETER_GUIDE`. Its structure is:

- `sections[]`: reference sections, in display order.
- `sections[].fields[]`: parameter entries, in display order.
- Each entry has a stable `id`, a bilingual `label`, `help`, `values` and `example`, plus a `kind` badge.
- Each bilingual value contains `en` and `de` text. Change both languages as appropriate.
- `kind` is `required`, `optional`, `recommended`, `conditional`, `reference` or `calculated`.
- `valueSource`, where present, tells the renderer to append current application values. Keep it if you want the guide to track the app automatically.
- `phaseExamples`: examples for each lifecycle phase.
- `ui`: headings, search labels and the editing instructions at the bottom of the tab.
- `sources`: references for the security-level summaries.

Example: find the field with `id: 'damage-rating'` and edit `values.en`, `values.de`, `example.en` and `example.de` to define company-specific interpretations of Low, Medium and High. For an asset criterion, find `asset-confidentiality`, `asset-integrity`, `asset-availability`, `asset-authorization` or `asset-authentication`.

Keep explanations consistent with the active settings. Editing the guide changes documentation only; it does not add controls, modify validation or change scores. The illustrative protection levels do not impose universal financial, downtime or injury thresholds. Agree such thresholds for your products and operating context.

Reload the app after saving this file. It is loaded directly as a script, so it also works when opening `index.html` locally without a web server.

## 2. Edit actual scoring values and default scenarios

Edit **[`config/assessment_config.json`](../config/assessment_config.json)**:

| JSON key                                  | What it controls                                                                                                                                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `probabilityCriteria.K`, `.S`, `.T`, `.U` | Feasibility criteria; each `options[]` entry contains the numeric string `value`, German `text` and English `text_en`. Labels also have English counterparts. Risk Analysis and Residual Risk use the same options. |
| `impactScale.validValues`                 | Allowed damage-matrix values.                                                                                                                                                                                       |
| `impactScale.labels`                      | Display names for these values; currently shared between languages.                                                                                                                                                 |
| `impactScale.cssClasses`                  | Mapping to impact colours; matching CSS rules are needed for new classes.                                                                                                                                           |
| `severityLevelFactors`                    | Numeric factor associated with each damage severity. N/A contributes no severity.                                                                                                                                   |
| `protectionLevels.weights`                | Weights used for protection levels I, II and III in impact calculation.                                                                                                                                             |
| `protectionLevels.ranking`                | Ordering for deriving the asset’s highest protection need. Keep the existing I/II/III scheme unless updating the form and calculation code too.                                                                     |
| `riskThresholds`                          | Lower boundaries, German/English class labels and colours. Keep the array sorted by descending `min`. Boundaries are inclusive at the lower end.                                                                    |
| `riskUnknown`                             | Presentation of an unassessed score.                                                                                                                                                                                |
| `defaultDamageScenarios`                  | Built-in IDs, names, short labels and descriptions, including English equivalents. Keep IDs stable for existing analyses.                                                                                           |

After editing the JSON, run this from the repository root:

```sh
python3 scripts/sync_assessment_config.py
```

This regenerates **`config/assessment_config.js`**. Reload the app afterwards. Do not hand-edit that generated file: the generator overwrites it. The app tries the generated JavaScript **before** loading the JSON, including when served over HTTP, so changing the JSON alone can leave the old startup values active.

For a temporary check, use **Overview → Load assessment config** and select your edited JSON. This updates the current browser session and refreshes the Parameters tab. It does not rewrite files or persist a new startup configuration. Regenerate the JavaScript for a lasting change. `taraConfigStatus()` in the browser console reports the loaded source.

Assessment configuration is shared by the running app, rather than stored separately in each analysis. Changing it can change recalculated scores for existing analyses. Per-analysis SL-T targets and the SL matrix are a separate setting, described below.

The current code assumes the existing three protection levels and K/S/T/U factors. Adding categories or changing the score formula requires coordinated code changes; changing labels does not change those rules. Likewise, adding risk-class labels may need updates to translations and residual completion rules that currently recognise the High and Critical classes.

## 3. Exact locations for form choices and behaviour

| Area                                                | File and relevant location                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asset type categories                               | [`js/modules/assets.js`](../js/modules/assets.js): `ASSET_TYPES`, `normalizeAssetType`, `populateAssetTypeOptions`; static fallback options are in [`index.html`](../index.html), `#assetType`.                                                                                                                                                                             |
| Asset type examples in the form                     | [`js/core/i18n.js`](../js/core/i18n.js): `assets.type.option.component`, `.data`, `.function`. The shorter `assets.type.*` labels are used outside the form.                                                                                                                                                                                                                |
| Asset protection controls                           | [`index.html`](../index.html): `#assetForm`; [`js/modules/assets.js`](../js/modules/assets.js): `ASSET_CRITERIA`, `readAssetEvaluation`, `saveAsset`. Availability uses the historical storage key `authenticity`; `authentication` is a separate criterion.                                                                                                                |
| Custom damage-scenario fields                       | [`js/modules/damage_scenarios.js`](../js/modules/damage_scenarios.js): `saveDamageScenario`; [`index.html`](../index.html): `#damageScenarioForm`.                                                                                                                                                                                                                          |
| Matrix ratings and comments                         | [`js/modules/impact_matrix.js`](../js/modules/impact_matrix.js): `renderImpactMatrix`, rating/comment handlers and `validateImpactComments`.                                                                                                                                                                                                                                |
| Risk editor fields                                  | [`js/attack_tree/attack_tree_editor_v2.js`](../js/attack_tree/attack_tree_editor_v2.js): `renderNode`, `renderImpact`, `computeAndUpdateSummaries`, `getEntryData`; [`index.html`](../index.html): `#attackTreeForm`.                                                                                                                                                       |
| Asset/scenario assignment and source impact preview | [`js/core/risk_sync.js`](../js/core/risk_sync.js): `getRiskAsset`, `getAssetDamageImpacts`, `getRiskDamageImpacts`.                                                                                                                                                                                                                                                         |
| Lifecycle phases                                    | [`js/modules/risk_lifecycle.js`](../js/modules/risk_lifecycle.js): `RISK_LIFECYCLE_PHASES`. Display names are `lifecycle.phase.*` in `js/core/i18n.js`; examples are `phaseExamples` in `config/parameter_guide.js`.                                                                                                                                                        |
| Security-goal fields and risk links                 | [`js/modules/security_goals.js`](../js/modules/security_goals.js); [`index.html`](../index.html): `#securityGoalForm`.                                                                                                                                                                                                                                                      |
| Residual treatments and completion                  | [`js/residual_risk/residual_risk_ui.js`](../js/residual_risk/residual_risk_ui.js): treatment options, `rrLeafComplete`, `rrRenderTreeCard`. Stored values are `Akzeptiert`, `Delegiert`, `Mitigiert`; displayed names are `rr.treat.*` in `js/core/i18n.js`.                                                                                                                |
| Residual calculation                                | [`js/residual_risk/residual_risk_data.js`](../js/residual_risk/residual_risk_data.js): `computeResidualTreeMetrics`. Only Mitigated leaves use reassessed factors; missing reassessed factors fall back to original values.                                                                                                                                                 |
| SL-T targets and SL matrix                          | **Settings** in the app saves these per analysis. Defaults, validation and calculation are in [`js/modules/security_level_settings.js`](../js/modules/security_level_settings.js): `SECURITY_LEVEL_REQUIREMENTS`, `defaultSecurityLevelMatrix`, `defaultSecurityLevelSettings`, `validSecurityLevelMatrix`, `securityLevelForRisk`. Labels are `sl.*` in `js/core/i18n.js`. |
| Score and inheritance formulas                      | [`js/core/utils.js`](../js/core/utils.js): `computeRiskScore`, `getRiskMeta`; [`js/attack_tree/attack_tree_calc.js`](../js/attack_tree/attack_tree_calc.js): `computeLeafImpactNorm`, `applyImpactInheritance`, `_kstuWorstCase`.                                                                                                                                           |
| Parameters tab renderer                             | [`js/modules/parameters.js`](../js/modules/parameters.js): `currentValues` maps each `valueSource` to the live app configuration; `renderParameters` builds and filters the reference.                                                                                                                                                                                      |
| Parameters tab layout and navigation                | [`css/style.css`](../css/style.css): `/* Parameters reference */`; [`index.html`](../index.html): `tabParameters`, `parametersContainer`; [`js/core/tab_dispatcher.js`](../js/core/tab_dispatcher.js): `tabParameters` dispatch.                                                                                                                                            |

The renderer reads active values for asset types, protection weights, impact factors, scenario descriptions, K/S/T/U choices, lifecycle phases, treatments, risk thresholds and the active analysis’s security-level boundaries and targets. Explanatory prose and examples come from `config/parameter_guide.js`.

## 4. Suggested adaptation workflow

1. Define the product and operating context, what each protection level means, and measurable severity boundaries for your company.
2. Edit the guide’s explanations and examples in both languages.
3. If numerical choices must change, edit `assessment_config.json`, regenerate the JavaScript, and reload the app.
4. Review all affected field choices and the displayed Parameters values. Use a known example analysis to verify the resulting scores and risk classes.
5. Set the analysis-specific seven SL-T targets and residual SL-C planning matrix through Settings.

The security-level summaries refer to the [ISA/ISASecure guide, printed page 7](https://programs.isa.org/hubfs/06%20-%20ASCI/0920-ISASecure-Certifications-Guide-FINAL.pdf#page=8) and [IEC 62443-4-2’s foundational requirements](https://webstore.iec.ch/en/publication/34421). The app’s matrix output remains a planning estimate; it does not demonstrate capability against the standard’s requirements.

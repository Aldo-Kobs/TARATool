# TARA Tool — Risk Calculation Reference

**A detailed explanation for assessors, reviewers and users presenting the results**  
Edition: 2 October 2026 · Language: English

This reference describes the calculations implemented in the current TARA Tool workspace, including shared risks, individual asset assignment removal, and the grouped pen/trash controls. It was reviewed against base revision `94746fc` **plus the local modifications present on this date**. It describes the implemented model; it does not establish that a particular assessment has sufficient evidence.

All numerical tables below use the shipped assessment configuration, version **1.0**, last modified **19 February 2026**, and the default security-level matrix. A company configuration or a saved custom matrix can change these values. Section 14 explains how to reproduce an assessment with its configuration.

Original application: Copyright (C) 2026 SCHUNK SE & Co. KG. Fork modifications and this reference: Copyright (C) 2026 Aldo-Kobs. Distributed under GPL-3.0-or-later. See [NOTICE](../NOTICE.md), [LICENSE](../LICENSE), and [modification record](MODIFICATIONS.md). The PDF includes the license as an attachment.

## Contents

1. [The calculation in one page](#1-the-calculation-in-one-page)
2. [Terms, symbols and assessment objects](#2-terms-symbols-and-assessment-objects)
3. [Assets and protection need](#3-assets-and-protection-need)
4. [Damage scenarios and matrix ratings](#4-damage-scenarios-and-matrix-ratings)
5. [Attack feasibility: K, S, T and U](#5-attack-feasibility-k-s-t-and-u)
6. [Calculating an impact leaf](#6-calculating-an-impact-leaf)
7. [How the attack tree aggregates results](#7-how-the-attack-tree-aggregates-results)
8. [One risk assigned to several assets](#8-one-risk-assigned-to-several-assets)
9. [Risk classes, rounding and missing data](#9-risk-classes-rounding-and-missing-data)
10. [Residual risk and treatment fields](#10-residual-risk-and-treatment-fields)
11. [Recommended security levels and required targets](#11-recommended-security-levels-and-required-targets)
12. [Fields that document the assessment](#12-fields-that-document-the-assessment)
13. [Reading results, counts and reports](#13-reading-results-counts-and-reports)
14. [Configuration, changes and reproducibility](#14-configuration-changes-and-reproducibility)
15. [Worked examples](#15-worked-examples)
16. [Review worksheet and frequently asked questions](#16-review-worksheet-and-frequently-asked-questions)
17. [Technical appendix and source map](#17-technical-appendix-and-source-map)

## 1. The calculation in one page

The central formula is:

```text
Attack feasibility A = K + S + T + U
Risk score         R = I_norm × A
```

`I_norm` is the normalized impact. For an impact leaf, the tool obtains it from the damage ratings of the assets assigned to that risk:

```text
For every assigned asset and every scenario linked to the leaf:
    weighted impact = scenario severity factor × asset protection weight

Leaf I_norm = highest applicable weighted impact
```

Each attack path is assessed using its own impact and K/S/T/U. Alternative paths are combined using normalized statistical OR: `R = M × [1 − ∏(1 − Rpath/M)]`, where M is the maximum configured score (2.20 by default). This assumes independent paths. Inherited impact and K/S/T/U remain maximum-value summaries; multiplying those summaries does not reproduce the combined score.

| Stage                         | User supplies                                   | Tool derives                                                    |
| ----------------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| Assets                        | Five protection-need ratings                    | Highest protection level and its numerical weight               |
| Damage scenarios              | A rating for each relevant asset/scenario pair  | Severity factor for that pair                                   |
| Risk assignment               | One or more assigned assets                     | Which asset matrix rows participate                             |
| Impact leaf                   | Linked scenarios and K/S/T/U values             | Normalized impact and leaf risk score                           |
| Attack paths and root         | Tree structure                                  | Independent path scores combined with normalized statistical OR |
| Classification                | Configured thresholds                           | Low, Medium, High or Critical                                   |
| Residual assessment           | Treatment and, where mitigated, revised K/S/T/U | Residual score with original impact retained                    |
| Security-level recommendation | Configured bands and 4 × 4 matrix               | Recommended SL-T from original root feasibility and impact      |

**Interpretation:** the score is a dimensionless prioritization value. The implementation does not convert it into an annual probability, percentage chance, expected monetary loss or financial exposure. Although some internal names use “probability” and the overview shows a `P` vector, the arithmetic uses the sum of four assessment factors. For example, `R = 1.60` does not mean a 160% probability.

There are several separate judgments: the numerical score, its risk class, the recommended SL-T, the seven user-defined SL-T targets, and whether the assessment has been reviewed. They answer different questions and do not replace one another.

## 2. Terms, symbols and assessment objects

| Term or symbol            | Meaning in this application                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Asset                     | A component, data item or function being assessed. Identified by a display ID such as A01 and a stable internal identity.                  |
| Damage scenario           | A consequence such as operational disruption or financial damage. Identified by DS1, DS2, etc.                                             |
| Impact matrix             | The table of damage ratings, with assets as rows and scenarios as columns.                                                                 |
| Risk / attack tree        | One saved assessment with a root attack goal, paths and impact leaves. Identified by R01, R02, etc.                                        |
| Root / attack goal        | The attacker's intended outcome; its displayed score summarizes the tree.                                                                  |
| Attack path               | A branch describing how the goal could be reached. It may contain intermediate paths and impact leaves.                                    |
| Impact leaf / impact step | A scored assessment entry carrying scenario links and K/S/T/U. The written description alone has no numerical effect.                      |
| Protection weight G(a)    | The weight of asset a's overall protection level.                                                                                          |
| Severity factor F(a,d)    | The configured numerical factor for asset a's matrix rating in scenario d.                                                                 |
| I_norm, I(N), I[norm]     | Equivalent labels for normalized impact.                                                                                                   |
| K/S/T/U                   | Complexity/knowledge, scaling, time/effort, and attacker utility.                                                                          |
| A                         | The sum K + S + T + U used as attack feasibility, including in the SL recommendation.                                                      |
| P vector                  | The displayed four values K / S / T / U. It is not an additional input or multiplier.                                                      |
| R                         | Original risk score.                                                                                                                       |
| R_res                     | Residual risk score after applying the selected treatments.                                                                                |
| SL-T                      | A security target level. The interface distinguishes the recommended level for a risk from the seven required targets entered in Settings. |
| Unassessed / unknown      | A required numerical result cannot be established. It must not be interpreted as zero risk.                                                |

A single tree may contain several paths, and an asset may have several risks. A shared risk retains one tree and one saved aggregate score; the UI also derives a separate score for each assigned asset. Assignment count does not multiply that score.

## 3. Assets and protection need

### 3.1 What every asset field contributes

| Field                   | Meaning and assessment question                                                  | Effect on calculation                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ID                      | Reference such as A01.                                                           | Selects a matrix row in the displayed data; its number has no weight. Stable identities preserve links when IDs are renumbered. |
| Name                    | Recognizable asset name.                                                         | Descriptive only.                                                                                                               |
| Type                    | Component, Data or Function.                                                     | Descriptive only; no type-specific multiplier.                                                                                  |
| Description             | Scope, interfaces, responsibilities and relevant characteristics.                | Evidence and context for the selected ratings; no automatic text analysis.                                                      |
| Confidentiality         | How strongly must information be protected against unauthorized disclosure?      | Participates in the maximum protection level.                                                                                   |
| Integrity               | How strongly must data or behavior be protected against unauthorized alteration? | Participates in the maximum protection level.                                                                                   |
| Availability            | How strongly must the asset's function or data remain available?                 | Participates in the maximum protection level.                                                                                   |
| Authorization           | How strongly must permitted actions and access rights be controlled?             | Participates in the maximum protection level.                                                                                   |
| Authentication          | How strongly must the identity of a user, service or device be established?      | Participates in the maximum protection level.                                                                                   |
| Overall protection need | Derived highest level among the five criteria.                                   | Determines the asset weight used for every linked scenario.                                                                     |

The numerical model defines an ordered scale I < II < III. Assessors should use the organization's agreed interpretation and evidence for selecting those levels; the code does not infer a level from the description or enforce monetary, outage-duration or safety thresholds.

### 3.2 Overall protection level and weight

```text
Overall asset level = maximum of the five selected protection levels
Asset weight        = configured weight for that overall level
```

| Overall level | Default rank | Default weight |
| ------------- | -----------: | -------------: |
| I             |            1 |           0.60 |
| II            |            2 |           0.80 |
| III           |            3 |           1.00 |

Example: confidentiality I, integrity III, availability II, authorization I and authentication N/A produce overall level III and weight 1.00.

The five criteria are **not added or averaged**. One level III criterion gives the same overall weight as five level III criteria. Changing another criterion from I to II has no numerical effect while a level III criterion still sets the maximum.

The resulting weight applies to all selected damage scenarios for that asset. There is no automatic matching of confidentiality only to privacy damage, or availability only to operational damage.

### 3.3 N/A and incomplete protection ratings

The asset form allows N/A for Authorization and Authentication. N/A does not increase the maximum. Missing criteria also contribute no rank when the overall level is derived.

If no valid overall level is stored, the impact calculation falls back to the configured **level I weight**, normally 0.60. Therefore, a numerical risk result does not prove that the asset evaluation is complete. Review the five criteria explicitly.

Technical readers should note that the historical storage key `authenticity` represents **Availability** in the current interface. Authentication is stored separately as `authentication`.

## 4. Damage scenarios and matrix ratings

### 4.1 Scenario fields

| Field                   | Meaning                                                  | Effect                                                              |
| ----------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- |
| Scenario ID             | Stable reference used by the matrix and leaf selections. | Determines which matrix cells a leaf reads.                         |
| Name                    | Description of the kind of consequence.                  | No multiplier.                                                      |
| Short name              | Compact label in selectors and reports.                  | No multiplier.                                                      |
| Description             | Defines the consequence and supports consistent rating.  | No numerical effect by itself.                                      |
| Rating for an asset     | Severity of that scenario for that particular asset.     | Converted to a severity factor.                                     |
| Justification / comment | Rationale and evidence for the selected matrix rating.   | Does not alter the number; supports review and report completeness. |

The shipped scenarios are:

| ID  | Scenario                | What it describes                                                   |
| --- | ----------------------- | ------------------------------------------------------------------- |
| DS1 | Danger to life and limb | Injury or life-threatening consequences.                            |
| DS2 | Financial damage        | Direct or indirect financial loss.                                  |
| DS3 | Operation damage        | Loss of component operation.                                        |
| DS4 | Loss of privacy/data    | Loss of sensitive personal or technical information.                |
| DS5 | Legal consequences      | Consequences associated with violations of applicable requirements. |

These names describe categories in the application. They do not create different mathematical coefficients: every scenario uses the same severity mapping unless configuration changes it. Custom scenarios participate through their IDs and ratings in the same way.

### 4.2 Matrix severity mapping

| Selected rating | Label          |             Numerical factor used |
| --------------- | -------------- | --------------------------------: |
| N/A             | Not applicable | No positive severity contribution |
| 1               | Low            |                              0.30 |
| 2               | Medium         |                              0.60 |
| 3               | High           |                              1.00 |

The integers 1, 2 and 3 are category codes. The tool multiplies by **0.30, 0.60 or 1.00**, not by 1, 2 or 3. The Low/Medium/High labels here describe damage severity, not the final risk class.

Each cell is specific to one asset and one scenario. A High DS3 rating on A02 does not affect a risk assigned only to A01. Even for an assigned asset, DS3 has no effect on a leaf that selects only DS1.

### 4.3 N/A is not a scored zero

A leaf uses only asset/scenario pairs with a positive configured severity factor. If every relevant pair is N/A, absent or otherwise has no positive factor, `I_norm` is empty and the leaf is unassessed.

If at least one relevant pair has a positive factor, the leaf uses the highest weighted impact among those pairs. Other N/A or missing pairs do not block that result. Consequently, a shared risk can have a numerical impact even when one of its assets has no applicable rating for that scenario.

The configuration also contains a factor for code `0`, but the standard matrix choices exclude it. A zero severity factor does not establish an assessed zero in the current calculation.

Comments are required by the matrix/report workflow and should explain the rating, including N/A. They are not operands in the formula. Missing justification can affect completeness or report generation without changing an already calculable score.

## 5. Attack feasibility: K, S, T and U

Select the four factors for **each impact leaf**. Parent values are calculated automatically. All factors enter the formula with coefficient 1:

```text
A = K + S + T + U
```

A larger numerical value increases attack feasibility and, for a fixed positive impact, increases risk. A factor value such as 0.7 is not a measured probability.

### 5.1 K — Complexity / knowledge

| Value | Shipped choice                            | Meaning for assessment                                |
| ----: | ----------------------------------------- | ----------------------------------------------------- |
|   0.7 | Known vulnerabilities, e.g. CVE or errata | Attack knowledge is already published or established. |
|   0.6 | Simple internet research                  | Basic public research is sufficient.                  |
|   0.3 | Expert research                           | Specialized research is needed.                       |
|   0.1 | Expert knowledge                          | Substantial specialist knowledge is required.         |

The scale decreases as the required expertise increases. Entering a vulnerability identifier in notes does not automatically select 0.7; the assessor makes the selection.

### 5.2 S — Scaling

| Value | Shipped choice     | Meaning for assessment                                           |
| ----: | ------------------ | ---------------------------------------------------------------- |
|   0.5 | Complete portfolio | The attack can be repeated across the entire product portfolio.  |
|   0.3 | Product series     | The attack can be repeated across devices in one product series. |
|   0.1 | Single device      | The attack is limited to one device.                             |

S is a categorical judgment. The tool does not count devices, assets, installations or network nodes. Assigning a risk to an additional asset does not automatically change S. Review S when the scenario's scope changes.

### 5.3 T — Time / effort

| Value | Shipped choice     |
| ----: | ------------------ |
|   0.5 | Less than 1 week   |
|   0.4 | Less than 4 weeks  |
|   0.2 | Less than 3 months |
|   0.1 | More than 3 months |

Shorter effort gives a higher numerical factor. These are manually selected categories; the tool does not measure elapsed time.

The displayed descriptions overlap: less than 1 week is also less than 4 weeks. Use the most specific applicable category and document the interpretation. Exactly 3 months is not explicitly assigned by the shipped labels. Organizations should agree how to handle boundaries; the software does not resolve them automatically.

### 5.4 U — Visible benefit for the attacker

| Value | Shipped choice |
| ----: | -------------- |
|   0.5 | High           |
|   0.3 | Medium         |
|   0.1 | Low            |

Assess the benefit or incentive available to the attacker in the stated scenario. This is different from the damage to the asset owner. The tool does not derive U from financial damage, asset value or narrative text.

### 5.5 Feasibility range and sensitivity

For complete leaves using only shipped options:

```text
Minimum A = 0.1 + 0.1 + 0.1 + 0.1 = 0.4
Maximum A = 0.7 + 0.5 + 0.5 + 0.5 = 2.2
```

Before rounding, increasing any one factor by 0.1 changes a leaf's score by `0.1 × I_norm`. Within a path, changing a factor matters when it changes that path’s controlling maximum. A change to a path score feeds into the root OR result, unless another path already reaches the configured ceiling.

## 6. Calculating an impact leaf

For a leaf l, let `Assets(r)` be the assets assigned to its risk and `Scenarios(l)` the selected damage scenarios.

```text
Candidate(a,d) = G(a) × F(a,d)
I_norm(l)      = round2(max Candidate(a,d))
                for assigned assets a and selected scenarios d
                whose severity factor is positive

A(l)          = K(l) + S(l) + T(l) + U(l)
R(l)          = round2(I_norm(l) × A(l))
```

If there is no applicable candidate, the impact is unassessed. If impact or any feasibility factor is missing, the leaf score is unassessed. `round2` describes the application's JavaScript two-decimal formatting; section 9 explains its consequences.

### 6.1 Complete default weighted-impact table

| Scenario severity | Factor | Asset I: weight 0.60 | Asset II: weight 0.80 | Asset III: weight 1.00 |
| ----------------- | -----: | -------------------: | --------------------: | ---------------------: |
| Low               |   0.30 |                 0.18 |                  0.24 |                   0.30 |
| Medium            |   0.60 |                 0.36 |                  0.48 |                   0.60 |
| High              |   1.00 |                 0.60 |                  0.80 |                   1.00 |

The minimum positive default leaf impact is 0.18, and the maximum is 1.00. Combining these with the factor ranges gives complete default scores from raw 0.072 to 2.20, displayed as 0.07 to 2.20. Leaf scores keep this scale. Alternative path scores are normalized by the configured maximum for statistical OR, then converted back to the same score scale. These normalized scores are a modeling convention, not measured event probabilities.

### 6.2 Selecting multiple scenarios

Suppose an asset has level II and a leaf selects DS1 rated Low and DS3 rated High. The candidates are 0.80 × 0.30 = 0.24 and 0.80 × 1.00 = 0.80. The leaf impact is **0.80**. It is neither 1.04 (the sum) nor 0.52 (the mean).

The impact preview shows the original matrix ratings. A displayed `3 (High)` is the source rating. The calculated `I(N) = 0.80` already includes the asset weight. These values serve different purposes.

## 7. How the attack tree aggregates results

### 7.1 Calculate each path separately

Direct impact leaves attached to the same path retain their existing worst-case assessment: maximum impact multiplied by the sum of the maximum K, S, T and U among those direct leaves. All direct leaves must have complete inputs. Values from a different path do not participate in that calculation.

### 7.2 Combine alternative paths with statistical OR

```text
M = maximum configured impact × sum of the maximum configured K/S/T/U
Default M = 1.00 × (0.7 + 0.5 + 0.5 + 0.5) = 2.20
R(parent) = M × [1 − product over child paths of (1 − R(path)/M)]
```

The formula assumes independent alternative paths. It applies recursively to parallel intermediate paths. A node with direct impacts and child paths contributes its direct-impact assessment as one alternative alongside its children. A single child passes its score through unchanged. Full precision is retained between tree levels; displayed results are rounded to two decimals.

For path scores 0.60 and 1.60, the combined result is 1.763636…, displayed as **1.76**. Impact and K/S/T/U summaries still show maxima for context and for the separate security-level recommendation. They do not define the combined R.

### 7.3 Interpretation and structure

Normalization preserves the existing risk scale and classification thresholds. It does not establish observed probabilities or annual attack frequencies. Correlated paths and shared prerequisites need assessment review because independence may overstate their combined contribution. No AND gate or sequential probability multiplication is implemented.

Adding an independent alternative can increase the combined score. Duplicating a path also increases it, so duplicate descriptions of the same event should not be entered as independent alternatives. Duplicating a direct impact leaf within one path does not change that path’s maxima. Reordering paths or adding a linear intermediate wrapper does not change the result.

### 7.4 Missing assessments

An empty path, an unassessed impact leaf, or a score outside the configured normalization range makes the combined score unassessed. Inputs from another path cannot fill its missing values. A complete numerical result still does not prove that all asset criteria, scenario coverage, evidence or treatment details are complete.

## 8. One risk assigned to several assets

### 8.1 Shared assignment semantics

Each impact leaf considers **all assigned assets × all scenarios selected on that leaf**. The highest weighted impact in that set controls the leaf.

The risk has one shared root name, attack tree, K/S/T/U assessment, notes, lifecycle selections, security-goal relationships and residual assessment. Editing it through any asset's pen icon edits that same risk. The application calculates an individual score for each assigned asset by running the same tree calculation using only that asset’s protection weight and damage matrix row. These display results are derived without changing the saved shared score or assignments. Treatment remains shared.

Use a shared risk when those common assessment assumptions are appropriate for all assigned assets. If different assets need different feasibility values, scenario selections or treatments, represent those differences explicitly in the assessment, potentially as separate risks. The current shared assignment model has no per-asset overrides for a leaf.

### 8.2 Assignment controls and numerical consequences

| Action                              | Data effect                                                                          | Calculation effect                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Assign existing risk                | Adds a link to the same risk. Already assigned risks are excluded from the selector. | Adds that asset's relevant matrix cells to every leaf's candidates.                       |
| Pen icon in a risk block            | Opens the shared editor with that asset’s assessment preview.                        | Saved edits affect all its assignments.                                                   |
| Trash icon in an asset's risk block | Removes that particular assignment.                                                  | Removes that asset's candidates and recalculates the risk and residual data.              |
| Remove final assignment             | Keeps the original risk available in Saved attack trees and Existing risk selectors. | No assigned asset remains, so impact and risk score become unassessed.                    |
| Delete the saved attack tree        | Deletes the risk itself.                                                             | Removes the risk from every asset's coverage and the active residual-risk list.           |
| Delete an asset                     | Removes that asset and its matrix data. Shared risks keep remaining assignments.     | Recalculates from the remaining assets; risks with no valid assignment remain unassessed. |

For fixed factors and valid nonnegative parameters, adding an asset cannot decrease the maximum impact. Removing an asset cannot increase it, though removing the last applicable contribution makes the result unassessed. Adding a lower-impact asset can leave the number unchanged.

Stable asset identities prevent a deleted A01's risk from silently moving to another asset when display IDs are renumbered. A detached risk can later be reassigned without creating a new risk identity.

### 8.3 Shared risk does not imply aggregate business loss

The tool takes the highest weighted consequence. It does not total simultaneous losses across assets or count repeated exposure. If a combined multi-asset consequence is relevant, explain it in the scenario definition and justify the chosen ratings; assigning several assets alone does not model that total.

## 9. Risk classes, rounding and missing data

### 9.1 Default risk classes

Saved root scores and residual root scores are classified by the first matching threshold, tested in descending order.

| Class    | Score interval                                 | Default color |
| -------- | ---------------------------------------------- | ------------- |
| Critical | R ≥ 2.00                                       | Red           |
| High     | 1.60 ≤ R < 2.00                                | Orange        |
| Medium   | 0.80 ≤ R < 1.60                                | Yellow        |
| Low      | 0.00 ≤ R < 0.80                                | Green         |
| Unknown  | Score is missing or cannot be read as a number | Grey          |

A score exactly at a risk threshold belongs to the higher class: 0.80 is Medium, 1.60 is High, and 2.00 is Critical. Risk class is a categorization, not an automatic decision to accept or mitigate. Selecting a treatment remains a user decision.

### 9.2 Calculation precision

1. Scenario severity and asset weight are multiplied using JavaScript numbers.
2. The maximum leaf impact is formatted to two decimals and stored as a string, such as `"0.48"`.
3. Parent impacts retain two-decimal values through maximum aggregation.
4. K/S/T/U values are parsed numerically; their sums are not deliberately rounded before the risk multiplication.
5. Path OR aggregation retains full precision between levels. An assessed risk result is formatted to two decimals with JavaScript `toFixed(2)`.
6. Saved-root and residual-root badges use that formatted value for classification.
7. Security-level banding separately rounds its root feasibility and impact to ten decimals before comparing boundaries.

The two-decimal impact step matters with custom coefficients. If a raw weighted impact is 0.244, the risk calculation uses 0.24. A spreadsheet that retains 0.244 until the end can produce a different result.

JavaScript uses binary floating-point arithmetic. Exact decimal halfway cases and sums near thresholds should be reproduced with the actual application, especially after customization.

### 9.3 Current display limitations near thresholds

Node summaries and saved badges classify their rounded two-decimal result. This keeps a displayed 1.60 in the High class in both places.

Some overview background colors and chart colors also use fixed default thresholds or class names. With custom configuration, use the numerical result and configured badge thresholds rather than background shading as the basis for interpretation. These limitations are documented here; this guide does not modify the calculation code.

### 9.4 Different kinds of incompleteness

| Situation                                     | Numerical behavior                                          | Review implication                                                    |
| --------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| No valid assigned asset                       | Impact and score become empty.                              | Assign an asset before treating the risk as scored.                   |
| No scenarios selected on a leaf               | That leaf's impact and score are empty.                     | Define the consequence links.                                         |
| All relevant matrix cells N/A or missing      | No positive severity contribution; impact is empty.         | Check applicability and completeness.                                 |
| One relevant cell rated, another missing      | Highest available weighted impact can still be calculated.  | Numeric impact does not prove all asset/scenario pairs were assessed. |
| One leaf factor missing                       | Leaf score is empty.                                        | Complete that leaf.                                                   |
| Different leaves supply all root dimensions   | Root score remains unassessed.                              | Inspect each leaf; SL recommendation remains incomplete.              |
| Asset protection need unset                   | Weight falls back to level I.                               | Complete the protection evaluation even if R is numeric.              |
| Residual treatment or reassessment incomplete | Root may still show a residual score using original values. | Use the completeness indicator and review the treatment fields.       |
| Evaluated checked                             | No numerical change.                                        | This is a manual review declaration.                                  |

A dash, an empty result and “Unknown” should not be read as Low. Conversely, a low score does not establish adequate completeness, evidence or treatment.

## 10. Residual risk and treatment fields

### 10.1 Calculation rule

Residual assessment operates on the same tree and retains the original normalized impact. For each leaf and each factor independently:

```text
If treatment is Mitigated and a nonblank reassessed value exists:
    effective factor = reassessed factor
Otherwise:
    effective factor = original factor

Residual path score = original path impact × sum of effective path factors
R_res = round2(M × [1 − product over paths of (1 − residual path score / M)])
Residual root K/S/T/U and impact remain maximum-value summaries
```

This recalculates the root after treatment. It does not subtract a mitigation percentage or subtract the sum of leaf reductions from the original score.

### 10.2 Treatment choices

| Treatment | Factors used in residual root                                           | What the user should document                                                    |
| --------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Blank     | Original factors                                                        | Treatment decision still outstanding.                                            |
| Accepted  | Original factors                                                        | Rationale for accepting the risk.                                                |
| Delegated | Original factors                                                        | Responsible party, transferred responsibility and supporting arrangement.        |
| Mitigated | Nonblank reassessed factors replace the corresponding original factors. | Detailed control measure and all four revised factors with supporting reasoning. |

Accepted and Delegated do not numerically reduce the score. Mitigated also does not lower it automatically: values only change when the revised factors differ. The application does not enforce that a reassessed factor is less than or equal to its original value. A higher revised factor can increase the residual score.

### 10.3 Every residual field

| Field                                       | Role                                                                        | Numerical or completeness effect                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Treatment                                   | Accepted, Delegated or Mitigated.                                           | Controls whether reassessed factors are used. Required by the completion check.       |
| Reassessed K                                | Complexity/knowledge after the measure.                                     | Substitutes K only for Mitigated.                                                     |
| Reassessed S                                | Scaling after the measure.                                                  | Substitutes S only for Mitigated.                                                     |
| Reassessed T                                | Time/effort after the measure.                                              | Substitutes T only for Mitigated.                                                     |
| Reassessed U                                | Attacker benefit after the measure.                                         | Substitutes U only for Mitigated.                                                     |
| Detailed control measure / security concept | Description of the implemented or planned measure.                          | Required for a mitigated leaf's completion; text itself does not reduce the score.    |
| Link to requirement                         | Traceable reference to a requirement or control.                            | No numerical effect; not required by the current leaf completion check.               |
| Notes                                       | Shared explanation for the residual risk, shown in the editor and overview. | Supports acceptance/delegation and the High/Critical note requirement; no multiplier. |
| Security goals                              | Links to objectives associated with the risk.                               | Traceability only; selecting a goal does not change R_res.                            |
| Evaluated checkbox                          | User's review state.                                                        | No effect on score, treatment or completeness calculation.                            |
| Original I(N) and K/S/T/U                   | Reference values from Risk Analysis.                                        | Used as the baseline and, where applicable, fallback.                                 |
| Residual K/S/T/U and score                  | Derived summary.                                                            | Effective values after treatment and aggregation.                                     |

The editor and overview share one bilingual residual Notes value per risk. Compatibility copies on leaves do not represent independent numerical inputs. Older differing leaf notes are combined during synchronization.

### 10.4 Completeness rules versus numerical fallback

For a leaf to be marked complete:

- Accepted or Delegated requires a nonempty note.
- Mitigated requires a nonempty control-measure description and all four reassessed factor selections.
- A blank or unknown treatment is incomplete.

For the tree completion indicator, there must be at least one leaf and every leaf must be complete. A High or Critical residual result also requires a whole-risk note. Under the default class labels, the application recognizes these as `Hoch` and `Kritisch` internally.

The **Evaluated** checkbox is independent and remains a manual decision; it can be checked while required fields are still incomplete. Changes to the original assessment preserve that checkbox, so a recalculated risk can still display a previous review decision. Re-review after material changes.

For partially entered mitigation, the residual root calculation falls back to the original value separately for each missing factor. The mitigation leaf's own residual preview requires all reassessed factors and may show a dash while the root still shows a number. That difference reflects incomplete reassessment, not a successful zero-risk treatment.

The current completeness checks focus on treatment fields and notes. They do not independently prove that the original tree, asset ratings and evidence are complete.

### 10.5 Why mitigation may leave the root unchanged

A measure can lower a leaf’s K while another direct leaf still sets the same maximum within that path. To explain the residual root, calculate each treated path separately and combine those path scores with OR. Reducing a path score normally reduces the combined result unless another path already reaches the ceiling.

The impact remains the original impact even if the measure is intended to reduce consequences. The current residual editor has no separate residual impact input. Any change to asset protection ratings or the original damage matrix changes the baseline assessment and can change both original and residual results; it is not a residual-only consequence reduction.

Shared risks also share treatment and reassessed factors across assets. Removing an assignment recalculates the baseline impact while retaining the risk identity and existing residual treatment data.

## 11. Recommended security levels and required targets

### 11.1 Recommended SL-T: a separate two-dimensional lookup

The application uses the original root values:

```text
A = K_root + S_root + T_root + U_root
I = original root I_norm

row    = feasibility band containing A
column = impact band containing I
Recommended SL-T = configured matrix[row][column]
```

It does not classify the single product R to obtain SL-T. Two risks with the same score can have different recommendations if their feasibility and impact fall into different bands. Residual mitigation does not change this original-risk recommendation.

### 11.2 Default boundaries

| Band      | Feasibility A | Normalized impact I |
| --------- | ------------- | ------------------- |
| Low       | 0 ≤ A ≤ 0.8   | 0 ≤ I ≤ 0.3         |
| Medium    | 0.8 < A ≤ 1.4 | 0.3 < I ≤ 0.6       |
| High      | 1.4 < A ≤ 1.8 | 0.6 < I ≤ 0.8       |
| Very high | A > 1.8       | I > 0.8             |

For SL bands, a boundary value belongs to the **lower** band. For example, A = 0.8 is Low and I = 0.8 is High. This differs from risk-class threshold behavior, where the minimum threshold belongs to the higher class.

### 11.3 Default recommendation matrix

| Feasibility / Impact | Low | Medium | High | Very high |
| -------------------- | --: | -----: | ---: | --------: |
| Low                  |   0 |      0 |    1 |         2 |
| Medium               |   0 |      1 |    2 |         3 |
| High                 |   1 |      2 |    3 |         4 |
| Very high            |   2 |      3 |    4 |         4 |

A stored matrix value 0 produces **SL-T 0**, which is different from a blank setting or missing assessment.

The matrix is editable per analysis. Each axis needs exactly three positive, strictly increasing finite boundaries. Every matrix cell must be an integer from 0 to 4 for a recommendation to be available. An incomplete matrix can be saved alongside targets, but recommendation output reads “Configure matrix in Settings.” Existing custom matrices take precedence over defaults.

### 11.4 Assessment completeness for a recommendation

A recommendation requires:

1. A valid complete matrix.
2. At least one valid assigned asset.
3. At least one impact leaf.
4. A nonblank, finite, nonnegative impact and K/S/T/U on **every** leaf.
5. Complete finite nonnegative root impact and K/S/T/U.

Failure of the assessment requirements produces “Assessment incomplete.” This is stricter than obtaining a numerical root score. It still does not check every underlying matrix cell, narrative justification or empty structural branch.

### 11.5 The seven required SL-T fields

These are manually selected targets for the active analysis:

| Field     | Name displayed in the tool                | Role in calculation                        |
| --------- | ----------------------------------------- | ------------------------------------------ |
| FR1 / IAC | Identification and authentication control | Required target; no R or R_res multiplier. |
| FR2 / UC  | Use control                               | Required target; no R or R_res multiplier. |
| FR3 / SI  | System integrity                          | Required target; no R or R_res multiplier. |
| FR4 / DC  | Data confidentiality                      | Required target; no R or R_res multiplier. |
| FR5 / RDF | Restricted data flow                      | Required target; no R or R_res multiplier. |
| FR6 / TRE | Timely response to events                 | Required target; no R or R_res multiplier. |
| FR7 / RA  | Resource availability                     | Required target; no R or R_res multiplier. |

Each field accepts SL-T 0–4 or Not set. The tool retains seven separate targets, with no averaging. The matrix recommendation does not overwrite them, and mitigation does not automatically reduce them. These targets and recommendations are outputs or planning inputs within this application; they do not demonstrate an achieved security capability. The current residual workflow does not calculate SL-C.

## 12. Fields that document the assessment

The following fields inform the assessor and support review, but their text or selection is not used as a numerical coefficient.

| Area and fields                                                     | Meaning                                                                                                                        | Relationship to the calculation                                                                    |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Analysis name, author, date and version                             | Identification and assessment record.                                                                                          | No formula input; use them to identify which result was reviewed.                                  |
| Description and intended use                                        | Product purpose and scope.                                                                                                     | Guide scenario selection and ratings manually.                                                     |
| Product variants, functions, potential misuse cases and assumptions | Boundaries and use cases of the assessment.                                                                                    | No automatic derivation of risks or factors.                                                       |
| Architecture and component images                                   | System context.                                                                                                                | No image analysis or automatic connectivity weighting.                                             |
| Root attack goal / title                                            | Intended attacker outcome.                                                                                                     | No numerical interpretation of the wording.                                                        |
| Attack-path and intermediate-path titles                            | Explain how the goal could be reached.                                                                                         | Position affects branch summaries; wording does not create a logical gate.                         |
| Impact/step text                                                    | Describes a specific consequence or attack step.                                                                               | Actual scenario links and K/S/T/U supply the numeric inputs.                                       |
| Node/impact notes                                                   | Local assumptions and evidence.                                                                                                | No arithmetic effect.                                                                              |
| Whole-risk notes                                                    | Assumptions and evidence applying to the shared risk.                                                                          | No arithmetic effect.                                                                              |
| Risk lifecycle phases                                               | Design, procurement, manufacturing, testing, transport, installation, operation, maintenance, decommissioning or custom phase. | Multiple phases can be selected; none supplies a multiplier.                                       |
| Custom lifecycle phase name                                         | Meaning of a custom phase.                                                                                                     | Required for that custom phase to count as an assigned phase; no effect on R.                      |
| Lifecycle notes                                                     | Why the risk applies during the chosen phases.                                                                                 | No arithmetic effect.                                                                              |
| Security goal name and description                                  | Intended security objective.                                                                                                   | A goal does not automatically apply a mitigation.                                                  |
| Security goal risk references                                       | Which risks the objective addresses.                                                                                           | Drive traceability and displays of each linked recommendation, without combining their scores.     |
| STRIDE categories, where retained in data                           | Threat classification: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.    | No coefficient or score change. Stored STRIDE S/T should not be confused with scaling S or time T. |
| CRA documentation checklist responses, notes and progress           | Documentation workflow and evidence tracking.                                                                                  | No input to R, R_res or the SL matrix.                                                             |
| Language and visual theme                                           | Display preferences.                                                                                                           | No numerical effect; bilingual wording should still describe the same assessment.                  |

Documentary fields can be essential to a defensible assessment even though they have no arithmetic effect. A reviewer should be able to explain why each numeric choice follows from the stated scenario, scope and evidence.

## 13. Reading results, counts and reports

### 13.1 Risk Analysis

- **Asset coverage:** shows each assignment with its individual score and classification. A shared risk can have different scores in different asset rows.
- **Root overview:** shows each saved risk's inherited P vector, I_norm, score and classification once.
- **Risk by asset:** shared risks show individual scores in descending order. The highest score is highlighted when all assignments have a numeric assessment; ties are highlighted together. Unassessed assignments remain visible with a dash.
- **Editor preview:** selecting an asset displays only its damage ratings, calculated tree scores and recommended SL-T. The assignment selector and saved shared assessment remain separate from this viewing choice. Single-asset saved risk cards retain their linked scenario ratings.
- **Saved attack trees:** holds the risk itself, including an unassigned risk after its last asset link is removed.
- **Recommended SL-T:** uses the original assessment and configured matrix.

### 13.2 Overview distributions

The original and residual charts count **risk entries / attack trees by class**. They do not sum scores. Assigning R01 to three assets still contributes one risk entry to the count.

A chart percentage is the proportion of classified risks in that class. Unassessed risks are excluded from its classified denominator and reported separately. Example: one High, one Low and one unassessed risk produce 50% High and 50% Low among the two classified risks, with one unassessed risk separately identified.

For the residual distribution, the implementation falls back to the original root score if it cannot obtain a numeric residual root result. An untouched residual assessment can also show the original score because original factors are retained until reassessed mitigation is supplied. A residual chart is therefore not proof that all treatments have been reviewed.

### 13.3 Reports and exports

The PDF reports the analysis data and computed summaries; export is not a second independent scoring method. Its asset coverage should list each shared assignment, while the underlying risk remains one entry. Source matrix ratings, normalized impact and root score should be read with their respective labels.

JSON export preserves inputs, assignments, trees, treatment data and analysis-specific settings. Stored calculated fields are useful for inspection, but activating/importing an analysis can recalculate them using the configuration currently loaded in the application.

## 14. Configuration, changes and reproducibility

### 14.1 Two separate configuration layers

| Layer                    | Scope                             | Controls                                                                                                                                 |
| ------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Assessment configuration | Shared by the running application | Scenario catalog, matrix labels, severity factors, protection weights/ranking, K/S/T/U options, risk thresholds and class labels/colors. |
| Security-level settings  | Stored in the individual analysis | Three feasibility boundaries, three impact boundaries, 16 recommendation cells and seven required targets.                               |

The shipped numerical configuration is in `config/assessment_config.json`. Startup first tries its generated JavaScript companion, `config/assessment_config.js`, then JSON as a fallback. Editing JSON alone does not guarantee changed startup values. Regenerate the companion using:

```sh
python3 scripts/sync_assessment_config.py
```

**Overview → Load assessment config** loads a selected JSON configuration into the current browser session. It does not rewrite the installed files or preserve a new startup configuration across reloads. Configuration changes update the active assessment; other analyses can be recalculated when activated.

The Parameters guidance file describes fields and examples. Changing explanatory text alone does not change a coefficient or formula. Conversely, changing coefficients without updating guidance can leave users reading stale explanations.

### 14.2 What changes which results

| Change                                               | Expected effect                                                                                                         |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Asset name/type/description                          | No score change.                                                                                                        |
| Asset protection rating                              | May change its overall maximum level and all linked risks' impacts.                                                     |
| Matrix rating                                        | May change every linked leaf that selects that scenario.                                                                |
| Matrix justification                                 | No number changes; completeness/evidence changes.                                                                       |
| Assign or remove asset                               | Recomputes candidate impacts for the shared tree.                                                                       |
| Select or deselect a leaf scenario                   | Recomputes that leaf's candidate set.                                                                                   |
| Change leaf K/S/T/U                                  | Changes leaf feasibility, its path score and the combined OR result.                                                    |
| Add/remove leaf                                      | Changes path inputs and assessment completeness.                                                                        |
| Change notes/lifecycle/goal references               | No arithmetic change.                                                                                                   |
| Change residual treatment or revised factors         | Can change residual path scores and their OR result; leaves original R unchanged.                                       |
| Change global severity factors or protection weights | Can change original and residual impact-derived scores.                                                                 |
| Change K/S/T/U option labels                         | Changes wording only.                                                                                                   |
| Change K/S/T/U option values                         | Changes available choices; existing stored numeric selections are not automatically reinterpreted from their old label. |
| Change risk thresholds                               | Changes classification without changing the numerical product.                                                          |
| Change SL bands/matrix                               | Changes recommendation, without changing R or R_res.                                                                    |
| Change required SL-T targets                         | Changes declared targets, without changing scores or matrix recommendations.                                            |

### 14.3 Reproducing a past result

Retain these together:

1. Exported analysis JSON or the relevant version snapshot.
2. The exact assessment configuration used, including numerical option values and thresholds.
3. The application source/build used, including local modifications when relevant.
4. The saved per-analysis SL settings, which are part of the analysis export.
5. The report and the evidence supporting each judgment.

Global assessment configuration is not automatically embedded as a complete per-analysis configuration in a normal analysis export or version snapshot. Restoring a snapshot under different global weights can therefore produce different recalculated results. The saved version identifier alone does not establish identical calculation parameters.

For technical verification, `taraConfigStatus()` in the browser console reports the configuration source. The live configuration and the JSON file were compared when validating this reference's examples.

### 14.4 Older analyses

Single-asset risk records are migrated to stable assignment lists. A legacy risk without assignment fields can be matched automatically when only one asset exists. With several possible assets, explicit assignment is required. An explicitly detached risk retains its empty assignment list and is not automatically attached again.

Risks identified as generated by the former impact-matrix automation are archived rather than retained as active manual risks. Their absence from active risk counts is a migration behavior, not a calculated zero score. Current matrix ratings do not automatically create new risks.

## 15. Worked examples

The principal examples in this section were executed against the application's calculation functions for this edition. Values shown use the defaults in sections 3–5 and 11.

### 15.1 Example A — One asset, two scenarios

Inputs:

- A01 has overall protection level II, weight 0.80.
- DS1 is Low, factor 0.30; DS3 is High, factor 1.00.
- The leaf selects DS1 and DS3.
- K = 0.6, S = 0.3, T = 0.4, U = 0.3.

```text
DS1 weighted impact = 0.80 × 0.30 = 0.24
DS3 weighted impact = 0.80 × 1.00 = 0.80
I_norm              = max(0.24, 0.80) = 0.80
A                   = 0.6 + 0.3 + 0.4 + 0.3 = 1.6
R                   = 0.80 × 1.6 = 1.28
Risk class          = Medium
```

With one leaf, the path and root inherit the same values. For recommended SL-T, A = 1.6 is High and I = 0.8 is High because the boundary belongs to the lower band. The matrix returns **SL-T 3**. The seven required targets remain whatever the user entered in Settings.

### 15.2 Example B — Adding and removing a shared asset

The leaf selects DS3 and has K/S/T/U = 0.7/0.5/0.4/0.5, so A = 2.1.

| Asset | Protection weight | DS3 factor | Weighted impact |
| ----- | ----------------: | ---------: | --------------: |
| A01   |              0.60 |       0.30 |            0.18 |
| A02   |              1.00 |       1.00 |            1.00 |

| Assignment state          |     I_norm | Displayed R | Class    |      Recommended SL-T |
| ------------------------- | ---------: | ----------: | -------- | --------------------: |
| Only A01                  |       0.18 |        0.38 | Low      |                     2 |
| A01 and A02               |       1.00 |        2.10 | Critical |                     4 |
| Only A02                  |       1.00 |        2.10 | Critical |                     4 |
| A02 removed, A01 retained |       0.18 |        0.38 | Low      |                     2 |
| Final assignment removed  | Unassessed |           — | Unknown  | Assessment incomplete |

The first raw score is 0.18 × 2.1 = 0.378, displayed as 0.38. Assigning A02 changes the maximum impact, not the number of risk entries and not the feasibility vector. Removing the final assignment preserves the authored tree for later reassignment.

### 15.3 Example C — Two independently assessed paths

One level III asset has DS1 rated Medium and DS3 rated High. Each path has one leaf:

| Path        | I_norm |   K |   S |   T |   U |   A |    R |
| ----------- | -----: | --: | --: | --: | --: | --: | ---: |
| Path 1: DS1 |   0.60 | 0.7 | 0.1 | 0.1 | 0.1 | 1.0 | 0.60 |
| Path 2: DS3 |   1.00 | 0.1 | 0.5 | 0.5 | 0.5 | 1.6 | 1.60 |

`R = 2.2 × [1 − (1 − 0.60/2.2) × (1 − 1.60/2.2)] = 1.76`, High.

The root summaries remain I = 1.00 and K/S/T/U = 0.7/0.5/0.5/0.5. The separate recommended SL-T still uses those summaries and returns 4.

### 15.4 Example D — Treating the same tree

Leave Path 1 unchanged. Mitigate Path 2 with 0.1 for each revised factor. Path 1 remains 0.60 and Path 2 becomes 0.40. Their combined residual score is **0.89, Medium**. Original R remains **1.76, High**, and the original recommended SL-T remains 4.

If both paths are mitigated with 0.1 for every factor, their scores become 0.24 and 0.40. The combined residual score is **0.60, Low**. Blank revised factors still fall back individually to their original values; treatment completeness is checked separately.

### 15.5 Example E — Missing factors cannot be supplied by another path

With impact 1.00 on both paths, suppose Path 1 supplies only K = 0.7, while Path 2 supplies only S/T/U = 0.5/0.5/0.5. Both path scores and the combined root score are **Unassessed**. The displayed root maxima do not make either path complete. Recommended SL-T also reports incomplete assessment.

### 15.6 Example F — No applicable contribution

A risk has an assigned asset and all four factors selected, but the leaf's selected scenarios are N/A or have no matrix cell. There is no positive severity contribution. The result is:

```text
I_norm = empty
R      = empty
Class  = Unknown
SL-T   = Assessment incomplete
```

Now assign a second asset whose selected scenario is High with weight 1.00. The leaf receives impact 1.00 and can produce a score, even though the first asset's cell remains N/A or missing. A numeric shared score must not obscure that difference in matrix coverage.

### 15.7 Example G — Boundary checks

| Value under review                  | Result                                  |
| ----------------------------------- | --------------------------------------- |
| Saved R = 0.79                      | Low                                     |
| Saved R = 0.80                      | Medium                                  |
| Saved R = 1.59                      | Medium                                  |
| Saved R = 1.60                      | High                                    |
| Saved R = 1.99                      | High                                    |
| Saved R = 2.00                      | Critical                                |
| Feasibility A = 0.80 for SL banding | Low feasibility band                    |
| Impact I = 0.80 for SL banding      | High impact band                        |
| Valid matrix cell = 0               | SL-T 0                                  |
| Blank matrix cell                   | Recommendation configuration incomplete |

Keep the raw/rounded display caveat from section 9 in mind when inspecting node colors at these thresholds.

## 16. Review worksheet and frequently asked questions

### 16.1 Worksheet for explaining one result

| Question                                          | Record in the assessment                                                     |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| Which risk and application/configuration version? | Risk ID, stable exported record, analysis version and configuration copy.    |
| Which assets are assigned?                        | All assigned asset IDs and names; whether common assumptions apply.          |
| What sets each asset's protection level?          | Five criterion ratings, controlling maximum and resulting weight.            |
| Which scenarios does each leaf select?            | Scenario IDs, matrix ratings and supporting comments.                        |
| What sets each leaf's impact?                     | Every relevant weighted candidate and the controlling maximum.               |
| Why these K/S/T/U choices?                        | Evidence supporting knowledge, scaling, effort and benefit judgments.        |
| What sets the root vector?                        | Controlling leaf for I, K, S, T and U separately.                            |
| Are all leaves complete?                          | Check leaves individually, including ones that do not control the root.      |
| How is R classified?                              | Displayed score, applicable configured threshold and any color disagreement. |
| How is SL-T recommended?                          | Original feasibility/impact bands, matrix cell, and completeness.            |
| How do treatments change the result?              | Per-leaf treatment, revised factors, fallback values and retained impact.    |
| What remains a judgment?                          | Acceptance/delegation rationale, required targets and review state.          |

### 16.2 Frequently asked questions

**Why did changing a field not change the score?**  
It may be documentary, may not control a maximum, may refer to an unselected scenario or unassigned asset, or may produce a change too small to alter the two-decimal result. Revised residual values are used only for Mitigated treatment.

**Why did a shared risk become Critical when I added an asset?**  
The new asset may supply a higher weighted impact to one or more leaves. The root combines that impact with the existing inherited feasibility vector.

**Why are all linked assets showing the same risk result?**  
They refer to one shared risk. Its impact uses the maximum across its assignments, and its feasibility and treatment are shared.

**Why did selecting a security goal not lower residual risk?**  
The link records intent and traceability. A lower score requires an applicable treatment and revised factors that lower the path scores.

**Why is the residual score still the original score before review?**  
Original factors are retained for blank, Accepted and Delegated treatment, and for missing factor replacements under Mitigated. The score alone does not indicate reviewed mitigation.

**Can I regard Low as automatically acceptable?**  
The software assigns a class. It does not automatically decide acceptance from that class. Use the organization's decision rules and record the treatment rationale.

**Does a low residual score lower the required SL-T targets?**  
No. The seven targets are user settings, and the recommended SL-T is derived from the original assessment.

**Does removing an assignment delete the risk?**  
The trash icon inside an asset's risk block removes only that link. The risk survives even after its last assignment is removed and can be reassigned. Deleting the saved attack tree removes the risk itself.

**Why can the same JSON yield a different score on another installation?**  
That installation may load different global assessment factors or thresholds. Preserve the configuration and application version alongside the analysis.

## 17. Technical appendix and source map

This appendix supports independent verification. Ordinary users can follow the preceding sections without reading code.

### 17.1 Input and derived storage fields

| Stored field                                                                               | Meaning                                                                                                     |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `assets[].confidentiality`, `integrity`, `authenticity`, `authorization`, `authentication` | Five selected criteria; `authenticity` is the legacy key for Availability.                                  |
| `assets[].schutzbedarf`                                                                    | Overall stored protection level, derived when the asset form is saved. Impact calculation reads this field. |
| `impactMatrix[assetId][scenarioId]`                                                        | Source matrix rating, normally `"N/A"`, `"1"`, `"2"` or `"3"`.                                              |
| `riskEntries[].assetUids`                                                                  | Authoritative stable assignment list for current risks. An empty list means explicitly unassigned.          |
| `riskEntries[].assetUid`, `assetId`                                                        | Compatibility fields referring to the first assigned asset; not the full assignment set.                    |
| `riskEntries[].treeV2`                                                                     | Current root, child path nodes and impact leaves.                                                           |
| `impacts[].ds`                                                                             | Scenario IDs selected for a leaf.                                                                           |
| `impacts[].k`, `s`, `t`, `u`                                                               | Original numeric selections, usually stored as strings.                                                     |
| `i_norm`, `kstu` on nodes/root                                                             | Derived impact and feasibility vector.                                                                      |
| `riskEntries[].rootRiskValue`                                                              | Derived two-decimal original root score, or empty when unassessed.                                          |
| Residual leaf `rr.treatment`                                                               | Stored treatment code: `Akzeptiert`, `Delegiert` or `Mitigiert`, regardless of display language.            |
| Residual leaf `rr.k`, `s`, `t`, `u`                                                        | Reassessed selections used under Mitigated treatment.                                                       |
| `securityLevelSettings`                                                                    | Analysis-specific recommendation matrix, boundaries and required targets.                                   |

Changing exported JSON manually can bypass UI selection constraints. The impact calculation reads stored `schutzbedarf`; it does not re-derive the five-criterion maximum on every impact calculation. Keep the overall field consistent with the criteria when migrating data.

### 17.2 Numerical validation details

The low-level `computeRiskScore` helper converts missing or unparseable operands to zero. User-facing score paths normally call `getAssessedRiskValue` first, which requires finite parsed impact and all four factors; otherwise it returns an empty score. Therefore, directly calling the low-level helper with incomplete data is not a faithful reproduction of the normal displayed assessment.

The score guard and inheritance use `parseFloat`, whereas SL completeness uses stricter conversion with `Number` and requires nonnegative values. Malformed imported strings can be interpreted differently. Use the provided controls and valid numeric configuration. The raw leaf formula has no cap. Path aggregation requires scores within the configured maximum; an out-of-range score is unassessed instead of being clamped into a probability.

The default three protection levels and four feasibility factors are built into the model. Global configuration validation checks required sections and descending risk thresholds but is not a comprehensive semantic validator of every coefficient, label or option. Zero/negative/custom weights and renamed class identifiers require implementation review. In particular, zero weights trigger the existing fallback expression, and default class identifiers are also used by overview counts and residual note requirements.

### 17.3 Known limitations relevant to this edition

- Statistical OR assumes independent paths; correlation and shared prerequisites are not represented.
- Direct impacts within one path retain independent factor maxima.
- A numerical root does not guarantee complete leaves, protection criteria, matrix coverage or evidence.
- Shared assignments use one scenario/factor/treatment model across all linked assets.
- Residual assessment retains original impact and has no residual-only impact input.
- Some colors/counts and note rules retain assumptions about default classes when configuration is customized.
- The reviewed checkout contains unresolved merge markers in `config/parameter_guide.js`. The Parameters reference can fail to load. This document derives its formulas from the executable calculation modules and configuration, rather than assuming that reference tab is available or current.

### 17.4 Source map

| Topic                                                           | Implementation source and key functions                                                                                                                                                                                                          |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Shipped factors and options                                     | [Assessment JSON](../config/assessment_config.json) and [generated startup configuration](../config/assessment_config.js)                                                                                                                        |
| Config loading and refresh                                      | [config_loader.js](../js/core/config_loader.js), `loadAssessmentConfig`, `reloadAssessmentConfigFromObject`; [globals.js](../js/core/globals.js), `syncGlobalsFromAssessmentConfig`; [init.js](../js/core/init.js), `onAssessmentConfigReloaded` |
| Five criteria and overall protection level                      | [assets.js](../js/modules/assets.js), `ASSET_CRITERIA`, `readAssetEvaluation`                                                                                                                                                                    |
| Canonical product and saved risk classification                 | [utils.js](../js/core/utils.js), `computeRiskScore`, `getRiskMeta`, `getRiskBgClass`                                                                                                                                                             |
| Assignment resolution and score completeness                    | [risk_sync.js](../js/core/risk_sync.js), `getRiskAssets`, `setRiskAssets`, `getAssessedRiskValue`, `refreshRiskAssessment`, `syncAssetRisks`                                                                                                     |
| Weighted leaf impact, summaries and statistical OR              | [attack_tree_calc.js](../js/attack_tree/attack_tree_calc.js), `computeLeafImpactNorm`, `_kstuWorstCase`, `applyImpactInheritanceV2`, `applyWorstCaseInheritanceV2`, `applyStatisticalRiskAggregation`                                            |
| Node display and editor data                                    | [attack_tree_ui.js](../js/attack_tree/attack_tree_ui.js), `_renderNodeSummaryHTML`; [attack_tree_editor_v2.js](../js/attack_tree/attack_tree_editor_v2.js), `getEntryData`                                                                       |
| Source matrix and refresh                                       | [impact_matrix.js](../js/modules/impact_matrix.js), `updateImpactScore`, `_recalcAllRiskEntries`                                                                                                                                                 |
| Assignment controls                                             | [risk_analysis.js](../js/modules/risk_analysis.js), `renderRiskAnalysis`, `renderAssetRiskCoverage`                                                                                                                                              |
| Residual factors, original-impact retention and synchronization | [residual_risk_data.js](../js/residual_risk/residual_risk_data.js), `computeResidualTreeMetrics`, `syncResidualRiskFromRiskAnalysis`                                                                                                             |
| Residual completeness and notes                                 | [residual_risk_ui.js](../js/residual_risk/residual_risk_ui.js), `rrLeafComplete`, `rrTreeAllLeavesComplete`, `rrSharedNoteRequired`, `rrRenderTreeCard`                                                                                          |
| Security-level bands/matrix and required targets                | [security_level_settings.js](../js/modules/security_level_settings.js), `securityLevelForRisk`, `defaultSecurityLevelMatrix`, `validSecurityLevelMatrix`                                                                                         |
| Overview counting and exports                                   | [analysis_core.js](../js/core/analysis_core.js), `renderOverview`, `renderOverviewRiskChart`, `exportAnalysis`; [report_export.js](../js/report/report_export.js)                                                                                |
| Lifecycle and security goals                                    | [risk_lifecycle.js](../js/modules/risk_lifecycle.js); [security_goals.js](../js/modules/security_goals.js)                                                                                                                                       |
| Related user instructions                                       | [User guide](user-guide.md), [configuration customization](parameters-customization.md), [security-level settings](security-level-matrix.md)                                                                                                     |

### 17.5 Rebuilding the PDF

From the repository root, with the dependencies in `scripts/requirements-docs.txt` installed and Playwright Chromium available:

```sh
python3 scripts/build_user_guide.py --source docs/risk-calculation-guide.md
```

This writes `docs/risk-calculation-guide.pdf`, with a linked contents list, PDF outline, page numbers and embedded license. Keep the Markdown and PDF together when publishing an updated edition. Relative source-code links in the PDF point to the public repository; use the accompanying checkout for the exact local modifications described by this edition.

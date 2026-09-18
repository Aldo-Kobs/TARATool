# TARA Tool — User Guide

**Step-by-step instructions for creating, reviewing and exporting an analysis**  
Edition: 17 September 2026 · Language: English

Reviewed against fork revision `fac28fc` and the accompanying GPL notice updates.

This guide describes the current tool, including asset-linked risks, lifecycle phases, security goals, residual assessment, security-level settings and the CRA Documentation Checklist. It uses the English interface labels. The **EN/DE** switch changes the display language.

Follow the steps in order for a new analysis. Return to earlier steps whenever the product, assumptions, damage ratings or attack paths change. Examples illustrate how to enter information; adapt the decisions to your company and operating context.

## Copyright, license and modified version

This guide describes Aldo-Kobs's modified version of TARA Tool, based on [SCHUNK SE & Co. KG's original project](https://github.com/SCHUNK-SE-Co-KG/TARATool), upstream commit `4bbc354`. The fork was modified on **10–17 September 2026**; this notice was added on **17 September 2026**.

Original work: Copyright (C) 2026 SCHUNK SE & Co. KG. Fork modifications and this guide: Copyright (C) 2026 Aldo-Kobs.

The program and this guide are free software/documentation: you may redistribute and modify them under the GNU General Public License, version 3 or (at your option) any later version (**GPL-3.0-or-later**). They are provided **WITHOUT ANY WARRANTY**, including the implied warranties of **MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE**. See the accompanying [LICENSE](../LICENSE) for the full terms, also available at <https://www.gnu.org/licenses/gpl-3.0.html>.

Fork source: <https://github.com/Aldo-Kobs/TARATool>. [Attribution](../NOTICE.md), [dated modifications](MODIFICATIONS.md) and [distribution instructions](DISTRIBUTION.md) accompany the repository. Retain these notices and supply the license when redistributing this guide. The PDF reading copy also embeds the full LICENSE file as an attachment.

## Contents

1. [Start and protect your work](#1-start-and-protect-your-work)
2. [Define the scope in Overview](#2-define-the-scope-in-overview)
3. [Agree assessment settings](#3-agree-assessment-settings)
4. [Register and evaluate assets](#4-register-and-evaluate-assets)
5. [Rate damage scenarios and explain every cell](#5-rate-damage-scenarios-and-explain-every-cell)
6. [Create risks and attack paths](#6-create-risks-and-attack-paths)
7. [Assign lifecycle phases](#7-assign-lifecycle-phases)
8. [Define security goals](#8-define-security-goals)
9. [Evaluate residual risks](#9-evaluate-residual-risks)
10. [Review CRA documentation](#10-review-cra-documentation)
11. [Use the Parameters reference](#11-use-the-parameters-reference)
12. [Save versions and export deliverables](#12-save-versions-and-export-deliverables)
13. [Worked example](#13-worked-example)
14. [Troubleshooting and final review](#14-troubleshooting-and-final-review)
15. [Maintain the guidance](#15-maintain-the-guidance)

## 1. Start and protect your work

1. Open the supplied `index.html` in a modern browser, or open your organisation’s hosted copy of the tool.
2. Choose **EN** or **DE** in the top bar. Use the sun/moon switch for light or dark mode.
3. Click **New**, enter an analysis name and click **Create**. To reuse an existing analysis, expand **Copy** and select the source before creating the new analysis. A copy starts a new version history; it does not carry over the source analysis’s history. Review copied content, including residual review statuses, before relying on it.
4. Check the analysis selector in the top bar. All subsequent work applies to the selected analysis.
5. If continuing from a backup, click **Import**, select the exported analysis JSON file and complete the import. An imported analysis with an existing ID is added as a separate imported copy.

The tool stores analyses in the browser’s local storage. **Save** stores the current work locally; it does not download a backup. Use **Export** regularly and keep the JSON file in your project’s document storage. Browser-data deletion, a different browser profile or a different site address can make the locally stored analysis unavailable.

Finish and save an open form before switching analyses or exporting. Several tab controls save changes immediately, but an unfinished dialog is not a substitute for a saved entry.

Some features load external libraries, particularly PDF generation and tree rendering. If these are unavailable, see the troubleshooting section.

**Recommended workflow:** Overview → Settings → Assets → Damage scenarios → Risk analysis → Risk Lifecycle → Security goals → Residual risk → CRA Documentation Checklist → final review and export. Use **Parameters** whenever you need a field definition.

## 2. Define the scope in Overview

1. Enter the **Analysis name** and **Author / responsible person**.
2. Add the two optional images below these fields: the system/product architecture, and internal components/external interfaces. Use PNG, JPEG or WebP, up to **5 MB per image**. Large images are optimised for storage. Check that diagram labels remain readable in the resulting report.
3. Complete the fields in the following order. Use **Add item** for each separate list entry.

| Field                      | What to enter                                               | Example                                                                             |
| -------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| System description         | System boundary, architecture, interfaces and dependencies. | A controller connected to a customer OT network and a maintenance laptop.           |
| Functions                  | One function per list item.                                 | Receive commands; control an actuator; install firmware updates.                    |
| Intended use               | Users, environment and permitted operation.                 | Trained technicians service the controller in an access-controlled production area. |
| Potential misuse cases     | One foreseeable misuse per item.                            | Connect the service interface to an unmanaged network.                              |
| Product variants evaluated | One explicitly covered variant per item.                    | Model A, Ethernet interface, firmware 2.x.                                          |
| Assumptions                | One assessment assumption per item.                         | The customer separates the OT network from the public internet.                     |

4. Click **Save** in the analysis header.
5. Check that the scope is precise enough to decide which assets and interfaces belong in the assessment.

The two description fields accept paragraphs. The other four fields are lists so functions, variants, misuse cases and assumptions stay distinct. The overview text, lists and images are included in the analysis PDF.

## 3. Agree assessment settings

Open **Settings** in the top bar while the correct analysis is selected.

### Set the SL-T targets

Select a target separately for each of the seven requirements shown in the tool:

| Requirement | Name in the tool                          | Decision to discuss                                         |
| ----------- | ----------------------------------------- | ----------------------------------------------------------- |
| FR1 / IAC   | Identification and authentication control | Required confidence in user, device and service identities. |
| FR2 / UC    | Use control                               | Required control over permitted actions and privileges.     |
| FR3 / SI    | System integrity                          | Required protection against unauthorised changes.           |
| FR4 / DC    | Data confidentiality                      | Required protection against disclosure.                     |
| FR5 / RDF   | Restricted data flow                      | Required restrictions on communication.                     |
| FR6 / TRE   | Timely response to events                 | Required detection and response capability.                 |
| FR7 / RA    | Resource availability                     | Required continuity of essential resources and services.    |

Each target accepts **Not set** or **0–4**. Not set means no decision has been recorded; 0 is an explicit selected target. Use **Parameters → Settings → SL-T targets** for the level summaries. Agree the targets with the relevant product and security stakeholders and record the rationale in the analysis documentation.

SL-T represents the intended protection. The seven targets stay separate and do not decrease automatically when a mitigation reduces a risk score. You may save a partially assigned set of targets; the progress count shows how many have been set. A recommended SL-T does not establish achieved security capability or certify the product.

### Configure the recommended SL-T matrix

1. Enter three positive, increasing boundaries for **Attack feasibility** and three for **Impact**. These create four bands for each axis. A value exactly on a boundary belongs to the lower band.
2. Use feasibility based on the tool’s `K + S + T + U` score. The impact axis uses the normalised numerical impact; its boundaries are not the damage matrix’s Low/Medium/High dropdown values.
3. Select **SL 0–4** for each of the 16 matrix cells, using your agreed company mapping.
4. Click **Save settings**.

New analyses use the following editable defaults. These are the tool’s starting values; review them before adopting them as company policy.

| Axis                                 | Low   | Medium       | High         | Very high |
| ------------------------------------ | ----- | ------------ | ------------ | --------- |
| Attack feasibility (`K + S + T + U`) | ≤ 0.8 | > 0.8 to 1.4 | > 1.4 to 1.8 | > 1.8     |
| Normalised impact                    | ≤ 0.3 | > 0.3 to 0.6 | > 0.6 to 0.8 | > 0.8     |

| Feasibility / Impact | Low    | Medium | High   | Very high |
| -------------------- | ------ | ------ | ------ | --------- |
| Low                  | SL-T 0 | SL-T 0 | SL-T 1 | SL-T 2    |
| Medium               | SL-T 0 | SL-T 1 | SL-T 2 | SL-T 3    |
| High                 | SL-T 1 | SL-T 2 | SL-T 3 | SL-T 4    |
| Very high            | SL-T 2 | SL-T 3 | SL-T 4 | SL-T 4    |

An incomplete matrix can be saved, but it cannot produce a recommendation. All impact leaves must have a numeric impact and all four factors before a risk receives a recommendation; a populated root score alone is insufficient. **Recommended SL-T** is calculated from the original risk’s feasibility and normalized impact. It appears in Risk Analysis and updates live in the risk editor. Security Goals shows each linked risk’s recommendation alongside the required targets from Settings. Recommendations do not overwrite those targets.

Settings belong to the selected analysis. General K/S/T/U choices and other scoring defaults come from the separate assessment configuration. Use **Overview → Load assessment config** only when applying an agreed company configuration. That load affects the running session and can change recalculated results; it is not an analysis import.

## 4. Register and evaluate assets

1. Open **Assets** and click **Add asset**.
2. Enter a clear, unique **Name** and choose a **Type**.
3. Describe the asset’s role, boundary, interfaces and relevant assumptions.
4. Assess all five protection properties individually.
5. Click **Save**. Repeat for the other assets in scope.

| Type      | Typical entries                                             |
| --------- | ----------------------------------------------------------- |
| Component | Hardware, controllers, communication interfaces.            |
| Data      | Software, firmware, configuration data, cryptographic keys. |
| Function  | Internal functions and system functions.                    |

### Choose I, II or III by the consequences of a failure

Use these proposed definitions as a starting point for agreeing company criteria:

- **I — limited consequences:** local effects manageable through routine work or an effective workaround.
- **II — significant consequences:** substantial but contained harm requiring dedicated recovery, rework or intervention.
- **III — severe consequences:** serious or lasting harm, exposure of critical secrets, or loss of essential operation or control.

These are protection-need categories, distinct from the SL-T values in Settings and from product classifications. The same reasoning applies to hardware, applications, firmware, shared libraries, data and system functions. Assess intended use, dependencies, affected users, alternatives and recovery; a small shared component can have severe downstream consequences. The Parameters guidance is editable; its current loading limitation is described in section 11.

| Property        | Question to ask                                          | Illustrative progression from I to III                                                                                                     |
| --------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Confidentiality | What happens if someone learns the information?          | Limited disclosure of internal information → sensitive business disclosure → exposure of a signing key or fleet administrator credentials. |
| Integrity       | What happens if the asset is changed without permission? | Correctable display error → production rework → dangerous control behaviour.                                                               |
| Availability    | What happens if the asset stops working?                 | Workaround available → significant production interruption → essential service lost beyond the tolerable outage.                           |
| Authentication  | What happens if a false identity is trusted?             | Low-consequence viewer impersonation → machine maintenance impersonation → trusted update service impersonation.                           |
| Authorization   | What happens if someone exceeds their permissions?       | Minor preference change → unauthorised machine settings → broad administrative control or bypass of critical safeguards.                   |

Authentication asks **“Who is this?”** Authorization asks **“What may this identity do?”** Assess both even when the same interface is involved.

Select the highest credible consequence for each property in the assessed context. An example does not automatically determine the level. Record the reasoning in the asset description. I still means protection is needed. **N/A** is available for Authentication and Authorization when a criterion does not apply; explain why. Leaving a selection blank means it has not been evaluated.

The tool derives an overall protection need from the highest selected property. Complete the individual assessment rather than relying on an automatically displayed result. With the shipped defaults, I, II and III carry weights of 0.6, 0.8 and 1.0. An unset overall protection need currently falls back to the I weight during impact calculation, so a numeric risk score does not prove that the asset evaluation is complete.

## 5. Rate damage scenarios and explain every cell

Open **Damage scenarios** after adding assets. The matrix has assets as rows and damage scenarios as columns. Column headers remain visible as you scroll.

The default scenarios are:

| ID  | Scenario                | Assessment focus                                             |
| --- | ----------------------- | ------------------------------------------------------------ |
| DS1 | Danger to life and limb | Harm to people.                                              |
| DS2 | Financial damage        | Direct or indirect financial losses.                         |
| DS3 | Operation damage        | Loss of operation in the component.                          |
| DS4 | Loss of privacy/data    | Loss or disclosure of sensitive data.                        |
| DS5 | Legal consequences      | Consequences of violations relevant to the assessed product. |

The scenarios apply to software and hardware in their operating context. A compromised library, service or trusted sensor value can cause harm through the products that depend on it. Assess the outcome and credible exposure; the number of devices alone does not determine severity.

To add a custom scenario, click **New**, enter its name, a short description of at most 10 characters, and an optional explanation; then save. Describe a harmful outcome, rather than an attack technique.

For **every asset/scenario pair**:

1. Decide whether that harmful outcome is applicable to the asset.
2. Select **Low**, **Medium**, **High** or **N/A** in the matrix cell.
3. Click the cell’s **…** comment control.
4. Explain the outcome, the selected severity, assumptions and available evidence. Save the comment.
5. Review the missing-comment indications before moving on.

| Rating     | General interpretation                                                                 | DS3 example                                                                                   |
| ---------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Low / 1    | Limited, local harm, recoverable through routine procedures or a practical workaround. | A nonessential interface stops, while the component remains usable through another interface. |
| Medium / 2 | Significant but contained disruption requiring dedicated recovery or rework.           | A component stops one production cell until specialist recovery.                              |
| High / 3   | Severe, widespread or difficult-to-reverse harm.                                       | An essential process stops without a workable fallback beyond the agreed tolerable outage.    |
| N/A        | The stated damage is not applicable in the assessed context.                           | A scenario concerns records that the component neither stores nor handles.                    |

### Apply the scale to each damage category

The following summarises the expanded scenario guidance. Use it with the product’s actual dependencies and agreed severity thresholds; the examples are not automatic ratings.

| Scenario                      | Low / 1                                                                                | Medium / 2                                                                                                                    | High / 3                                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| DS1 — Danger to life and limb | Minor, temporary harm without lasting impairment.                                      | Reversible injury with a meaningful recovery period.                                                                          | Serious injury, permanent impairment or a life-threatening outcome; one person can be sufficient.                                  |
| DS2 — Financial damage        | Small local cost within routine-service limits.                                        | Substantial but contained repair, recovery, replacement or compensation costs.                                                | Major total loss beyond the company’s high-impact threshold, including downstream costs.                                           |
| DS3 — Operation damage        | Minor interruption with required functions available through an effective alternative. | Important operation interrupted within a bounded scope, with deliberate recovery and an alternative that contains the outage. | Required operation lost beyond the tolerable outage with no effective fallback.                                                    |
| DS4 — Loss of privacy/data    | Limited disclosure of low-sensitivity information without access secrets.              | Sensitive customer, technical or personal information exposed with substantial but contained consequences.                    | Critical secrets or highly sensitive information exposed with severe or lasting consequences; a single signing key may suffice.    |
| DS5 — Legal consequences      | A substantiated minor issue correctable through routine action.                        | A material but contained failure requiring formal corrective action or creating significant liability.                        | Severe consequences supported by the applicable obligation and assessment; do not assume penalties or recall follow automatically. |

Examples include a defective shared library preventing dependent applications from starting (DS3), a service exposing identifiable customer records (DS4), or manipulated sensor information contributing to unsafe physical behaviour (DS1). One incident can support several scenario ratings; explain each consequence separately. For DS5, identify the specific applicable obligation and the basis for the consequence.

Choose **N/A** only after excluding a credible path to that scenario, including indirect effects. An isolated public sample may have no sensitive-data exposure, but software is not automatically exempt from safety or operational consequences. Uncertainty about an outcome or obligation is a reason to investigate, not a reason to choose N/A.

Use company-specific thresholds for duration, affected people, financial loss and data sensitivity. Rate the **consequence**, not the likelihood of an attack. N/A is not “low” or “unknown”; an untouched cell also displays N/A, so make the decision explicit in the comment.

**Every cell requires a comment, including N/A. Missing comments block the analysis PDF export.** Comments are included in that report.

## 6. Create risks and attack paths

Risks are created manually. A matrix rating does not automatically create a risk. Each risk is assigned to **one asset**, and every attack path within it refers to that asset.

1. Open **Risk analysis** and review the asset coverage list. Identify assets with no attached risk or with insufficiently explored attack paths.
2. Use **Create risk** for the relevant asset, or open the new-risk form and select its **Asset**.
3. Read the **Damage Scenario impact** preview in the form. It shows the ratings already assigned to that asset. The read-only **Recommended SL-T** field updates from the configured matrix as the assessment becomes complete.
4. Enter the **Attack goal / root**, describing the attacker’s intended outcome.
5. Add an **Attack path**, describing how that outcome could be reached. Add intermediate paths if they help explain the sequence.
6. Add an **Impact** leaf for the concrete harmful result.
7. Tick the damage scenarios relevant to that leaf. At least one linked scenario with an applicable numeric rating is needed for a calculated impact.
8. Select all four **K, S, T and U** values for each leaf.
9. Use the path/impact note controls for assumptions, evidence and reasoning. Use whole-risk notes for information applying to the entire risk.
10. Save and close the risk editor. Review the resulting risk and the asset coverage list.

### What to enter for K, S, T and U

The following values are the shipped defaults. If your organisation loads a different configuration, follow the current dropdowns and **Parameters** reference.

| Factor                     | What to assess                                                        | Default choices                                                                                     |
| -------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| K — Complexity / knowledge | Knowledge and discovery effort needed for the attack.                 | 0.7 known vulnerabilities; 0.6 simple internet research; 0.3 expert research; 0.1 expert knowledge. |
| S — Scaling                | Scope in which the attack can spread or be repeated.                  | 0.5 customer IT network; 0.3 customer OT network; 0.1 single product/local machine.                 |
| T — Time / effort          | Effort to prepare and execute the attack under the stated conditions. | 0.5 under 1 week; 0.4 under 4 weeks; 0.2 under 3 months; 0.1 over 3 months.                         |
| U — Utility                | Visible benefit or incentive for the attacker.                        | 0.5 high; 0.3 medium; 0.1 low.                                                                      |

Larger factors increase the feasibility score; they are not percentages. For overlapping time descriptions, use the most specific applicable choice, and agree how your company treats exact boundaries.

### Read the results correctly

The tool combines the assigned asset’s protection need with the linked damage ratings. It does not average ratings from all assets. For multiple linked scenarios it uses the highest resulting impact. Parent paths and the root inherit worst-case impact and K/S/T/U values, so a root can combine maxima from different leaves.

With the shipped defaults, Low, Medium and High damage ratings have severity factors of 0.3, 0.6 and 1.0. Each linked scenario’s normalised impact is its severity factor multiplied by the assigned asset’s overall protection weight. N/A provides no numeric impact; if all linked scenarios are N/A, the leaf is unassessed rather than a scored zero.

The score is `R = normalised impact × (K + S + T + U)`. Scores and classes are outputs; enter the supporting assessment in the leaf fields. An unknown result or an empty leaf needs review. A scored root does not prove that every path is complete.

The current default risk classes are:

| Class    | Score range   |
| -------- | ------------- |
| Low      | 0 ≤ R < 0.8   |
| Medium   | 0.8 ≤ R < 1.6 |
| High     | 1.6 ≤ R < 2.0 |
| Critical | R ≥ 2.0       |

These are risk-score classes, separate from the feasibility/impact bands used by the recommended SL-T matrix. A custom assessment configuration can change the thresholds.

If one attack affects several assets, create separate asset-linked risks as needed and cross-reference them in notes. When an asset or damage rating changes, review its associated risks and subsequent residual decisions.

### Review older analyses and asset changes

When importing an older analysis, review every risk’s asset assignment. An older unassigned risk can be matched automatically when there is only one asset; when several assets are possible, select the correct one explicitly. Deleting an asset removes its matrix ratings and comments. Its manually created risks can remain without a valid asset assignment and must be reviewed before reuse; renumbering the remaining assets does not transfer those risks to another asset.

Risks marked as generated by the former matrix automation are retained in the analysis archive and removed from the active risk list. There is no archive-restore control in the interface. Keep the original JSON backup and recreate or review the required risks through the current manual workflow.

## 7. Assign lifecycle phases

1. Open **Risk Lifecycle** after creating the risks.
2. For each risk, open **Select phases** and select every phase in which it is most relevant.
3. Choose from design and development, procurement, manufacturing and assembly, testing and quality assurance, storage and transport, installation and commissioning, operation, maintenance and updates, and decommissioning and disposal.
4. If needed, select **Custom phase** and enter its name.
5. Add **Reason / notes** explaining the selection.

More than one phase can be assigned to the same risk. For example, malicious firmware installation can be relevant during manufacturing, commissioning and maintenance. An unnamed custom phase is incomplete as a named assignment.

Lifecycle assignments organise review responsibilities and timing. They do not change the calculated score. The assignments and notes are included in the analysis PDF.

## 8. Define security goals

1. Open **Security goals** and click **Add security goal**.
2. Enter a goal name describing the required security outcome.
3. Use the description to explain scope, expected behaviour and how the outcome will be verified.
4. Tick one or more referenced risks/attack goals.
5. Save and repeat as needed.

**Example goal:** “Only authorised firmware may execute.”  
**Description:** “Verify firmware origin and integrity before installation and startup. Reject untrusted packages and retain the verification test evidence.”

A goal may address several risks, and a risk may have several goals. These links can also be maintained in the Residual risk editor. Linking a goal records the relationship; it does not automatically lower a score.

## 9. Evaluate residual risks

1. Open **Residual risk** and edit the relevant risk.
2. Choose a treatment for **each impact leaf**.
3. Complete the associated Notes, **Detailed Control Measure** and reassessment fields as required by the treatment.
4. If at least one impact is **Mitigated**, the **Security goals** selector appears at the bottom of the editor. Select the relevant goals there; create missing goals in the Security goals tab first.
5. Finish the editor using **Done**.
6. On the risk card, review the same Notes value and the remaining score.
7. Mark the risk **evaluated** after the review is complete.

| Treatment | What you must document                                                    | Effect on the assessment                   |
| --------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| Accepted  | Rationale for retaining the risk and the supporting decision.             | Original K/S/T/U remain in use.            |
| Delegated | Who will handle it, the responsibility boundary and supporting evidence.  | Original K/S/T/U remain in use.            |
| Mitigated | Concrete Detailed Control Measure and all four reassessed K/S/T/U values. | Reassessed factors are used for this leaf. |

For Accepted and Delegated leaves, the shared Notes field is required for the completion indicator. For Mitigated leaves, the Detailed Control Measure and all four factors are required. If a residual factor is missing, the calculation can fall back to its original value; a displayed score therefore does not guarantee a completed reassessment.

Use the optional **Link to requirement** field directly beneath each **Detailed Control Measure** to enter a requirement URL or ID, such as `REQ-SEC-012`. It is editable when the impact is Mitigated, shared between display languages, saved with the assessment and included beneath the measure in the PDF report. It does not affect the score or completion indicator.

Reassess only changes supported by the measure and evidence. The residual calculation retains the impact; it changes the attack feasibility factors. Selecting “Mitigated” by itself does not reduce the risk.

There is **one Notes value per residual risk**, shared by the edit window and the overview card. Editing or clearing either field immediately updates the other. The editor shows one Notes field across its impact rows. Use it to explain the relevant treatment decisions and the overall review. Existing differing notes from older analyses are combined once, retaining distinct text without duplicating identical entries.

The same Notes field is also required for completion when the remaining class is **High** or **Critical**. Use it to record the decision, remaining limitations and follow-up actions.

The **evaluated** checkbox is a manual review status, separate from field completeness. It does not validate the evidence, approve acceptance or change a score. Revisit it when the underlying assessment changes.

The Residual Risk tab retains the analysis’s shared **SL-T** targets. It has no SL-C calculation or display. Mitigation changes residual risk scores without lowering the original risk’s recommended SL-T.

## 10. Review CRA documentation

Open **CRA Documentation Checklist** to track the documentation review organised under **Annex V** and **Annex VII**.

1. Read each item and locate the relevant document or evidence.
2. Add a comment, a reference link, or both. Useful comments identify the document version, reviewer, outstanding action or applicability reasoning.
3. Use a complete `https://` or `http://` URL when you want the link to open from the tool.
4. Tick the item when your review of it is complete.
5. For conditional items that do not apply, record the reason in the comment.

The counters track reviewed checklist items, rather than establishing product conformity. Clearing a checkmark preserves its comment and link. The checklist is saved with the analysis and included in JSON exports and version snapshots.

**The CRA Documentation Checklist is excluded from the analysis PDF.** Retain the JSON backup and the referenced evidence for this part of the work.

## 11. Use the Parameters reference

**Known issue in reviewed revision `fac28fc`:** the parameter guidance file contains unresolved merge-conflict markers, which prevent it from loading. The Parameters tab can therefore be blank. Sections 3–6 of this guide provide the key settings, protection-level and damage-rating guidance while that issue is resolved. The workflow below describes the reference when its guidance file loads successfully.

1. Open the final **Parameters** tab.
2. Follow a section link for the relevant tab/window, or search for a field, value or example.
3. Read what the field requires, the meaning of its possible values and the examples.
4. Return to the relevant entry window to fill in the assessment.

The reference defines 51 user-entered fields, grouped from Assets through Residual Risk and the associated Settings dialogs. Each entry provides an explanation, possible values, examples and a required/optional/recommended/conditional label. These labels explain the assessment workflow; they do not themselves enforce validation. Search filters the field rows, their section titles and their displayed content.

The latest guidance text broadens the examples to hardware and software products, firmware, reusable components, data and functions. It adds scenario-specific DS1–DS5 explanations and rating examples alongside the proposed I/II/III definitions. Some of this content is still affected by the unresolved guidance-file conflict; do not assume every nested example is displayed by the current renderer. The functioning reference draws supported configurable choices, such as K/S/T/U and matrix bands, from the running application. Changing example text does not change the scoring configuration.

Parameters is a reference, not an additional entry form. It is not an analysis PDF chapter.

## 12. Save versions and export deliverables

### Save a review milestone

1. Finish open forms and click **Save** in the analysis header.
2. Open **Versions → New version**.
3. Choose **Incremental** for the next minor version or **Major** for a new major version.
4. Enter the required comment describing what changed and why.
5. Save the version.

Versions store snapshots of the analysis. **Restore** replaces the working state with the selected snapshot after confirmation. Export a JSON backup first if you need to keep the current working state separately.

### Download an editable backup

1. Select the correct analysis and click **Save**.
2. Click **Export** in the top bar.
3. Store the downloaded JSON with the project’s review records.
4. To resume elsewhere, use **Import** in the other browser and select this JSON.

The export contains the selected analysis, including its settings, checklist and history. Keep the company assessment configuration alongside it when that configuration has been customised; the running app’s global scoring configuration is separate from the analysis data.

### Generate the analysis PDF

1. Select the required display language and review the text in that language. Switching the interface does not automatically translate your own descriptions.
2. Complete every Damage scenarios matrix comment, including N/A cells.
3. Review the risk paths, goal links, lifecycle assignments, residual notes and evaluation status.
4. Open **Overview** and click **Report (PDF)**.
5. Open the downloaded PDF and check its name/version, images, matrix comments, risk details, security goals, lifecycle information and residual results/settings.

The report includes the analysis content and assessment results. It excludes the CRA checklist and Parameters reference. A successful export confirms that a report was generated; it does not establish that the assessment is complete or approved. The PDF is a review deliverable, while JSON is the editable backup.

### Other exports and About

**Overview → Export tree data** provides tree data as a ZIP for further use.

**About** identifies the SCHUNK upstream project and the Aldo-Kobs fork, shows the dated modification and warranty notices, and links to the GPLv3-or-later license, copyright/modification notices and fork source. **About → Export SBOM** downloads the tool’s own CycloneDX software bill of materials with the fork’s application metadata and GPL-3.0-or-later declaration. It is not an inventory of your assessed product. Close About with ×, Escape or a click on the backdrop outside the window.

## 13. Worked example

Use the following as a practice exercise with the shipped scoring defaults. It describes a single risk against a fictional industrial controller; the ratings are illustrative assumptions.

1. **Overview:** Name the analysis “Controller A — maintenance interface”. Describe a controller on a customer OT network. Add the assumption that maintenance access is restricted to trained technicians.
2. **Assets:** Add “Controller firmware” as **Data**. In this example, choose Confidentiality I, Integrity II, Availability II, Authentication II and Authorization II. State that incorrect firmware can stop one cell but, under the example’s system boundary, does not cause safety-critical behaviour. The overall protection need is II.
3. **Damage scenarios:** Rate this asset’s **DS3 Operation damage** as High under the example company’s outage threshold. Comment: “Firmware failure can stop the cell beyond its agreed maximum tolerable outage; no immediate replacement is available.” Deliberately assess and comment all other scenario cells too.
4. **Risk analysis:** Create a risk for that asset with the goal “Stop controller operation through an unauthorised update”. Add a path “Abuse the maintenance update interface” and an impact leaf “Controller cannot start”. Link DS3.
5. **Original factors:** Select K 0.7, S 0.1, T 0.5 and U 0.3. Record the example assumptions: known update weakness, one local controller affected, less than a week of effort and medium attacker benefit.
6. **Lifecycle:** Select installation and commissioning, and maintenance and updates. Explain that these phases expose the update workflow.
7. **Security goal:** Create “Reject unauthorised firmware” and link it to the risk.
8. **Residual risk:** Choose Mitigated. Describe signature verification, protected trust material and access control for the update process. Assuming verification evidence supports the reduction, reassess K as 0.1 and T as 0.2; leave S at 0.1 and U at 0.3. Explain the evidence and remaining assumptions.
9. **Review:** Add the whole-risk residual decision, verify the goal link, and mark evaluated when the review is complete. Save a version, export JSON and create the PDF after all matrix comments are present.

With the shipped factors, protection II contributes 0.8 and High severity contributes 1.0, so the normalised impact is **0.8**. The original score is `0.8 × (0.7 + 0.1 + 0.5 + 0.3) = 1.28`, classified **Medium**. The example residual score is `0.8 × (0.1 + 0.1 + 0.2 + 0.3) = 0.56`, classified **Low**.

These numbers change if the configuration or linked scenarios change. With the shipped recommended SL-T matrix, the original feasibility 1.6 and impact 0.8 fall in the High/High cell, giving **recommended SL-T 3**. This recommendation remains based on the original risk after mitigation. The seven required SL-T targets remain **Not set** until you select them separately; the example does not prescribe those targets.

## 14. Troubleshooting and final review

| Symptom                                                   | What to check                                                                                                                                                                      |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parameters tab is blank in revision `fac28fc`             | The committed guidance file cannot load because of unresolved merge-conflict markers. Use this guide’s assessment explanations and have the maintained application copy corrected. |
| A risk has a score despite an unfinished asset evaluation | Complete all five protection properties. An unset overall protection need currently falls back to the I weight.                                                                    |
| PDF export reports missing comments                       | Open Damage scenarios and complete every cell’s comment, including N/A.                                                                                                            |
| A risk has no calculated impact                           | Confirm its asset, linked damage scenarios and at least one applicable numeric matrix rating.                                                                                      |
| A risk score is unknown or incomplete                     | Complete all four factors on each relevant leaf and check that its impact is assessed.                                                                                             |
| An asset has no attached risk                             | Use its Create risk action in Risk analysis; risks are not automatically generated from the matrix.                                                                                |
| Residual score did not decrease                           | Check that the treatment is Mitigated and that supported reassessed factors were entered. Goals and status checkboxes do not lower scores.                                         |
| Recommended SL-T is not configured                        | Complete all 16 matrix cells and valid increasing boundaries in Settings; also check the underlying risk assessment.                                                               |
| Evaluated is checked but fields are missing               | Review status is manual. Complete the required treatment fields and any High/Critical whole-risk note.                                                                             |
| An image is rejected                                      | Use PNG, JPEG or WebP within the 5 MB per-image limit.                                                                                                                             |
| PDF or tree rendering is unavailable                      | Check whether the required external libraries/services loaded and whether the network allows them. Preserve a JSON backup while resolving access.                                  |
| Work is missing in another browser                        | Import the exported analysis JSON. Local browser storage is not shared project storage.                                                                                            |
| A language switch leaves text in the original language    | Enter the appropriate text for that language where supported; user descriptions are not automatically translated.                                                                  |

Before handing the assessment to a reviewer, confirm:

- [ ] The scope, variants, assumptions and responsible person are clear.
- [ ] Assets and all five protection properties have been reviewed.
- [ ] Every damage matrix cell has a deliberate rating and supporting comment.
- [ ] Asset coverage and plausible attack paths have been reviewed.
- [ ] Relevant leaves have scenario links and complete K/S/T/U assessments.
- [ ] Lifecycle phases and security goals are linked to the appropriate risks.
- [ ] Residual treatments, measures, evidence, notes and review statuses are complete.
- [ ] SL-T and matrix settings reflect the agreed assessment approach, where used.
- [ ] CRA checklist comments/links point to the reviewed documentation.
- [ ] A milestone version, JSON backup and checked PDF report are available.

## 15. Maintain the guidance

The editable source of this document is **`docs/user-guide.md`**. The companion **`docs/user-guide.pdf`** is the formatted reading copy. Regenerate the PDF after changing the Markdown so both versions stay consistent. From the repository root, use a Python environment with the documentation dependencies installed:

```sh
python3 -m pip install -r scripts/requirements-docs.txt
python3 -m playwright install chromium
python3 scripts/build_user_guide.py
```

If a compatible Chrome/Chromium is already installed, pass its executable instead of installing the Playwright browser, for example `python3 scripts/build_user_guide.py --browser-executable /opt/google/chrome/chrome`. The generator renders this Markdown, adds page numbers and PDF bookmarks, embeds LICENSE, and writes `docs/user-guide.pdf`. It does not generate an analysis report.

For company-specific in-app guidance, edit **`config/parameter_guide.js`**. The `sections[].fields[]` entries contain descriptions and examples. The `interpretations[]` entries define I/II/III and damage rating guidance in English and German.

For actual scoring choices and defaults, edit **`config/assessment_config.json`**, then run `python3 scripts/sync_assessment_config.py` from the project root and reload the app. Changing explanatory text alone does not change scoring.

See **`docs/parameters-customization.md`** for exact field keys and source locations. The user workflow in this edition was checked against the forms, scoring defaults, settings, analysis persistence, risk editors, About notices and report export code at `fac28fc` plus the accompanying licensing changes. The known Parameters loading problem is recorded in sections 11 and 14; the customization document also contains unresolved conflict text. Recheck these limitations and the instructions when the application changes.

# SL-T targets by foundational requirement

Open **Settings** and select an SL-T target from 0 to 4 independently for each of the seven IEC 62443 foundational requirements:

| Requirement | Name                                      |
| ----------- | ----------------------------------------- |
| FR1 / IAC   | Identification and authentication control |
| FR2 / UC    | Use control                               |
| FR3 / SI    | System integrity                          |
| FR4 / DC    | Data confidentiality                      |
| FR5 / RDF   | Restricted data flow                      |
| FR6 / TRE   | Timely response to events                 |
| FR7 / RA    | Resource availability                     |

The names follow the [IEC 62443-4-2 description](https://webstore.iec.ch/en/publication/34421). Risk assessment and target levels for zones and conduits are covered by [IEC 62443-3-2](https://webstore.iec.ch/en/publication/30727).

Targets apply to the active analysis. A blank selection means **Not set**, which is distinct from SL-T 0. Partial target assignments can be saved; the settings dialog shows how many of the seven targets have been set. The tool keeps the seven values separate and does not average them into one security level.

SL-T expresses the required protection. These user-defined targets remain fixed as attack feasibility, impact and residual risk scores change. Risk Analysis displays a matrix-derived recommended SL-T for each original risk. Security Goals shows the recommendations for its linked risks and the seven required targets from Settings. Residual Risk retains the shared targets but has no SL-C calculations or displays. Targets do not demonstrate implemented security capability.

Targets persist through saves, JSON exports/imports, analysis copies and version snapshots. The PDF includes all seven requirements with their targets. The blank CRA Documentation Checklist remains excluded from the PDF.

Older feasibility/impact matrices do not establish per-requirement targets. They remain untouched until new targets are saved; when that happens, the former matrix is retained in `securityLevelSettings.legacyMatrix`. Restoring an old matrix version leaves the target values unset instead of deriving unsupported defaults.

## Recommended SL-T matrix

Settings also contains the editable attack-feasibility and impact boundaries and a 4 × 4 SL matrix. New analyses start with the following editable defaults (rows: attack feasibility; columns: impact, both low to very high):

| Feasibility / Impact | Low | Medium | High | Very high |
| -------------------- | --- | ------ | ---- | --------- |
| Low                  | 0   | 0      | 1    | 2         |
| Medium               | 0   | 1      | 2    | 3         |
| High                 | 1   | 2      | 3    | 4         |
| Very high            | 2   | 3      | 4    | 4         |

Saved custom matrices remain unchanged. Choose SL 0–4 for every cell to enable recommended SL-T calculations. You can save incomplete matrix configuration alongside your SL-T targets; an incomplete matrix shows “Configure matrix in Settings” instead of a result.

Risk Analysis uses A = K + S + T + U from the original attack tree and the normalized impact for the assigned asset. Boundary values belong to the lower band. The **Recommended SL-T** field updates while creating or editing a risk, including unsaved changes to the asset, damage scenarios and feasibility values. An incomplete assessment displays “Assessment incomplete”; a configured zero remains SL-T 0.

Security Goals displays each linked risk’s recommendation separately, alongside the required per-requirement targets from Settings. Selecting or removing risk references updates the recommendations immediately. Use both to plan the security measures. Recommendations do not overwrite the seven configured targets, and residual mitigation does not reduce the original recommendation.

The PDF’s Risk Analysis section includes the configured matrix and recommended SL-T results. Security Goals includes linked-risk recommendations and the seven required targets. Residual Risk contains no SL-C results.

Previously saved matrices, including those preserved under `legacyMatrix`, are restored automatically. Editing and saving writes the active matrix alongside the targets while retaining the legacy data. Matrix configuration follows the same save, import/export, copy and version history as the targets.

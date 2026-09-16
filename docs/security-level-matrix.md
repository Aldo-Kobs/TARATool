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

SL-T expresses the required protection. These user-defined targets remain fixed as attack feasibility, impact and residual risk scores change. Risk Analysis no longer shows matrix-derived security levels. Residual Risk displays the seven targets as a shared reference, alongside the restored SL-C matrix calculation for each residual risk. Targets do not demonstrate implemented security capability.

Targets persist through saves, JSON exports/imports, analysis copies and version snapshots. The PDF includes all seven requirements with their targets. The blank CRA Documentation Checklist remains excluded from the PDF.

Older feasibility/impact matrices do not establish per-requirement targets. They remain untouched until new targets are saved; when that happens, the former matrix is retained in `securityLevelSettings.legacyMatrix`. Restoring an old matrix version leaves the target values unset instead of deriving unsupported defaults.

## Residual SL-C matrix

Settings also contains the editable attack-feasibility and impact boundaries and a 4 × 4 SL matrix. Choose SL 0–4 for every cell to enable residual SL-C calculations. You can save incomplete matrix configuration alongside your SL-T targets; an incomplete matrix shows “Configure matrix in Settings” instead of a result.

Residual Risk uses A = K + S + T + U from the residual attack tree and the normalized impact for the assigned asset. Boundary values belong to the lower band. Mitigation updates the matrix lookup without changing any SL-T targets. The result is labelled **SL-C planning estimate**, not demonstrated capability. Risk Analysis has no SL-C output. The PDF's Residual Risk section includes the configured matrix and residual results alongside the seven SL-T targets.

Previously saved matrices, including those preserved under `legacyMatrix`, are restored automatically. Editing and saving writes the active matrix alongside the targets while retaining the legacy data. Matrix configuration follows the same save, import/export, copy and version history as the targets.

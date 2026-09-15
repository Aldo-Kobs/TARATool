# Security-level planning matrix

Use **Settings** in the top toolbar to configure the active analysis. Set three upper bounds for attack feasibility, three for impact, and an SL 0–4 value for each of the 16 matrix cells. Save the matrix to enable the calculation. Initial band boundaries are editable starting values; there is no predefined IEC mapping.

The result defaults to **SL-C planning estimate**. Settings also offers **SL-T target**. IEC 62443-3-2 addresses risk assessment and target levels for zones and conduits, while IEC 62443-4-2 defines component requirements associated with capability levels. A user-defined risk matrix does not demonstrate component capability, verify the seven foundational requirements, or constitute an IEC conformity assessment. See the official [IEC 62443-3-2 description](https://webstore.iec.ch/en/publication/30727) and [IEC 62443-4-2 description](https://webstore.iec.ch/en/publication/34421).

## Calculation

- Feasibility is the sum of the existing risk-root K, S, T and U values. Higher values mean greater attack feasibility in this tool's scoring model.
- Impact is the risk's normalized impact for its assigned asset.
- The existing tree aggregation supplies the root values; the new matrix does not change the risk score calculation.
- Each upper bound is inclusive. Bands span zero upward without gaps, and values above the last bound use the fourth band.
- The selected feasibility row and impact column give the planning level.
- Residual calculations use reassessed K/S/T/U for mitigated impacts. Accepted, delegated and untreated impacts retain their original values.
- An unassigned asset, an empty tree, an incomplete impact assessment or missing mitigation scores produces “Assessment incomplete.” Missing/invalid matrix settings produce “Configure matrix in Settings.” Neither case is treated as SL 0.

## Storage and reports

Matrix settings belong to each analysis and travel with JSON exports, copies and version snapshots. Older analyses have no active matrix until one is configured. Results are derived from current assessment values and settings, avoiding stored levels becoming stale. The active assessment configuration still governs the underlying K/S/T/U and impact calculations.

Risk Analysis and Residual Risk show the estimate, its feasibility and impact inputs, and the selected bands. The PDF includes the configured matrix, band boundaries and both original and residual planning levels.

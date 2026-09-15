/** Asset assignment, assessment, and migration of previously generated risks. */
function getRiskAsset(analysis, entry) {
  const assets = analysis?.assets || [];
  if (entry?.assetUid) return assets.find((asset) => asset.uid === entry.assetUid) || null;
  if (entry?.assetId) return assets.find((asset) => asset.id === entry.assetId) || null;
  return !Object.hasOwn(entry || {}, 'assetId') && assets.length === 1 ? assets[0] : null;
}

function getAssessedRiskValue(iNorm, kstu) {
  if (
    ![iNorm, kstu?.k, kstu?.s, kstu?.t, kstu?.u].every((value) =>
      Number.isFinite(parseFloat(value))
    )
  )
    return '';
  return computeRiskScore(iNorm, kstu).toFixed(2);
}

function refreshRiskAssessment(entry, analysis) {
  applyImpactInheritance(entry, analysis);
  applyWorstCaseInheritance(entry);
  entry.rootRiskValue = getAssessedRiskValue(entry.i_norm, entry.kstu);
}

function riskAssetLabel(analysis, entry, lang) {
  const asset = getRiskAsset(analysis, entry);
  return asset
    ? `${asset.id}: ${getLocalizedField(asset, 'name', lang, { fallback: true }) || asset.name_en || '-'}`
    : t('risk.assetRequired', lang);
}

// Retire risks created by the former matrix automation without losing authored details.
function syncAssetRisks(analysis) {
  if (!analysis) return;
  const assets = analysis.assets || [];
  assets.forEach((asset) => {
    if (!asset.uid) asset.uid = generateUID('asset');
  });
  if (!Array.isArray(analysis.riskEntries)) analysis.riskEntries = [];
  if (!Array.isArray(analysis.matrixRiskArchive)) analysis.matrixRiskArchive = [];
  analysis.riskEntries = analysis.riskEntries.filter((entry) => {
    if (!entry.matrixGenerated) return true;
    const residual = analysis.residualRisk?.entries?.find((item) => item.uid === entry.uid);
    const record = { entry, residual: residual ? structuredClone(residual) : null };
    const index = analysis.matrixRiskArchive.findIndex((item) =>
      entry.uid ? item.entry.uid === entry.uid : item.entry.id === entry.id
    );
    if (index >= 0) analysis.matrixRiskArchive[index] = record;
    else analysis.matrixRiskArchive.push(record);
    return false;
  });

  // Stable identities prevent reassignment when deleting an asset renumbers the others.
  // Older trees with several possible assets require an explicit choice in the editor.
  analysis.riskEntries.forEach((entry) => {
    const asset = getRiskAsset(analysis, entry);
    entry.assetId = asset?.id || '';
    if (asset) entry.assetUid = asset.uid;
    refreshRiskAssessment(entry, analysis);
  });
  if (typeof syncResidualRiskFromRiskAnalysis === 'function')
    syncResidualRiskFromRiskAnalysis(analysis, false);
}

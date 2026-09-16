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

/** Source matrix ratings for all scenarios of a selected asset. */
function getAssetDamageImpacts(analysis, asset, lang) {
  if (!asset) return [];
  return getDisplayDamageScenarios(analysis).map((scenario) => {
    const value = String(analysis.impactMatrix?.[asset.id]?.[scenario.id] || 'N/A');
    const label = IMPACT_LABELS[value] || value;
    return {
      id: scenario.id,
      name: getLocalizedField(scenario, 'name', lang, { fallback: true }) || scenario.id,
      level: value === label ? value : `${value} (${label})`,
    };
  });
}

/** Read the original matrix ratings for this asset and the tree's linked scenarios. */
function getRiskDamageImpacts(analysis, entry, lang) {
  const asset = getRiskAsset(analysis, entry);
  if (!asset) return { status: 'assetRequired', items: [] };
  const ids = new Set();
  const collect = (leaf) => {
    (Array.isArray(leaf?.ds) ? leaf.ds : []).forEach((id) => ids.add(id));
  };
  if (entry?.treeV2) {
    const walk = (node) => {
      (node?.impacts || []).forEach(collect);
      (node?.children || []).forEach(walk);
    };
    walk(entry.treeV2);
  } else {
    rrIterateLeaves(entry, ({ leaf }) => collect(leaf));
  }
  const items = getAssetDamageImpacts(analysis, asset, lang).filter((item) => ids.has(item.id));
  return { status: items.length ? 'ok' : 'noLinkedDamageScenarios', items };
}

function riskDamageImpactsText(analysis, entry, lang) {
  const result = getRiskDamageImpacts(analysis, entry, lang);
  return result.status === 'ok'
    ? result.items.map((item) => `${item.id} — ${item.name}: ${item.level}`).join('\n')
    : t('risk.' + result.status, lang);
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

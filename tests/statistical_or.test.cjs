const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
function setup() {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'config/assessment_config.json')));
  const ctx = vm.createContext({
    console,
    structuredClone,
    window: {},
    document: {
      addEventListener() {},
      getElementById() {
        return null;
      },
    },
    PROBABILITY_CRITERIA: config.probabilityCriteria,
    PROTECTION_LEVEL_WEIGHTS: config.protectionLevels.weights,
    SEVERITY_LEVEL_FACTORS: config.severityLevelFactors,
  });
  for (const file of [
    'js/core/utils.js',
    'js/core/risk_sync.js',
    'js/attack_tree/attack_tree_calc.js',
    'js/attack_tree/attack_tree_ui.js',
    'js/residual_risk/residual_risk_data.js',
    'js/attack_tree/dot_export.js',
  ]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
  }
  return ctx;
}
function leaf(ds = 'DS1', factors = [0.7, 0.1, 0.1, 0.1]) {
  return {
    uid: ds,
    text: ds,
    ds: [ds],
    ...Object.fromEntries(['k', 's', 't', 'u'].map((key, i) => [key, String(factors[i])])),
  };
}
function fixture(legacy = false) {
  const leaves = [leaf(), leaf('DS2', [0.1, 0.5, 0.5, 0.5])];
  const entry = {
    id: 'R01',
    uid: 'risk',
    rootName: 'Goal',
    assetId: 'A01',
    ...(legacy
      ? { treeDepth: 1, branches: leaves.map((l, i) => ({ name: `Path ${i}`, leaves: [l] })) }
      : {
          treeV2: {
            uid: 'root',
            children: leaves.map((l, i) => ({
              uid: `p${i}`,
              title: `Path ${i}`,
              impacts: [l],
              children: [],
            })),
          },
        }),
  };
  return {
    entry,
    analysis: {
      assets: [{ id: 'A01', uid: 'asset', schutzbedarf: 'III' }],
      impactMatrix: { A01: { DS1: '2', DS2: '3' } },
      riskEntries: [entry],
    },
  };
}

for (const legacy of [false, true]) {
  test(`independent paths retain their own inputs (${legacy ? 'legacy' : 'v2'})`, () => {
    const ctx = setup();
    const { entry, analysis } = fixture(legacy);
    ctx.refreshRiskAssessment(entry, analysis);
    // Path scores 0.60 and 1.60; 2.2 * (1 - (1 - .6/2.2)*(1 - 1.6/2.2)).
    assert.equal(entry.rootRiskValue, '1.76');
    const paths = legacy ? entry.branches : entry.treeV2.children;
    assert.equal(paths[0].riskValue, '0.60');
    assert.equal(paths[1].riskValue, '1.60');
    assert.match(ctx.generateDotString(analysis), /R = 1,76/);
    assert.match(ctx._renderNodeSummaryHTML(entry.kstu, entry.i_norm, entry.riskValue), />1.76</);
  });
}

test('single path retains existing scoring and a linear wrapper does not count twice', () => {
  const ctx = setup();
  const { entry, analysis } = fixture();
  entry.treeV2.children.pop();
  ctx.refreshRiskAssessment(entry, analysis);
  assert.equal(entry.rootRiskValue, '0.60');
  entry.treeV2.children = [{ children: entry.treeV2.children }];
  ctx.refreshRiskAssessment(entry, analysis);
  assert.equal(entry.rootRiskValue, '0.60');
});

test('nested alternatives give the same result as flat alternatives without intermediate rounding', () => {
  const ctx = setup();
  const { entry, analysis } = fixture();
  entry.treeV2.children.push({ impacts: [leaf('DS1', [0.1, 0.1, 0.1, 0.1])] });
  ctx.refreshRiskAssessment(entry, analysis);
  const expected = (2.2 * (1 - (1 - 0.6 / 2.2) * (1 - 1.6 / 2.2) * (1 - 0.24 / 2.2))).toFixed(2);
  assert.equal(entry.rootRiskValue, expected);
  const [first, ...rest] = entry.treeV2.children;
  entry.treeV2.children = [first, { children: rest }];
  ctx.refreshRiskAssessment(entry, analysis);
  assert.equal(entry.rootRiskValue, expected);
});

test('missing or empty paths cannot borrow the other path inputs', () => {
  const ctx = setup();
  for (const empty of [false, true]) {
    const { entry, analysis } = fixture();
    const path = entry.treeV2.children[1];
    if (empty) path.impacts = [];
    else path.impacts[0].k = '';
    ctx.refreshRiskAssessment(entry, analysis);
    assert.equal(entry.rootRiskValue, '');
  }
});

test('zero paths are neutral and maximum paths saturate at the configured ceiling', () => {
  const ctx = setup();
  const { entry, analysis } = fixture();
  Object.assign(entry.treeV2.children[0].impacts[0], { k: '0', s: '0', t: '0', u: '0' });
  ctx.refreshRiskAssessment(entry, analysis);
  assert.equal(entry.rootRiskValue, '1.60');
  entry.treeV2.children[1].impacts[0].k = '0.7';
  ctx.refreshRiskAssessment(entry, analysis);
  assert.equal(entry.rootRiskValue, '2.20');
});

test('normalization follows configuration changes', () => {
  const ctx = setup();
  ctx.PROBABILITY_CRITERIA.K.options.push({ value: '1.5' });
  const { entry, analysis } = fixture();
  ctx.refreshRiskAssessment(entry, analysis);
  assert.equal(entry.rootRiskValue, '1.88'); // M = 3.0.
});

test('residual assessment combines mitigated path scores using the same OR', () => {
  const ctx = setup();
  const { entry, analysis } = fixture();
  ctx.refreshRiskAssessment(entry, analysis);
  ctx.window.syncResidualRiskFromRiskAnalysis(analysis, false);
  const residual = analysis.residualRisk.entries[0];
  residual.treeV2.children[1].impacts[0].rr = {
    treatment: 'Mitigiert',
    k: '0.1',
    s: '0.1',
    t: '0.1',
    u: '0.1',
  };
  const metrics = ctx.window.computeResidualTreeMetrics(analysis, entry.uid);
  assert.equal(metrics.riskValue, '0.89');
  assert.equal(entry.rootRiskValue, '1.76');
});

for (const depth of [2, 3]) {
  test(`legacy depth ${depth} scores intermediate paths`, () => {
    const ctx = setup();
    const { entry, analysis } = fixture(true);
    entry.treeDepth = depth;
    entry.useThirdIntermediate = depth === 3;
    if (depth === 2) {
      entry.branches = [{ name: 'Parent', l2_nodes: entry.branches }];
    } else {
      for (const branch of entry.branches) {
        branch.l2_node = { name: 'Intermediate' };
        branch.l3_node = { name: 'Terminal' };
      }
    }
    ctx.refreshRiskAssessment(entry, analysis);
    assert.equal(entry.rootRiskValue, '1.76');
    assert.match(ctx.generateDotString(analysis), /R = 1,76/);
  });
}

test('duplicate independent paths increase risk, direct impacts keep their existing assessment', () => {
  const ctx = setup();
  const { entry, analysis } = fixture();
  entry.treeV2.children = [entry.treeV2.children[0]];
  entry.treeV2.children[0].impacts.push(leaf());
  ctx.refreshRiskAssessment(entry, analysis);
  assert.equal(entry.rootRiskValue, '0.60');
  entry.treeV2.children.push(structuredClone(entry.treeV2.children[0]));
  ctx.refreshRiskAssessment(entry, analysis);
  assert.equal(entry.rootRiskValue, '1.04');
});

test('out-of-range imported path scores remain unassessed', () => {
  const ctx = setup();
  const { entry, analysis } = fixture();
  entry.treeV2.children[1].impacts[0].k = '10';
  ctx.refreshRiskAssessment(entry, analysis);
  assert.equal(entry.rootRiskValue, '');
});

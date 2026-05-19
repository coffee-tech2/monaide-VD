const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function load(file, context) {
  const code = fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInContext(code, context, { filename: file });
}

const context = { window: {}, console, document: { querySelectorAll: () => [] } };
vm.createContext(context);
[
  'assets/js/config.js',
  'assets/js/core.js',
  'assets/js/utils.js',
  'assets/js/simulator-rules.js',
  'assets/js/engine.js',
  'assets/js/results.js'
].forEach((file) => load(file, context));

const compute = context.window.computeSimulationResults;
const api = context.window.MONAIDE_TEST_API__ || {};
const sortResults = api.sortSimulationResults;

if (typeof compute !== 'function' || typeof sortResults !== 'function') {
  throw new Error('Simulator regression harness not available');
}

const baseProfile = {
  commune: 'Lausanne',
  communeNorm: 'lausanne',
  age: '26-35',
  permis: 'Nationalité suisse',
  sitPro: 'Sans emploi - sans revenu',
  logement: 'Locataire (appartement ou maison)',
  loyer: '1200-1800',
  enfants: 'non',
  formation: 'non',
  revenu: '1000-2000',
  fortune: 'moins4000',
  primeLamal: '250-400',
  aidesListe: [],
  incapacite: 'non',
  dettes: 'non',
  separationEnCours: 'non',
  besoinProtection: 'non',
  procheAidant: 'non'
};

function runProfile(overrides) {
  const computed = compute({ ...baseProfile, ...overrides });
  sortResults(computed.results, computed.context);
  return computed.results;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function indexOfResult(results, namePart) {
  return results.findIndex((item) => item.nom && item.nom.indexOf(namePart) !== -1);
}

const scenarios = [
  {
    name: 'RI reste dans les premières pistes utiles',
    run() {
      const results = runProfile({ revenu: 'aucun', fortune: 'moins4000', dettes: 'surendette' });
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const dettesIndex = indexOfResult(results, 'Parlons Cash');
      assert(riIndex !== -1 && riIndex <= 2, 'RI should stay in the first useful results');
      assert(dettesIndex !== -1 && riIndex < dettesIndex, 'RI should remain before debt support in this profile');
    }
  },
  {
    name: 'OCBE reste avant Jet Service pour un profil formation',
    run() {
      const results = runProfile({
        age: '18-25',
        sitPro: 'Étudiant·e ou en apprentissage',
        formation: 'oui_apres_obligatoire',
        logement: 'Chez mes parents (sans loyer)',
        loyer: '',
        revenu: 'moins1000'
      });
      const ocbeIndex = indexOfResult(results, 'Bourses d\'études');
      const jetIndex = indexOfResult(results, 'Jet Service');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const ruptureIndex = indexOfResult(results, 'Rupture d’apprentissage');
      assert(ocbeIndex !== -1, 'OCBE should appear for training profile');
      assert(jetIndex !== -1, 'Jet Service should appear as support for training profile');
      assert(lamalIndex !== -1, 'LAMal should still appear as a budget/health track');
      assert(ocbeIndex < jetIndex, 'OCBE should remain before Jet Service');
      assert(jetIndex < lamalIndex, 'Jet Service should stay before LAMal for a young training profile');
      assert(ruptureIndex === -1, 'Rupture apprenticeship should not appear without a rupture signal');
    }
  },
  {
    name: 'LACI passe avant RI en sortie d’emploi',
    run() {
      const results = runProfile({
        sitPro: 'Au chômage',
        revenu: '1000-2000',
        aidesListe: []
      });
      const laciIndex = indexOfResult(results, 'Assurance chômage');
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      assert(laciIndex !== -1, 'LACI should appear for unemployment profile');
      assert(riIndex !== -1, 'RI should remain visible as fallback');
      assert(laciIndex < riIndex, 'LACI should stay before RI in unemployment profile');
    }
  },
  {
    name: 'Sans emploi sans revenu garde LACI et RI avant LAMal',
    run() {
      const results = runProfile({
        age: '26-35',
        sitPro: 'Sans emploi - sans revenu',
        revenu: 'moins1000',
        dettes: 'non',
        aidesListe: []
      });
      const laciIndex = indexOfResult(results, 'Assurance chômage');
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const cashIndex = indexOfResult(results, 'Parlons Cash');
      assert(laciIndex !== -1, 'LACI should appear when employment ended or is unclear');
      assert(riIndex !== -1, 'RI should appear as immediate budget fallback');
      assert(lamalIndex !== -1, 'LAMal should remain visible but not first');
      assert(laciIndex < lamalIndex, 'LACI should be before LAMal');
      assert(riIndex < lamalIndex, 'RI should be before LAMal');
      assert(cashIndex === -1, 'Parlons Cash should not appear without a debt signal');
    }
  },
  {
    name: 'Urgence logement passe avant le subside LAMal',
    run() {
      const results = runProfile({
        age: '26-35',
        sitPro: 'En emploi',
        revenu: '1000-2000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800',
        dettes: 'loyer',
        aidesListe: []
      });
      const expulsionIndex = indexOfResult(results, 'Menace d\'expulsion');
      const csrIndex = indexOfResult(results, 'Centre social régional');
      const aidesLogementIndex = indexOfResult(results, 'Aides logement');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(expulsionIndex !== -1, 'Expulsion support should appear for rent debt');
      assert(csrIndex !== -1, 'CSR should appear as immediate social entry point');
      assert(aidesLogementIndex !== -1, 'Housing aid should remain visible');
      assert(lamalIndex !== -1, 'LAMal should remain visible but lower priority');
      assert(expulsionIndex < csrIndex, 'Expulsion support should be before CSR in housing emergency');
      assert(csrIndex < aidesLogementIndex, 'CSR should be before broader housing aid');
      assert(aidesLogementIndex < lamalIndex, 'Housing tracks should be before LAMal in housing emergency');
    }
  },
  {
    name: 'CarteCulture très probable ne remonte pas avant le subside déjà lié au RI',
    run() {
      const results = runProfile({
        sitPro: 'Bénéficiaire du RI',
        aidesListe: ['RI'],
        revenu: 'aucun'
      });
      const subsideIndex = indexOfResult(results, 'Subside LAMal');
      const carteIndex = indexOfResult(results, 'CarteCulture');
      assert(subsideIndex !== -1, 'LAMal follow-up should appear');
      assert(carteIndex !== -1, 'CarteCulture should still exist');
      assert(subsideIndex < carteIndex, 'LAMal should remain before CarteCulture in this sequence');
    }
  },
  {
    name: 'Migration sensible garde EVAM avant autres relais',
    run() {
      const results = runProfile({
        permis: 'Permis N',
        revenu: 'aucun'
      });
      assert(results[0] && results[0].nom.indexOf('EVAM') !== -1, 'EVAM should be first for permis N');
    }
  }
];

for (const scenario of scenarios) {
  scenario.run();
  console.log(`OK - ${scenario.name}`);
}

console.log(`\n${scenarios.length} simulator regression tests passed.`);

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
  if (namePart === 'Subside LAMal') {
    return results.findIndex((item) => item.nom && (
      item.nom.indexOf('Subside assurance maladie') !== -1 ||
      item.nom.indexOf('Subside LAMal') !== -1
    ));
  }
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
      assert(lamalIndex !== -1, 'Subside LAMal should still appear as a budget/health track');
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
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(laciIndex !== -1, 'LACI should appear for unemployment profile');
      assert(riIndex !== -1, 'RI should remain visible as fallback');
      assert(lamalIndex !== -1, 'Subside LAMal should remain visible as a secondary budget track');
      assert(laciIndex < riIndex, 'LACI should stay before RI in unemployment profile');
      assert(laciIndex < lamalIndex, 'LACI should stay before LAMal in unemployment profile');
    }
  },
  {
    name: 'Chômage déjà ouvert garde les compléments sans reproposer LACI',
    run() {
      const results = runProfile({
        famille: 'Célibataire sans enfants',
        sitPro: 'Au chômage',
        revenu: '1000-2000',
        fortune: 'moins4000',
        primeLamal: 'plus400',
        aidesListe: ['chomage']
      });
      const laciIndex = indexOfResult(results, 'Assurance chômage');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      assert(laciIndex === -1, 'Already opened unemployment benefits should not be suggested again');
      assert(lamalIndex !== -1, 'Subside LAMal should remain visible when health insurance premium is heavy');
      assert(riIndex !== -1, 'RI should remain visible if unemployment income may not cover basic needs');
      assert(lamalIndex < riIndex, 'Subside LAMal should stay before RI when the strongest declared signal is a heavy health insurance premium');
      assert(allocationsIndex === -1, 'No-children unemployment profile should not receive family allowances');
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
      assert(lamalIndex !== -1, 'Subside LAMal should remain visible but not first');
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
      const parlonsCashIndex = indexOfResult(results, 'Parlons Cash');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(expulsionIndex !== -1, 'Expulsion support should appear for rent debt');
      assert(csrIndex !== -1, 'CSR should appear as immediate social entry point');
      assert(aidesLogementIndex !== -1, 'Housing aid should remain visible');
      assert(parlonsCashIndex !== -1, 'Parlons Cash should remain visible when rent debt is declared');
      assert(lamalIndex !== -1, 'Subside LAMal should remain visible but lower priority');
      assert(expulsionIndex < csrIndex, 'Expulsion support should be before CSR in housing emergency');
      assert(csrIndex < aidesLogementIndex, 'CSR should be before broader housing aid');
      assert(aidesLogementIndex < parlonsCashIndex, 'Housing tracks should remain before general debt support when the debt is rent-related');
      assert(aidesLogementIndex < lamalIndex, 'Housing tracks should be before LAMal in housing emergency');
    }
  },
  {
    name: 'Dettes générales priorisent Parlons Cash',
    run() {
      ['dettes', 'surendette'].forEach((dettes) => {
        const results = runProfile({
          famille: 'Célibataire sans enfants',
          sitPro: 'En emploi',
          revenu: '2000-3500',
          fortune: 'moins4000',
          primeLamal: '100-250',
          logement: 'Locataire (appartement ou maison)',
          loyer: '700-1200',
          dettes
        });
        const parlonsCashIndex = indexOfResult(results, 'Parlons Cash');
        const lamalIndex = indexOfResult(results, 'Subside LAMal');
        const prestationsIndex = indexOfResult(results, 'Prestations communales');
        assert(parlonsCashIndex === 0, 'Parlons Cash should be first when general debt or overindebtedness is declared');
        assert(prestationsIndex !== -1, 'Local supports should stay visible when debts are declared');
        assert(lamalIndex === -1 || parlonsCashIndex < lamalIndex, 'Debt support should stay before LAMal when the declared problem is debt');
      });
    }
  },
  {
    name: 'Séparation en cours remonte dans les premiers repères',
    run() {
      const results = runProfile({
        sitPro: 'En emploi',
        enfants: 'oui',
        revenu: '1000-2000',
        separationEnCours: 'oui',
        aidesListe: []
      });
      const separationIndex = indexOfResult(results, 'Séparation');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      assert(separationIndex !== -1, 'Separation support should appear when separation is declared');
      assert(allocationsIndex !== -1, 'Family allowances should remain visible');
      assert(separationIndex <= 3, 'Separation should stay in the first visible results');
      assert(separationIndex < allocationsIndex, 'Separation should be before generic family allowances when separation is active');
    }
  },
  {
    name: 'Incapacité durable remonte avant LAMal',
    run() {
      const results = runProfile({
        sitPro: 'Sans emploi - sans revenu',
        revenu: '1000-2000',
        incapacite: 'totale',
        aidesListe: []
      });
      const aiIndex = indexOfResult(results, 'Assurance invalidité');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const proInfirmisIndex = indexOfResult(results, 'Pro Infirmis');
      assert(aiIndex !== -1, 'AI should appear for durable incapacity');
      assert(lamalIndex !== -1, 'Subside LAMal should remain visible');
      assert(proInfirmisIndex !== -1, 'Pro Infirmis should remain visible as support');
      assert(aiIndex < lamalIndex, 'AI should be before LAMal when durable incapacity is declared');
      assert(proInfirmisIndex < lamalIndex, 'Pro Infirmis should be before LAMal when durable incapacity is declared');
    }
  },
  {
    name: 'Proche aidant remonte avant LAMal',
    run() {
      const results = runProfile({
        sitPro: 'En emploi',
        revenu: '2000-3500',
        procheAidant: 'oui',
        aidesListe: []
      });
      const procheAidantIndex = indexOfResult(results, 'Proches aidant');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(procheAidantIndex !== -1, 'Proche aidant support should appear when declared');
      assert(lamalIndex !== -1, 'Subside LAMal should remain visible');
      assert(procheAidantIndex < lamalIndex, 'Proche aidant support should be before LAMal when declared');
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
      assert(subsideIndex !== -1, 'Subside LAMal follow-up should appear');
      assert(carteIndex !== -1, 'CarteCulture should still exist');
      assert(subsideIndex < carteIndex, 'Subside LAMal should remain before CarteCulture in this sequence');
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
  },
  {
    name: 'Parcours primes maladie trop lourdes priorise LAMal',
    run() {
      const results = runProfile({
        famille: 'En couple / mariée sans enfants',
        sitPro: 'En emploi',
        revenu: '2000-3500',
        fortune: 'moins4000',
        primeLamal: 'plus400',
        logement: 'Locataire (appartement ou maison)',
        loyer: '700-1200'
      });
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      assert(lamalIndex === 0, 'Subside LAMal should be the first track when the main signal is a heavy health insurance premium');
      assert(riIndex === -1, 'RI should not appear without a base-needs signal in the heavy premium scenario');
      assert(pcFamillesIndex === -1, 'PC Familles should not appear in a no-children heavy premium scenario');
      assert(allocationsIndex === -1, 'Family allowances should not appear in a no-children heavy premium scenario');
    }
  },
  {
    name: 'Parcours plus assez pour vivre garde RI avant LAMal',
    run() {
      const results = runProfile({
        famille: 'Célibataire sans enfants',
        sitPro: 'Sans emploi - sans revenu',
        revenu: 'aucun',
        fortune: 'moins4000',
        primeLamal: '250-400',
        dettes: 'non'
      });
      const laciIndex = indexOfResult(results, 'Assurance chômage');
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const foodIndex = indexOfResult(results, 'Aide alimentaire');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      assert(riIndex === 0, 'RI should be first when the profile says no job and no income');
      assert(laciIndex !== -1 && laciIndex > riIndex, 'LACI should remain visible after RI to avoid missing unemployment rights');
      assert(lamalIndex !== -1 && riIndex < lamalIndex, 'RI should be before LAMal when there is no income');
      assert(foodIndex !== -1 && foodIndex <= 3, 'Food support should stay highly visible in a no-income scenario');
      assert(allocationsIndex === -1, 'No-children no-income profile should not receive family allowances');
    }
  },
  {
    name: 'RI déjà perçu garde les suites utiles sans reproposer RI',
    run() {
      const results = runProfile({
        famille: 'Célibataire sans enfants',
        sitPro: 'Bénéficiaire du RI',
        revenu: '1000-2000',
        fortune: 'moins4000',
        primeLamal: '250-400',
        aidesListe: ['RI']
      });
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const carteIndex = indexOfResult(results, 'CarteCulture');
      assert(riIndex === -1, 'Existing RI should not be suggested again');
      assert(lamalIndex === 0, 'Subside LAMal should be the first useful follow-up when RI is already open');
      assert(carteIndex !== -1, 'CarteCulture should remain visible as a useful follow-up when RI is already open');
      assert(lamalIndex < carteIndex, 'Subside LAMal should stay before CarteCulture in the existing RI follow-up path');
    }
  },
  {
    name: 'Parcours séparation parent solo priorise la porte séparation',
    run() {
      const results = runProfile({
        sitPro: 'En emploi',
        enfants: 'moins16',
        revenu: '1000-2000',
        fortune: 'moins4000',
        separationEnCours: 'oui'
      });
      const separationIndex = indexOfResult(results, 'Séparation');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      assert(separationIndex === 0, 'Separation should be first when a parent solo/separation signal is active');
      assert(pcFamillesIndex !== -1, 'PC Familles should remain visible for a working parent with low income');
      assert(allocationsIndex !== -1, 'Family allowances should remain visible for children at charge');
      assert(lamalIndex !== -1 && separationIndex < lamalIndex, 'Separation should be before LAMal in this path');
    }
  },
  {
    name: 'Séparation parent solo ne repropose pas les allocations déjà touchées',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        loyer: '1200-1800',
        aidesListe: ['alloc_fam'],
        separationEnCours: 'oui'
      });
      const separationIndex = indexOfResult(results, 'Séparation');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const aidesLogementIndex = indexOfResult(results, 'Aides logement');
      assert(separationIndex === 0, 'Separation should stay first when a parent solo is separating');
      assert(allocationsIndex === -1, 'Already received family allowances should not appear during a separation profile');
      assert(pcFamillesIndex !== -1, 'PC Familles should remain visible during a parent solo separation profile');
      assert(aidesLogementIndex !== -1, 'Housing support should remain visible when rent is heavy during separation');
    }
  },
  {
    name: 'Situation familiale avec enfants déclenche les pistes famille',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800'
      });
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const prestationsCommunalesIndex = indexOfResult(results, 'Prestations communales');
      const gardeMaladeIndex = indexOfResult(results, 'Garde d’enfants malades');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const carteCultureIndex = indexOfResult(results, 'CarteCulture');
      assert(allocationsIndex !== -1, 'Family status with children should trigger family allowances even if the child detail question is missing');
      assert(pcFamillesIndex !== -1, 'Family status with children should keep PC Familles visible for a working low/moderate-income parent');
      assert(prestationsCommunalesIndex !== -1, 'Family status with children should keep local family supports visible');
      assert(gardeMaladeIndex !== -1, 'Family status with children should keep child-care emergency support visible');
      assert(pcFamillesIndex === 0, 'PC Familles should be the first family budget track for a working parent solo profile');
      assert(allocationsIndex === 1, 'Family allowances should stay directly after PC Familles for a parent solo profile');
      assert(lamalIndex === -1 || allocationsIndex < lamalIndex, 'Family tracks should appear before LAMal for a parent solo profile');
      assert(carteCultureIndex === -1 || pcFamillesIndex < carteCultureIndex, 'Family budget supports should stay before CarteCulture in this profile');
    }
  },
  {
    name: 'Aide familiale déjà perçue ne ressort pas comme résultat',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        aidesListe: ['alloc_fam']
      });
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      assert(allocationsIndex === -1, 'Already received family allowances should not be suggested again');
      assert(pcFamillesIndex !== -1, 'Already receiving family allowances should not hide other useful family budget tracks');
    }
  },
  {
    name: 'Parent solo sans revenu garde RI et pistes enfants utiles',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'Sans emploi - sans revenu',
        enfants: 'non',
        revenu: 'aucun',
        fortune: 'moins4000',
        primeLamal: '100-250'
      });
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const aideAlimentaireIndex = indexOfResult(results, 'Aide alimentaire');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(riIndex === 0, 'RI should be first for a parent solo without income');
      assert(allocationsIndex !== -1, 'Family allowances should remain visible for a parent solo without income');
      assert(aideAlimentaireIndex !== -1, 'Food support should remain visible when there is no income');
      assert(lamalIndex === -1 || riIndex < lamalIndex, 'RI should stay before LAMal when there is no income');
    }
  },
  {
    name: 'Parent solo sans revenu ne repropose pas les allocations déjà touchées',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'Sans emploi - sans revenu',
        enfants: 'non',
        revenu: 'aucun',
        fortune: 'moins4000',
        aidesListe: ['alloc_fam']
      });
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const aideAlimentaireIndex = indexOfResult(results, 'Aide alimentaire');
      assert(riIndex === 0, 'RI should remain first even when family allowances are already received');
      assert(allocationsIndex === -1, 'Already received family allowances should not appear for a no-income parent solo profile');
      assert(aideAlimentaireIndex !== -1, 'Food support should remain visible when family allowances are already received');
    }
  },
  {
    name: 'Parent au RI avec enfants garde les suites famille sans reproposer RI',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'Bénéficiaire du RI',
        enfants: 'non',
        revenu: '1000-2000',
        fortune: 'moins4000',
        aidesListe: ['RI']
      });
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const prestationsCommunalesIndex = indexOfResult(results, 'Prestations communales');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      assert(riIndex === -1, 'Existing RI should not be suggested again for a parent profile');
      assert(pcFamillesIndex === -1, 'PC Familles should not be suggested when RI is already declared');
      assert(allocationsIndex !== -1, 'A parent with children should keep family allowances visible if they are not already declared');
      assert(prestationsCommunalesIndex !== -1, 'A parent with children on RI should keep local family supports visible');
      assert(lamalIndex !== -1, 'Existing RI should keep LAMal as a useful follow-up');
    }
  },
  {
    name: 'Parent solo avec loyer lourd remonte la piste logement',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        logement: 'Locataire (appartement ou maison)',
        loyer: 'plus1800',
        primeLamal: '100-250'
      });
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const aidesLogementIndex = indexOfResult(results, 'Aides logement');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(pcFamillesIndex === 0, 'PC Familles should remain first for a working parent solo profile');
      assert(aidesLogementIndex !== -1, 'Housing support should appear when a parent solo has a heavy rent');
      assert(lamalIndex === -1 || aidesLogementIndex < lamalIndex, 'Housing support should appear before LAMal when rent is heavy');
    }
  },
  {
    name: 'Parent solo avec loyer lourd et subside LAMal déjà touché garde le logement avant CarteCulture',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        logement: 'Locataire (appartement ou maison)',
        loyer: 'plus1800',
        aidesListe: ['lamal']
      });
      const aidesLogementIndex = indexOfResult(results, 'Aides logement');
      const carteCultureIndex = indexOfResult(results, 'CarteCulture');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(lamalIndex === -1, 'Already received LAMal subsidy should not be suggested again');
      assert(aidesLogementIndex !== -1, 'Housing support should remain visible when LAMal is already received');
      assert(carteCultureIndex === -1 || aidesLogementIndex < carteCultureIndex, 'Housing support should appear before CarteCulture when rent is heavy');
    }
  },
  {
    name: 'Parent solo avec retard de loyer priorise urgence logement',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800',
        dettes: 'loyer'
      });
      const expulsionIndex = indexOfResult(results, 'Menace d\'expulsion');
      const csrIndex = indexOfResult(results, 'Centre social régional');
      const aidesLogementIndex = indexOfResult(results, 'Aides logement');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const parlonsCashIndex = indexOfResult(results, 'Parlons Cash');
      assert(expulsionIndex === 0, 'Eviction warning should be first when rent debt is active');
      assert(csrIndex !== -1 && csrIndex < pcFamillesIndex, 'CSR should appear before family budget tracks when rent debt is active');
      assert(aidesLogementIndex !== -1 && aidesLogementIndex < pcFamillesIndex, 'Housing support should appear before family budget tracks when rent debt is active');
      assert(parlonsCashIndex !== -1, 'Debt support should remain visible when rent debt is active');
    }
  },
  {
    name: 'Parent solo avec dettes générales priorise Parlons Cash',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800',
        dettes: 'surendette'
      });
      const parlonsCashIndex = indexOfResult(results, 'Parlons Cash');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      assert(parlonsCashIndex === 0, 'Parlons Cash should be first when general debt is active');
      assert(pcFamillesIndex !== -1, 'PC Familles should remain visible for a parent solo with debt');
      assert(allocationsIndex !== -1, 'Family allowances should remain visible for a parent solo with debt');
      assert(parlonsCashIndex < pcFamillesIndex, 'Debt support should appear before family tracks when general debt is active');
    }
  },
  {
    name: 'Perte d’emploi parent solo garde chômage avant RI et pistes famille',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'Au chômage',
        enfants: 'non',
        revenu: '1000-2000',
        fortune: 'moins4000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800'
      });
      const laciIndex = indexOfResult(results, 'Assurance chômage');
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const prestationsCommunalesIndex = indexOfResult(results, 'Prestations communales');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(laciIndex === 0, 'LACI should be first for a parent solo who is unemployed without declared unemployment benefits');
      assert(riIndex !== -1 && laciIndex < riIndex, 'RI should remain visible after LACI as a fallback');
      assert(allocationsIndex !== -1, 'Family allowances should remain visible during job loss with children');
      assert(prestationsCommunalesIndex !== -1, 'Local family supports should remain visible during job loss with children');
      assert(lamalIndex === -1 || allocationsIndex < lamalIndex, 'Family tracks should stay before LAMal in a parent job-loss path');
    }
  },
  {
    name: 'Chômage déjà perçu avec enfants ne repropose pas LACI',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'Au chômage',
        enfants: 'non',
        revenu: '1000-2000',
        fortune: 'moins4000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800',
        aidesListe: ['chomage']
      });
      const laciIndex = indexOfResult(results, 'Assurance chômage');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const prestationsCommunalesIndex = indexOfResult(results, 'Prestations communales');
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      assert(laciIndex === -1, 'Already declared unemployment benefits should not suggest opening LACI again');
      assert(allocationsIndex !== -1, 'Family allowances should remain visible when unemployment is already open');
      assert(prestationsCommunalesIndex !== -1, 'Local family supports should remain visible when unemployment is already open');
      assert(riIndex !== -1, 'RI should remain visible as a fallback if unemployment income is not enough');
    }
  },
  {
    name: 'Parent avec subside LAMal et allocations déjà perçus garde autres pistes famille',
    run() {
      const results = runProfile({
        famille: 'Parent seul avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800',
        aidesListe: ['lamal', 'alloc_fam']
      });
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const prestationsCommunalesIndex = indexOfResult(results, 'Prestations communales');
      const carteCultureIndex = indexOfResult(results, 'CarteCulture');
      assert(lamalIndex === -1, 'Already received LAMal subsidy should not be suggested again');
      assert(allocationsIndex === -1, 'Already received family allowances should not be suggested again');
      assert(pcFamillesIndex === 0, 'PC Familles should stay first when other family/subside aids are already declared');
      assert(prestationsCommunalesIndex !== -1, 'Local family supports should remain visible');
      assert(carteCultureIndex !== -1, 'CarteCulture should appear as a follow-up when LAMal is already declared');
    }
  },
  {
    name: 'Couple avec enfants en emploi garde les pistes famille',
    run() {
      const results = runProfile({
        famille: 'En couple / mariée avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800'
      });
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const prestationsCommunalesIndex = indexOfResult(results, 'Prestations communales');
      const gardeMaladeIndex = indexOfResult(results, 'Garde d’enfants malades');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(pcFamillesIndex === 0, 'PC Familles should be first for a working couple with children and moderate income');
      assert(allocationsIndex === 1, 'Family allowances should stay directly after PC Familles for a couple with children');
      assert(prestationsCommunalesIndex !== -1, 'Local family supports should remain visible for a couple with children');
      assert(gardeMaladeIndex !== -1, 'Child-care emergency support should remain visible for a working couple with children');
      assert(lamalIndex === -1 || allocationsIndex < lamalIndex, 'Family tracks should appear before LAMal for a couple with children');
    }
  },
  {
    name: 'Couple avec enfants sans revenu garde RI et pistes famille',
    run() {
      const results = runProfile({
        famille: 'En couple / mariée avec enfants',
        sitPro: 'Sans emploi - sans revenu',
        enfants: 'non',
        revenu: 'aucun',
        fortune: 'moins4000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800'
      });
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      const aideAlimentaireIndex = indexOfResult(results, 'Aide alimentaire');
      const laciIndex = indexOfResult(results, 'Assurance chômage');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      assert(riIndex === 0, 'RI should be first for a couple with children and no income');
      assert(allocationsIndex !== -1, 'Family allowances should remain visible for a couple with children and no income');
      assert(aideAlimentaireIndex !== -1, 'Food support should remain visible when there is no income');
      assert(laciIndex !== -1, 'LACI should remain visible when employment history may matter');
      assert(lamalIndex === -1 || riIndex < lamalIndex, 'RI should stay before LAMal when there is no income');
    }
  },
  {
    name: 'Couple avec enfants et retard de loyer priorise urgence logement',
    run() {
      const results = runProfile({
        famille: 'En couple / mariée avec enfants',
        sitPro: 'En emploi',
        enfants: 'non',
        revenu: '2000-3500',
        fortune: '4000-8000',
        logement: 'Locataire (appartement ou maison)',
        loyer: '1200-1800',
        dettes: 'loyer'
      });
      const expulsionIndex = indexOfResult(results, 'Menace d\'expulsion');
      const csrIndex = indexOfResult(results, 'Centre social régional');
      const aidesLogementIndex = indexOfResult(results, 'Aides logement');
      const parlonsCashIndex = indexOfResult(results, 'Parlons Cash');
      const pcFamillesIndex = indexOfResult(results, 'PC Familles');
      const allocationsIndex = indexOfResult(results, 'Allocations familiales');
      assert(expulsionIndex === 0, 'Eviction warning should be first for a couple with children and rent debt');
      assert(csrIndex !== -1 && csrIndex < pcFamillesIndex, 'CSR should appear before family tracks when rent debt is active');
      assert(aidesLogementIndex !== -1 && aidesLogementIndex < pcFamillesIndex, 'Housing support should appear before family tracks when rent debt is active');
      assert(parlonsCashIndex !== -1 && parlonsCashIndex < pcFamillesIndex, 'Debt support should appear before PC Familles when rent debt is active');
      assert(allocationsIndex !== -1, 'Family allowances should still remain visible after urgent housing tracks');
    }
  },
  {
    name: 'Parcours retraité priorise PC et retire RI',
    run() {
      const results = runProfile({
        age: '65plus',
        sitPro: 'Retraité·e',
        revenu: '1000-2000',
        fortune: 'moins4000',
        primeLamal: '250-400'
      });
      const pcIndex = indexOfResult(results, 'Prestations complémentaires');
      const proSenectuteIndex = indexOfResult(results, 'Pro Senectute');
      const lamalIndex = indexOfResult(results, 'Subside LAMal');
      const riIndex = indexOfResult(results, 'Revenu d\'insertion');
      assert(pcIndex === 0, 'PC should be first for a retired low-income profile');
      assert(proSenectuteIndex !== -1 && proSenectuteIndex < lamalIndex, 'Pro Senectute should come before LAMal for retired profiles');
      assert(riIndex === -1, 'RI should not be proposed as a simulator result for retired profiles');
    }
  }
];

for (const scenario of scenarios) {
  scenario.run();
  console.log(`OK - ${scenario.name}`);
}

console.log(`\n${scenarios.length} simulator regression tests passed.`);

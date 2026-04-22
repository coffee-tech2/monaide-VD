const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const enginePath = path.join(root, 'assets/js/engine.js');
const engineCode = fs.readFileSync(enginePath, 'utf8');

const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(engineCode, context, { filename: enginePath });

const computeSimulationResults = context.window.computeSimulationResults;

if (typeof computeSimulationResults !== 'function') {
  throw new Error('computeSimulationResults is not exposed on window');
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
  procheAidant: 'non',
  santeMentale: 'non'
};

function compute(profile) {
  return computeSimulationResults({ ...baseProfile, ...profile }).results;
}

function hasResult(results, namePart, badge) {
  return results.some((item) => {
    const nameOk = item.nom && item.nom.indexOf(namePart) !== -1;
    return badge ? nameOk && item.badge === badge : nameOk;
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const tests = [
  {
    name: 'Subside LAMal actuel confirme CarteCulture',
    run() {
      const results = compute({
        sitPro: 'En emploi',
        aidesListe: ['lamal'],
        revenu: '1000-2000'
      });
      assert(hasResult(results, 'CarteCulture', 'confirme'), 'CarteCulture should be confirmed when LAMal subsidy already exists');
      assert(!hasResult(results, 'Subside LAMal'), 'Existing LAMal subsidy should not be recommended again');
    }
  },
  {
    name: 'RI actuel confirme LAMal et CarteCulture',
    run() {
      const results = compute({
        sitPro: 'Bénéficiaire du RI',
        aidesListe: ['RI']
      });
      assert(hasResult(results, 'Subside LAMal', 'confirme'), 'RI should confirm LAMal subsidy follow-up');
      assert(hasResult(results, 'CarteCulture', 'confirme'), 'RI should confirm CarteCulture');
      assert(!hasResult(results, 'Revenu d\'insertion'), 'Existing RI should not be recommended again');
    }
  },
  {
    name: 'PC actuelles confirment LAMal et CarteCulture',
    run() {
      const results = compute({
        age: '65plus',
        sitPro: 'Retraité·e (bénéficiaire AVS)',
        aidesListe: ['PC']
      });
      assert(hasResult(results, 'Subside LAMal', 'confirme'), 'PC should confirm LAMal subsidy follow-up');
      assert(hasResult(results, 'CarteCulture', 'confirme'), 'PC should confirm CarteCulture');
      assert(!hasResult(results, 'Assurance chômage'), 'Retired/PC profile should not receive LACI orientation');
    }
  },
  {
    name: 'Enfants à charge proposent les allocations familiales sans certitude abusive',
    run() {
      const results = compute({
        sitPro: 'En emploi',
        enfants: 'oui',
        revenu: '3500-5000',
        fortune: 'plus50000'
      });
      assert(hasResult(results, 'Allocations familiales', 'probable'), 'Children at charge should suggest family allowances as probable');
      assert(!hasResult(results, 'Allocations familiales', 'confirme'), 'Family allowances should not be confirmed automatically');
    }
  },
  {
    name: 'Étudiant en formation ne reçoit pas RI ordinaire',
    run() {
      const results = compute({
        age: '18-25',
        sitPro: 'Étudiant·e ou en apprentissage',
        logement: 'Chez mes parents (sans loyer)',
        loyer: '',
        formation: 'oui_apres_obligatoire',
        revenu: 'moins1000'
      });
      assert(hasResult(results, 'Bourses d\'études', 'verifier'), 'Student should receive OCBE orientation to verify because key OCBE criteria are not all asked');
      assert(!hasResult(results, 'Revenu d\'insertion'), 'Student should not receive ordinary RI result');
    }
  },
  {
    name: 'Sans emploi sans revenu reste prudent sur LACI',
    run() {
      const results = compute({
        sitPro: 'Sans emploi - sans revenu',
        revenu: 'aucun'
      });
      assert(hasResult(results, 'Assurance chômage', 'verifier'), 'Unemployed without income should be LACI to verify, not probable/confirmed');
    }
  },
  {
    name: 'Faible revenu ne confirme pas automatiquement RI',
    run() {
      const results = compute({
        sitPro: 'Sans emploi - sans revenu',
        revenu: 'aucun',
        fortune: 'moins4000'
      });
      assert(hasResult(results, 'Revenu d\'insertion', 'probable'), 'RI should be probable for low income, not confirmed');
      assert(!hasResult(results, 'Revenu d\'insertion', 'confirme'), 'RI must not be confirmed by simulator on income alone');
    }
  },
  {
    name: 'Incapacité durable propose AI sans confirmation abusive',
    run() {
      const results = compute({
        sitPro: 'En incapacité de travail (maladie / accident)',
        incapacite: 'totale'
      });
      assert(hasResult(results, 'Assurance invalidité', 'probable'), 'AI should be probable for total incapacity');
      assert(!hasResult(results, 'Assurance invalidité', 'confirme'), 'AI must not be confirmed automatically');
    }
  },
  {
    name: 'Grande commune seule ne rend pas les prestations communales probables',
    run() {
      const results = compute({
        commune: 'Lausanne',
        communeNorm: 'lausanne',
        sitPro: 'Sans emploi - sans revenu',
        enfants: 'non',
        revenu: '1000-2000',
        loyer: 'moins800',
        dettes: 'non'
      });
      assert(!hasResult(results, 'Prestations communales', 'probable'), 'Local benefits should not be probable solely because the commune is large');
      assert(hasResult(results, 'Prestations communales', 'verifier'), 'Local benefits should remain a cautious orientation when income is low');
    }
  }
];

for (const test of tests) {
  test.run();
  console.log(`OK - ${test.name}`);
}

console.log(`\n${tests.length} simulator smoke tests passed.`);

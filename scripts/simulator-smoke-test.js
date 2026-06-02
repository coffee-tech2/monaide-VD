const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const rulesPath = path.join(root, 'assets/js/simulator-rules.js');
const enginePath = path.join(root, 'assets/js/engine.js');
const rulesCode = fs.readFileSync(rulesPath, 'utf8');
const engineCode = fs.readFileSync(enginePath, 'utf8');

const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(rulesCode, context, { filename: rulesPath });
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
    name: 'Subside LAMal actuel rend CarteCulture très probable',
    run() {
      const results = compute({
        sitPro: 'En emploi',
        aidesListe: ['lamal'],
        revenu: '1000-2000'
      });
      assert(hasResult(results, 'CarteCulture', 'probable'), 'CarteCulture should be probable when LAMal subsidy already exists');
      assert(!hasResult(results, 'Subside LAMal'), 'Existing LAMal subsidy should not be recommended again');
    }
  },
  {
    name: 'Subside LAMal reste à vérifier si la fortune est élevée',
    run() {
      const results = compute({
        sitPro: 'En emploi',
        revenu: '1000-2000',
        fortune: 'plus50000',
        primeLamal: '250-400'
      });
      assert(hasResult(results, 'Subside LAMal', 'verifier'), 'High fortune should make LAMal subsidy a verification, not a probable result');
      assert(!hasResult(results, 'Subside LAMal', 'probable'), 'LAMal subsidy should not be probable when high fortune may affect RDU');
    }
  },
  {
    name: 'CarteCulture revenu faible reste prudente si la fortune est élevée',
    run() {
      const results = compute({
        sitPro: 'En emploi',
        revenu: '1000-2000',
        fortune: 'plus50000'
      });
      assert(hasResult(results, 'CarteCulture', 'verifier'), 'CarteCulture should stay to verify when low income is paired with high fortune');
      assert(!hasResult(results, 'CarteCulture', 'probable'), 'CarteCulture should not be probable on income alone when high fortune is declared');
    }
  },
  {
    name: 'PC AVS/AI reste à vérifier si la fortune est élevée',
    run() {
      const results = compute({
        age: '65plus',
        sitPro: 'Retraité·e (bénéficiaire AVS)',
        revenu: '1000-2000',
        fortune: 'plus50000',
        aidesListe: []
      });
      assert(hasResult(results, 'Prestations complémentaires', 'verifier'), 'High fortune should make PC AVS/AI a verification, not a probable result');
      assert(!hasResult(results, 'Prestations complémentaires', 'probable'), 'PC AVS/AI should not be probable when high fortune may affect the official calculation');
    }
  },
  {
    name: 'PC Familles reste à vérifier si la fortune est élevée',
    run() {
      const results = compute({
        sitPro: 'En emploi',
        enfants: 'oui',
        revenu: '1000-2000',
        fortune: 'plus50000'
      });
      assert(hasResult(results, 'PC Familles', 'verifier'), 'High fortune should make PC Familles a verification, not a probable result');
      assert(!hasResult(results, 'PC Familles', 'probable'), 'PC Familles should not be probable when high fortune may affect the official calculation');
    }
  },
  {
    name: 'Permis G garde les aides ordinaires prudentes',
    run() {
      const results = compute({
        permis: 'Permis G',
        sitPro: 'En emploi',
        revenu: '1000-2000',
        fortune: 'moins4000',
        primeLamal: '250-400'
      });
      assert(hasResult(results, 'Permis G', 'probable'), 'Frontier worker profile should receive the dedicated Permis G orientation');
      assert(!hasResult(results, 'Subside LAMal', 'probable'), 'Permis G should not receive a probable ordinary LAMal subsidy result');
      assert(!hasResult(results, 'CarteCulture', 'probable'), 'Permis G should not receive a probable ordinary CarteCulture result');
    }
  },
  {
    name: 'RI actuel rend LAMal et CarteCulture très probables',
    run() {
      const results = compute({
        sitPro: 'Bénéficiaire du RI',
        aidesListe: ['RI']
      });
      assert(hasResult(results, 'Subside LAMal', 'probable'), 'RI should make LAMal subsidy strongly probable');
      assert(hasResult(results, 'CarteCulture', 'probable'), 'RI should make CarteCulture strongly probable');
      assert(!hasResult(results, 'Revenu d\'insertion'), 'Existing RI should not be recommended again');
    }
  },
  {
    name: 'PC actuelles rendent LAMal et CarteCulture très probables',
    run() {
      const results = compute({
        age: '65plus',
        sitPro: 'Retraité·e (bénéficiaire AVS)',
        aidesListe: ['PC']
      });
      assert(hasResult(results, 'Subside LAMal', 'probable'), 'PC should make LAMal subsidy strongly probable');
      assert(hasResult(results, 'CarteCulture', 'probable'), 'PC should make CarteCulture strongly probable');
      assert(!hasResult(results, 'Assurance chômage'), 'Retired/PC profile should not receive LACI orientation');
    }
  },
  {
    name: 'PC actuelles proposent les frais maladie et invalidité à vérifier',
    run() {
      const results = compute({
        age: '65plus',
        sitPro: 'Retraité·e (bénéficiaire AVS)',
        aidesListe: ['PC']
      });
      assert(hasResult(results, 'Frais de maladie et d’invalidité', 'verifier'), 'Existing PC should suggest checking reimbursable health/disability costs');
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
      assert(!hasResult(results, 'Allocations familiales', 'confirme'), 'Family allowances should not use confirmed status');
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
      assert(hasResult(results, 'Assurance chômage', 'verifier'), 'Unemployed without income should be LACI to verify, not probable');
    }
  },
  {
    name: 'Chômage sans droit déjà ouvert reste à vérifier',
    run() {
      const results = compute({
        sitPro: 'Au chômage',
        aidesListe: []
      });
      assert(hasResult(results, 'Assurance chômage', 'verifier'), 'Potential LACI should stay to verify when unemployment benefits are not already opened');
      assert(!hasResult(results, 'Assurance chômage', 'probable'), 'Potential LACI should not be probable without asking contribution conditions');
    }
  },
  {
    name: 'Chômage déjà perçu ne ressort pas comme résultat',
    run() {
      const results = compute({
        sitPro: 'Au chômage',
        aidesListe: ['chomage']
      });
      assert(!hasResult(results, 'Assurance chômage'), 'Existing unemployment benefits should not be recommended again');
    }
  },
  {
    name: 'Faible revenu ne rend pas automatiquement le RI certain',
    run() {
      const results = compute({
        sitPro: 'Sans emploi - sans revenu',
        revenu: 'aucun',
        fortune: 'moins4000'
      });
      assert(hasResult(results, 'Revenu d\'insertion', 'probable'), 'RI should be probable for low income, not confirmed');
      assert(!hasResult(results, 'Revenu d\'insertion', 'confirme'), 'RI must never be confirmed by simulator');
    }
  },
  {
    name: 'Incapacité durable propose AI sans confirmation abusive',
    run() {
      const results = compute({
        sitPro: 'En incapacité de travail (maladie / accident)',
        incapacite: 'totale'
      });
      assert(hasResult(results, 'Assurance invalidité', 'verifier'), 'AI should stay to verify for total incapacity');
      assert(!hasResult(results, 'Assurance invalidité', 'confirme'), 'AI must never use confirmed status');
    }
  },
  {
    name: 'Proche aidant avec enfants propose AMINH sans certitude abusive',
    run() {
      const results = compute({
        enfants: 'oui',
        procheAidant: 'oui',
        revenu: '3500-5000',
        fortune: 'moins4000'
      });
      assert(hasResult(results, 'Enfant en situation de handicap', 'verifier'), 'Child + caregiver profile should suggest AMINH as a cautious path');
      assert(!hasResult(results, 'Enfant en situation de handicap', 'probable'), 'AMINH should not be probable without a direct child disability question');
    }
  },
  {
    name: 'PC Familles apparaît pour parent qui travaille avec budget insuffisant',
    run() {
      const results = compute({
        sitPro: 'En emploi',
        enfants: 'oui',
        revenu: '1000-2000',
        fortune: 'moins4000'
      });
      assert(hasResult(results, 'PC Familles', 'probable'), 'PC Familles should be suggested for a working parent with low income');
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
  },
  {
    name: 'Aide logement ne sort pas sans indice de loyer problématique',
    run() {
      const results = compute({
        logement: 'Locataire (appartement ou maison)',
        loyer: 'moins800',
        revenu: '1000-2000',
        dettes: 'non'
      });
      assert(!hasResult(results, 'Aides logement'), 'Housing aid should not appear only because income is low when rent is not flagged as an issue');
    }
  }
];

for (const test of tests) {
  test.run();
  console.log(`OK - ${test.name}`);
}

console.log(`\n${tests.length} simulator smoke tests passed.`);

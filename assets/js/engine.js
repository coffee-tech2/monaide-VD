  function normalizeCommune(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function readFieldValue(id, fallback) {
    var el = document.getElementById(id);
    return (el && el.value) || fallback || '';
  }

  function readAidesListe() {
    return readFieldValue('aides_actuelles', 'aucune')
      .split(',')
      .map(function(item) { return item.trim(); })
      .filter(Boolean);
  }

  function buildProfileSummary(commune) {
    return {
      commune: commune,
      age: getFieldDisplayValue('age'),
      famille: getFieldDisplayValue('situation_familiale'),
      statut: getFieldDisplayValue('statut_sejour'),
      travail: getFieldDisplayValue('situation_pro'),
      logement: getFieldDisplayValue('logement'),
      revenu: getFieldDisplayValue('revenu'),
      fortune: getFieldDisplayValue('fortune')
    };
  }

  window.readSimulationProfileFromForm = function() {
    var commune = readFieldValue('commune', 'non précisé');
    var aides = readFieldValue('aides_actuelles', 'aucune');
    return {
      commune: commune,
      communeNorm: normalizeCommune(commune),
      age: readFieldValue('age'),
      permis: readFieldValue('statut_sejour'),
      sitPro: readFieldValue('situation_pro'),
      logement: readFieldValue('logement'),
      loyer: readFieldValue('loyer'),
      enfants: readFieldValue('enfants', 'non'),
      formation: readFieldValue('en_formation', 'non'),
      revenu: readFieldValue('revenu'),
      fortune: readFieldValue('fortune', 'inconnu'),
      primeLamal: readFieldValue('prime_lamal'),
      aides: aides,
      aidesListe: readAidesListe(),
      incapacite: readFieldValue('incapacite', 'non'),
      dettes: readFieldValue('dettes', 'non'),
      summary: buildProfileSummary(commune)
    };
  };

  function deriveSimulationFlags(profile) {
    var communeNorm = profile.communeNorm || '';
    var age = profile.age || '';
    var permis = profile.permis || '';
    var sitPro = profile.sitPro || '';
    var logement = profile.logement || '';
    var loyer = profile.loyer || '';
    var enfants = profile.enfants || 'non';
    var formation = profile.formation || 'non';
    var revenu = profile.revenu || '';
    var fortune = profile.fortune || 'inconnu';
    var primeLamal = profile.primeLamal || '';
    var aidesListe = profile.aidesListe || [];
    var incapacite = profile.incapacite || 'non';
    var dettes = profile.dettes || 'non';

    var permisB = permis.indexOf('Permis B') !== -1;
    var permisC = permis.indexOf('Permis C') !== -1;
    var permisL = permis.indexOf('Permis L') !== -1;
    var permisG = permis.indexOf('Permis G') !== -1;
    var permisN = permis.indexOf('Permis N') !== -1;
    var permisF = permis.indexOf('Permis F') !== -1;
    var permisS = permis.indexOf('Permis S') !== -1;

    return {
      communeNorm: communeNorm,
      age: age,
      permis: permis,
      sitPro: sitPro,
      logement: logement,
      loyer: loyer,
      enfants: enfants,
      formation: formation,
      revenu: revenu,
      fortune: fortune,
      primeLamal: primeLamal,
      aidesListe: aidesListe,
      incapacite: incapacite,
      dettes: dettes,
      revenuFaible: revenu === 'aucun' || revenu === 'moins1000' || revenu === '1000-2000',
      revenuModere: revenu === '2000-3500',
      retraite: sitPro.includes('Retrait') || age === '65plus' || aidesListe.includes('AVS'),
      etudiant: sitPro.includes('tudiant') || formation !== 'non',
      enFormation: formation === 'oui_apres_obligatoire',
      aEnfants: enfants !== 'non' && enfants !== '',
      chomageIndem: sitPro === 'Au chômage' && aidesListe.includes('chomage'),
      chomageNonIndem: sitPro.indexOf('Sans emploi') !== -1 || (sitPro === 'Au chômage' && !aidesListe.includes('chomage')),
      enEmploi: sitPro === 'En emploi',
      permisB: permisB,
      permisC: permisC,
      permisL: permisL,
      permisG: permisG,
      permisN: permisN,
      permisF: permisF,
      permisS: permisS,
      sansStatut: permis.indexOf('sans statut') !== -1,
      alreadyRI: aidesListe.includes('RI'),
      alreadyPC: aidesListe.includes('PC'),
      alreadyLAMal: aidesListe.includes('lamal'),
      alreadyAF: aidesListe.includes('alloc_fam'),
      alreadyBourse: aidesListe.includes('bourse'),
      alreadyCarteCulture: aidesListe.includes('carteculture'),
      alreadyAI: aidesListe.includes('AI'),
      alreadyChomage: aidesListe.includes('chomage'),
      age60plus: age === '60-64' || age === '65plus',
      fortFaible: fortune === 'moins4000',
      fortSous50000: fortune === '4000-15000' || fortune === '15000-50000',
      loyerEleve: loyer === '1200-1800' || loyer === 'plus1800',
      primeElevee: primeLamal === '250-400' || primeLamal === 'plus400',
      urgenceActive: dettes === 'loyer' || logement.includes('Sans logement fixe'),
      grandeCommune: ['lausanne', 'renens', 'vevey', 'nyon', 'yverdon', 'montreux', 'morges'].some(function(v) { return communeNorm.includes(v); }),
      statutStableOrdinaire: permis.includes('suisse') || permisB || permisC,
      statutAvecNuance: permisF || permisL || permisS
    };
  }

  function finalizeSimulationFlags(flags) {
    flags.chomage = flags.chomageIndem || flags.chomageNonIndem;
    flags.permiOK = !flags.permisN && !flags.sansStatut;
    flags.permiRI = flags.permiOK && !flags.permisS && !flags.permisG;
    flags.invalidite = flags.incapacite !== 'non' || flags.sitPro.includes('incapacit') || flags.sitPro.includes('invalidit') || flags.alreadyAI;
    flags.carteConfirmee = flags.alreadyRI || flags.alreadyPC || flags.alreadyLAMal || flags.alreadyBourse;
    return flags;
  }

  function buildResult(base) {
    return base;
  }

  function addUrgenceOrientationResults(res) {
    res.push(buildResult({
      nom: 'Centre social régional (CSR)',
      badge: 'confirme',
      desc: 'Quand le logement ou le budget devient critique, le CSR peut faire un premier point rapidement et t’orienter vers les bons relais.',
      action: 'Contacte immédiatement ton CSR, puis l’ASLOCA Vaud si un bail est en jeu : ☏ 021 617 16 17.',
      today: 'Fais ce premier contact sans attendre un dossier complet.',
      docs: ['Pièce d’identité', 'Courriers reçus récemment', 'Contrat de bail ou factures concernées'],
      liensCSR: true
    }));
  }

  function addPermisNResults(res) {
    res.push(buildResult({
      nom: 'EVAM — Permis N, F et S',
      badge: 'confirme',
      desc: 'Avec un permis N, le premier relais passe d’abord par l’EVAM et le dispositif asile.',
      action: 'Commence par le relais EVAM qui suit déjà ton dossier. Pour les questions de statut ou de courrier, complète avec le CSP Fraternité.',
      today: 'Repère d’abord le service EVAM qui suit ton dossier.',
      docs: ['Permis N', 'Décisions SEM/SPOP ou courriers récents', 'Coordonnées du foyer ou du service EVAM'],
      liensEVAM: true
    }));
    res.push(buildResult({
      nom: 'La Fraternité CSP Vaud — questions de migration',
      badge: 'probable',
      desc: 'Utile si tu ne comprends pas un courrier, une procédure ou ce qui est possible avec ton permis.',
      action: 'Va à une permanence migration avec tes papiers et tes courriers.',
      today: 'Rassemble d’abord les courriers liés au séjour.',
      docs: ['Courriers officiels', 'Permis N', 'Questions notées à l’avance'],
      liensFraternite: true
    }));
  }

  function addPermisSResults(res) {
    res.push(buildResult({
      nom: 'EVAM — Permis N, F et S',
      badge: 'confirme',
      desc: 'Avec un permis S, il vaut mieux faire confirmer le cadre exact avant de lancer des demandes ordinaires.',
      action: 'Passe d’abord par le relais EVAM ou le service qui suit ta situation.',
      today: 'Fais confirmer d’abord le cadre de prise en charge.',
      docs: ['Permis S', 'Courriers récents', 'Pièce d’identité', 'Justificatifs de logement si tu en as'],
      liensEVAM: true
    }));
    res.push(buildResult({
      nom: 'La Fraternité CSP Vaud — questions de migration',
      badge: 'verifier',
      desc: 'Utile pour les questions sur le séjour, le renouvellement ou le travail.',
      action: 'Le CSP Fraternité peut t’aider à comprendre la bonne porte d’entrée.',
      liensFraternite: true
    }));
  }

  function addPermisFResults(res) {
    res.push(buildResult({
      nom: 'EVAM — Permis N, F et S',
      badge: 'verifier',
      desc: 'Avec un permis F, certaines aides peuvent exister, mais il faut souvent vérifier le bon cadre social et administratif.',
      action: 'Si ta situation est suivie par l’EVAM, commence par là. Pour le permis ou le séjour, ajoute si besoin le CSP Fraternité.',
      today: 'Utilise ce relais si tu hésites entre aide sociale et questions de séjour.',
      liensEVAM: true
    }));
  }

  function addPermisLResults(res) {
    res.push(buildResult({
      nom: 'Permis L — séjour de courte durée',
      badge: 'verifier',
      desc: 'Avec un permis L, la durée du séjour et le domicile réel comptent beaucoup dans l’examen d’une demande.',
      action: 'Avant une demande importante, vérifie d’abord le cadre avec le bon service.',
      today: 'Prépare surtout les preuves de séjour et de domicile.',
      docs: ['Permis L', 'Attestation de domicile si tu en as une', 'Contrat de travail ou justificatif de situation'],
      liensCadreSejour: true
    }));
  }

  function addPermisGResults(res) {
    res.push(buildResult({
      nom: 'Permis G — frontalier·ère',
      badge: 'confirme',
      desc: 'Avec un permis G, les questions d’emploi, de chômage et de cadre transfrontalier passent avant les aides sociales vaudoises ordinaires.',
      action: 'Vérifie d’abord les droits liés au travail et au chômage.',
      today: 'Clarifie d’abord résidence, employeur et couverture chômage.',
      docs: ['Permis G', 'Contrat de travail', 'Certificats de salaire ou fin de contrat', 'Adresse de résidence à l’étranger'],
      liensFrontalier: true
    }));
  }

  function addSansStatutResults(res) {
    res.push(buildResult({
      nom: 'La Fraternité CSP Vaud — questions de migration',
      badge: 'confirme',
      desc: 'Sans statut régulier, il faut d’abord clarifier les droits de base et les bons relais.',
      action: 'Va à une permanence du CSP Fraternité avec tes courriers ou tes questions.',
      today: 'Commence par cette permanence avant d’autres demandes.',
      docs: ['Courriers officiels si tu en as', 'Passeport ou pièce d’identité', 'Toute preuve de présence ou de situation'],
      liensFraternite: true
    }));
    res.push(buildResult({
      nom: 'Aide d’urgence — décision de renvoi ou sans droit de séjour',
      badge: 'confirme',
      desc: 'En cas de renvoi, de séjour sans droit ou d’absence totale de ressources, la piste pertinente est souvent l’aide d’urgence.',
      action: 'Fais vérifier cette piste et fais-toi accompagner par le CSP Fraternité.',
      today: 'Utilise cette orientation si tu n’as plus de quoi vivre.',
      docs: ['Décision de renvoi ou courriers du SPOP/SEM', 'Pièce d’identité si disponible', 'Tout document prouvant ta situation actuelle'],
      liensUrgenceSejour: true
    }));
  }

  function addProInfirmisResult(res) {
    res.push(buildResult({
      nom: 'Pro Infirmis Vaud — accompagnement gratuit',
      badge: 'verifier',
      desc: 'Tu as un handicap ou une maladie chronique ? Pro Infirmis peut t\'accompagner gratuitement dans toutes tes démarches : AI, logement, emploi, droits.',
      action: '☏ 021 321 02 00 — permanences à Lausanne, Nyon, Yverdon et Vevey. Sans rendez-vous pour les urgences.',
      today: 'Très utile si tu te sens perdu·e dans les démarches AI, logement ou emploi.',
      liensProInfirmis: true
    }));
  }

  function addProSenectuteResult(res) {
    res.push(buildResult({
      nom: 'Pro Senectute Vaud — conseil gratuit pour les 60+',
      badge: 'verifier',
      desc: 'Aide administrative, déclaration d\'impôts, droits AVS et PC, accompagnement social — tout ça gratuitement.',
      action: '☏ 021 646 17 21 — permanences dans tout le canton.',
      today: 'Appelle si tu as 60+ et que les démarches AVS/PC deviennent difficiles à gérer seul·e.',
      liensSenectute: true
    }));
  }

  function addCmsResult(res) {
    res.push(buildResult({
      nom: 'CMS — Soins et aide à domicile',
      badge: 'verifier',
      desc: 'Tu veux rester chez toi mais tu as besoin d\'aide ? Les CMS envoient des professionnel·le·s pour les soins, l\'aide quotidienne, la téléalarme. Pris en charge partiellement par ta LAMal.',
      action: '☏ AVASAD (réseau CMS Vaud) : 0800 820 830. Ou sur prescription de ton médecin.',
      today: 'À prioriser si le maintien à domicile devient compliqué.',
      liensCMS: true
    }));
  }

  function addDettesResult(res, dettes) {
    if (dettes === 'loyer') {
      res.push(buildResult({
        nom: 'Menace d\'expulsion — agis maintenant',
        badge: 'confirme',
        desc: 'C\'est une urgence. Tu as des droits et des délais légaux — mais ils sont courts.',
        action: '1. Ne quitte pas ton logement de toi-même sans avoir fait vérifier la situation.\n2. Contacte immédiatement le CSR de ta commune.\n3. Contacte l\'ASLOCA Vaud : ☏ 021 617 16 17 — ils défendent les locataires.\n4. Les délais de contestation sont souvent très courts, donc n’attends pas.',
        today: 'C’est une démarche du jour même: CSR puis ASLOCA.',
        docs: ['Courriers du bailleur ou de l’office des poursuites', 'Contrat de bail', 'Preuves de paiement ou retards'],
        liensDettes: true
      }));
      return;
    }

    res.push(buildResult({
      nom: 'Parlons Cash — dettes et surendettement',
      badge: 'verifier',
      desc: 'Si les dettes, les poursuites ou les factures te dépassent, Parlons Cash peut te donner un premier repère simple et t’aider à agir plus tôt.',
      action: '1. Regarde d’abord Parlons Cash pour comprendre quoi faire selon ta situation.\n2. Si besoin, contacte ensuite le CSP Vaud pour un appui plus direct.\n3. Plus tôt tu agis, plus les solutions sont nombreuses.',
      today: 'Commence par lister tes dettes, puis ouvre Parlons Cash ou demande un premier rendez-vous.',
      docs: ['Liste des dettes ou poursuites', 'Factures impayées', 'Budget mensuel si tu l’as'],
      liensParlonsCash: true
    }));
  }

  function addAidesLogementResult(res, grandeCommune, dettes, loyerEleve) {
    res.push(buildResult({
      nom: 'Aides logement communales ou parapubliques',
      badge: (dettes === 'loyer' || loyerEleve) ? 'probable' : 'verifier',
      desc: grandeCommune
        ? 'Dans certaines grandes communes vaudoises, il existe parfois des soutiens liés au loyer ou des aides ponctuelles quand le budget logement devient trop lourd.'
        : 'Certaines communes ou fondations proposent des soutiens liés au loyer ou au maintien dans le logement. Cela dépend beaucoup de l’endroit et de la situation.',
      action: 'Regarde d’abord le site de ta commune ou appelle ton CSR si le loyer devient difficile à assumer. Le catalogue peut ensuite te donner des pistes locales à vérifier.',
      today: 'Garde cette piste si ton loyer pèse trop lourd ou si tu crains de ne plus réussir à le tenir.',
      liensDettes: false
    }));
  }

  function addFallbackResult(res) {
    res.push(buildResult({
      nom: 'Aucune aide identifiée automatiquement',
      badge: 'verifier',
      desc: 'Ta situation ne correspond pas aux critères détectés automatiquement. Cela ne veut pas dire qu\'il n\'existe pas d\'aide pour toi.',
      action: 'Regarde les fiches du catalogue ci-dessous et contacte le service le plus proche de ta situation pour faire le point.'
    }));
  }

  function addLamalResult(res, flags) {
    if (flags.alreadyRI || flags.alreadyPC) {
      res.push(buildResult({
        nom: 'Subside LAMal — réduction de prime',
        badge: 'confirme',
        desc: 'Si tu touches déjà le RI ou les PC, le subside LAMal est normalement lié à cette situation. Le plus utile est de vérifier qu’il est bien actif et correctement appliqué.',
        action: '✔ Vérifie que le subside apparaît bien sur ta prime ou dans ta décision. Si ce n’est pas le cas, contacte ton agence AAS ou l’OVAM.',
        today: 'Regarde ta dernière décision ou appelle ton agence AAS pour vérifier que la réduction est bien active.',
        docs: ['Attestation RI ou PC', 'Police LAMal actuelle'],
        liens: true
      }));
      return;
    }

    if (flags.revenuFaible || (flags.revenuModere && flags.primeElevee)) {
      res.push(buildResult({
        nom: 'Subside LAMal — réduction de prime',
        badge: (flags.primeElevee && flags.statutStableOrdinaire) ? 'confirme' : 'probable',
        desc: (flags.permisF || flags.permisL)
          ? 'Le subside reste une piste importante, mais avec ton statut de séjour il vaut mieux faire vérifier le cadre exact par une AAS ou un relais spécialisé en plus du calcul officiel.'
          : flags.primeElevee
          ? 'Tes revenus semblent compatibles avec un subside et ta prime maladie est lourde. C’est une piste prioritaire.'
          : 'Avec ton niveau de revenus, tu remplis probablement les conditions. Le montant exact dépend de ton Revenu Déterminant Unifié (RDU), qui tient compte de tes revenus ET de ta fortune.',
        action: (flags.permisF || flags.permisL)
          ? '1. Fais le calcul officiel.\n2. Dépose ensuite la demande avec une AAS.\n3. Si la question touche aussi au séjour, ajoute une vérification auprès du CSP Fraternité.\n4. En cas de doute sur la décision, contacte l’OVAM.'
          : '1. Utilise le simulateur officiel pour estimer ton droit.\n2. Si la piste se confirme, dépose la demande en ligne ou avec une AAS.\n3. L’OVAM examinera ensuite ton dossier et rendra la décision.',
        today: 'Commence par le calcul officiel. Si tu bloques, passe par une AAS. En cas de doute sur le suivi du dossier, contacte l’OVAM.',
        docs: ['Dernière taxation si disponible', 'Police LAMal', 'Relevés de revenus'],
        liens: true,
        liensCadreSejour: flags.permisF || flags.permisL
      }));
      return;
    }

    if (flags.revenuModere || flags.revenu === 'inconnu') {
      res.push(buildResult({
        nom: 'Subside LAMal — réduction de prime',
        badge: 'verifier',
        desc: 'Un subside partiel est possible selon ta fortune et ta situation exacte. On ne peut pas se prononcer sans le calcul officiel.',
        action: 'Fais le calcul officiel. Si la piste se confirme, dépose la demande sans trop attendre. En cas de question sur le dossier, contacte une AAS ou l’OVAM.',
        today: 'Fais le test officiel avant de lancer d’autres démarches.',
        docs: ['Police LAMal', 'Revenus du ménage', 'Taxation ou estimation de revenus'],
        liens: true
      }));
    }
  }

  function addRiResult(res, flags) {
    if (flags.retraite && flags.revenuFaible && flags.fortFaible) {
      res.push(buildResult({
        nom: 'Revenu d\'insertion (RI)',
        badge: 'verifier',
        desc: 'Même à la retraite, le CSR peut évaluer si un soutien social ou un RI subsidiaire doit être examiné, surtout si les PC ne suffisent pas encore ou si la situation est urgente.',
        action: '1. Commence par la piste PC AVS/AI.\n2. En parallèle, contacte le CSR si tu n’arrives plus à couvrir les besoins de base ou si tu attends encore une décision.\n3. Le CSR pourra voir avec toi si un appui social ou un RI subsidiaire doit être examiné.',
        today: 'Garde le CSR comme filet de sécurité si les charges courantes ne passent plus.',
        docs: ['Décision AVS ou AI', 'Montant de la rente', 'Bail, primes maladie, relevés bancaires'],
        lienRI: true
      }));
      return;
    }

    if (flags.revenuFaible && flags.fortFaible) {
      res.push(buildResult({
        nom: 'Revenu d\'insertion (RI)',
        badge: flags.permisF ? 'verifier' : (flags.loyerEleve || flags.grandeCommune ? 'confirme' : 'probable'),
        desc: flags.permisF
          ? 'Tes revenus et ton épargne font ressortir le RI comme piste à examiner, mais avec un permis F il vaut mieux faire vérifier le bon cadre par le CSR et, si besoin, par un relais migration.'
          : (flags.loyerEleve || flags.grandeCommune)
          ? 'Tes revenus, ton épargne et ton contexte de vie font ressortir le RI comme une piste forte. L\'éligibilité finale dépend d\'une évaluation complète par un·e assistant·e social·e.'
          : 'Tes revenus et ton épargne correspondent aux critères de base du RI. Attention : l\'éligibilité finale dépend d\'une évaluation complète par un·e assistant·e social·e (charges, situation familiale, etc.).',
        action: flags.permisF
          ? '1. Contacte le CSR pour une évaluation complète.\n2. Précise ton statut de séjour dès le premier contact.\n3. Si la question du permis devient centrale, complète avec le CSP Fraternité.'
          : '1. Contacte le Centre Social Régional (CSR) de ta commune — c\'est gratuit et sans engagement.\n2. Prépare : pièce d\'identité, relevés de compte (3 mois), bulletins de salaire, contrat de bail.\n3. N’attends pas trop : la date du premier contact ou de la demande peut compter dans l’examen du dossier.',
        today: flags.grandeCommune
          ? 'Tu peux commencer par contacter le CSR de ta région, même sans dossier complet.'
          : 'Prépare tes relevés de compte et prends le premier contact avec le CSR.',
        docs: ['Pièce d’identité ou permis', 'Relevés de compte des 3 derniers mois', 'Bail et dernier loyer', 'Bulletins de salaire ou preuve d’absence de revenu'],
        lienRI: true,
        liensCadreSejour: flags.permisF
      }));
      return;
    }

    if (!flags.retraite && flags.revenuFaible && flags.fortune !== 'plus50000') {
      res.push(buildResult({
        nom: 'Revenu d\'insertion (RI)',
        badge: 'verifier',
        desc: flags.permisF
          ? 'Tes revenus sont faibles, mais avec ton statut de séjour et ta fortune, seul un examen individualisé permet de savoir si le RI est envisageable.'
          : 'Tes revenus sont faibles mais ta fortune pourrait impacter l\'éligibilité. Seul un·e assistant·e social·e peut se prononcer.',
        action: flags.permisF
          ? 'Contacte le CSR pour un entretien d’évaluation et ajoute une vérification migration si nécessaire.'
          : 'Contacte le CSR de ta commune pour un entretien d\'évaluation gratuit et confidentiel.',
        today: 'Demande un entretien d’évaluation et annonce clairement tes revenus, ton loyer et ta situation familiale.',
        docs: ['Relevés de compte', 'Taxation ou attestations de fortune', 'Bail ou charges du ménage'],
        lienRI: true,
        liensCadreSejour: flags.permisF
      }));
    }
  }

  function addPcResult(res, flags) {
    res.push(buildResult({
      nom: 'Prestations complémentaires AVS/AI (PC)',
      badge: flags.revenuFaible ? 'probable' : 'verifier',
      desc: 'Les PC complètent une rente AVS ou AI quand elle ne suffit pas pour couvrir les besoins de base. Le droit dépend surtout de la rente, du loyer, des primes maladie, des autres revenus et de la fortune.',
      action: '1. Demande d’abord un calcul estimatif ou des explications à ton agence AAS.\n2. Si la piste se confirme, dépose la demande officielle auprès de l’agence AAS de ta région.\n3. La Caisse AVS Vaud examine ensuite le dossier et rend la décision.',
      today: 'Commence par faire vérifier le calcul avec ton agence AAS.',
      docs: ['Décision AVS ou AI', 'Montant de la rente', 'Bail, primes maladie, relevés bancaires'],
      liensPC: true
    }));
  }

  function addAllocationsFamilialesResult(res) {
    res.push(buildResult({
      nom: 'Allocations familiales',
      badge: 'probable',
      desc: 'Si tu as des enfants à charge et que tu ne reçois pas déjà les allocations familiales, cette piste vaut la peine d’être vérifiée. La porte d’entrée dépend de ta situation professionnelle.',
      action: '• Salarié·e : demande via ton employeur ou sa caisse.\n• Au chômage : adresse-toi à ta caisse de chômage pour le supplément correspondant.\n• Sans activité lucrative : passe par une AAS si les conditions sont remplies.\n• Les montants et le droit exact dépendent aussi de la situation de l’autre parent.',
      today: 'Vérifie d’abord par quelle caisse ou quel organisme ta situation doit passer, puis prépare les justificatifs des enfants.',
      docs: ['Pièces d’identité des parents', 'Actes de naissance des enfants', 'Attestation de formation si 16–25 ans'],
      liensAF: true
    }));
  }

  function addCarteCultureResult(res, flags) {
    if (flags.carteConfirmee && !flags.alreadyCarteCulture) {
      res.push(buildResult({
        nom: 'CarteCulture — Caritas',
        badge: 'confirme',
        desc: 'Si tu touches déjà le RI, les PC, un subside LAMal ou une bourse, la CarteCulture est en principe une piste très forte sur présentation du bon justificatif. Elle donne accès à de nombreuses offres culturelles, sportives et de loisirs à prix réduit.',
        action: '1. Demande ta carte sur carteculture.ch ou auprès de Caritas Vaud.\n2. Prépare le justificatif correspondant à ta situation (attestation RI, PC, décision de subside, etc.) et une photo d\'identité.\n3. La carte est gratuite.',
        today: 'Fais la demande quand ton aide principale est confirmée, c’est rapide et gratuit.',
        docs: ['Justificatif d’aide actuelle', 'Photo d’identité'],
        liensCarte: true
      }));
      return;
    }

    if (flags.revenuFaible && !flags.alreadyCarteCulture) {
      res.push(buildResult({
        nom: 'CarteCulture — Caritas',
        badge: 'probable',
        desc: 'Avec tes revenus, tu pourrais être éligible à la CarteCulture (seuil : revenu inférieur au minimum vital).',
        action: 'Contacte Caritas Vaud pour vérifier ton éligibilité — c\'est gratuit.',
        today: 'Garde cette piste pour juste après les aides financières prioritaires.',
        liensCarte: true
      }));
    }
  }

  function addLaciResult(res, flags) {
    res.push(buildResult({
      nom: 'Assurance chômage (LACI)',
      badge: (flags.permisL || flags.permisG || flags.permisF || flags.permisS) ? 'verifier' : 'probable',
      desc: (flags.permisL || flags.permisG || flags.permisF || flags.permisS)
        ? 'Le chômage reste une piste possible, mais avec ton statut ou ton cadre de séjour, il faut vérifier plus finement les conditions de cotisation, de domicile et l’autorité compétente.'
        : 'Tu pourrais avoir droit aux indemnités chômage si tu remplis les conditions : avoir cotisé à l\'AVS pendant au moins 12 mois dans les 2 dernières années, être domicilié·e en Suisse, être disponible pour un emploi à plein temps.',
      action: (flags.permisL || flags.permisG || flags.permisF || flags.permisS)
        ? 'Inscris-toi rapidement ou fais vérifier ta situation auprès du chômage / ORP, mais pars du principe qu’une vérification individualisée sera nécessaire.'
        : '⚠ Attention : n’attends pas pour t’inscrire à l’ORP, car un retard peut faire perdre des indemnités.\n1. Inscris-toi rapidement à l’ORP en ligne.\n2. Prépare : certificat de travail, attestation de l’employeur, pièce d’identité.\n3. Le montant de l’indemnité est souvent de 70% du gain assuré, parfois 80% selon la situation.',
      today: 'Si ton contrat est terminé ou va se terminer, l’inscription ORP est une priorité.',
      docs: ['Certificat de travail', 'Attestation de l’employeur', 'Pièce d’identité ou permis'],
      liensLACI: true,
      liensCadreSejour: flags.permisL || flags.permisF || flags.permisS,
      liensFrontalier: flags.permisG
    }));
  }

  function addRentePontResult(res, flags) {
    if (flags.age60plus && flags.chomage && (flags.fortFaible || flags.fortSous50000)) {
      res.push(buildResult({
        nom: 'Rente-pont AVS — l\'aide la plus méconnue',
        badge: 'probable',
        desc: 'Si tu as 60 ans ou plus et que tes droits au chômage s’épuisent, la rente-pont peut devenir une piste importante. Le montant dépend ensuite du calcul fait sur ta situation.',
        action: '1. Conditions principales à vérifier : 400 indemnités chômage épuisées, 20 ans de cotisation AVS dont 5 après 50 ans, fortune sous le seuil prévu.\n2. Fais la demande auprès de ta caisse AVS dès la fin de tes droits chômage.\n3. N’attends pas trop : la date de dépôt peut compter.',
        today: 'Ne laisse pas passer cette piste si tu approches de la fin du chômage.',
        docs: ['Décisions chômage', 'Extrait AVS si possible', 'Relevés de fortune'],
        liensRentePont: true
      }));
      return;
    }

    if (flags.age === '50-59' && flags.chomage) {
      res.push(buildResult({
        nom: 'Rente-pont AVS — à anticiper',
        badge: 'verifier',
        desc: 'La rente-pont n\'est pas encore accessible à ton âge, mais pense à cotiser à l\'AVS maintenant pour y avoir droit à 60 ans si besoin.',
        action: 'Renseigne-toi dès maintenant pour anticiper.',
        liensRentePont: true
      }));
    }
  }

  function addOcbeResult(res, flags) {
    res.push(buildResult({
      nom: 'Bourses d\'études — OCBE',
      badge: (flags.permisL || flags.permisS || flags.permisF) ? 'verifier' : (flags.revenuFaible ? 'probable' : 'verifier'),
      desc: (flags.permisL || flags.permisS || flags.permisF)
        ? 'Tu es en formation post-obligatoire. Une bourse peut être possible, mais le titre de séjour fait partie des critères examinés par l’OCBE avec la situation financière.'
        : 'Tu es en formation post-obligatoire (CFC, maturité, HES, université…). Une bourse est possible selon les ressources de ta famille — il n\'y a pas de critère de mérite, seulement financier.',
      action: '1. Commence par le questionnaire d\'éligibilité OCBE.\n2. Dépose ensuite la demande même si certaines pièces manquent encore.\n3. Jet Service (CSP Vaud) peut aider à remplir le dossier.\n4. Si la bourse ne passe pas ou ne suffit pas, regarde aussi les pistes privées et aides ponctuelles liées au financement de la formation.',
      today: 'Commence par l’OCBE, puis fais-toi aider si besoin pour compléter le dossier sans attendre qu’il soit parfait.',
      docs: ['Attestation de formation', 'Déclaration d’impôts du ménage ou des parents', 'Bail si tu vis seul·e'],
      liensBourse: true,
      liensCadreSejour: flags.permisL || flags.permisS || flags.permisF
    }));
  }

  function addAiResult(res, flags) {
    res.push(buildResult({
      nom: 'Assurance invalidité (AI)',
      badge: (flags.incapacite === 'totale' && !flags.statutAvecNuance) ? 'probable' : 'verifier',
      desc: (flags.permisF || flags.permisL || flags.permisS)
        ? 'L’AI peut rester une piste en cas d’incapacité durable, mais avec ton statut il faut souvent vérifier plus finement les conditions d’assurance, de cotisation et de séjour.'
        : flags.incapacite === 'totale'
        ? 'Ton niveau d\'incapacité correspond probablement aux critères AI. L\'objectif premier de l\'AI est la réadaptation avant la rente — elle peut financer ta formation, tes aides techniques, ton retour au travail.'
        : 'Selon ton taux d\'incapacité, tu pourrais avoir droit à des mesures de réadaptation ou à une rente partielle.',
      action: (flags.permisF || flags.permisL || flags.permisS)
        ? 'Dépose quand même la demande si la piste est sérieuse, mais prévois une vérification complémentaire sur le cadre d’assurance et de séjour.'
        : '⚠ Important : la date de dépôt compte beaucoup en AI. Selon la prestation et la situation, les règles de naissance du droit ou l\'effet rétroactif ne sont pas les mêmes, donc ne repousse pas la demande.\n1. Télécharge le formulaire 001.303 sur aivd.ch.\n2. Dépose-le même incomplet — l\'AIVD te contactera pour compléter.\n3. ☏ Office AI Vaud : 021 342 91 11',
      today: 'Si ton incapacité dure, dépose la demande sans attendre d’avoir un dossier “parfait”.',
      docs: ['Certificats médicaux', 'Pièce d’identité', 'Historique professionnel récent'],
      liensAI: true,
      liensCadreSejour: flags.permisF || flags.permisL || flags.permisS
    }));
  }

  window.computeSimulationResults = function(profile) {
    profile = profile || {};
    var flags = finalizeSimulationFlags(deriveSimulationFlags(profile));
    var res = [];
    var age = flags.age;
    var logement = flags.logement;
    var incapacite = flags.incapacite;
    var dettes = flags.dettes;
    var revenuFaible = flags.revenuFaible;
    var retraite = flags.retraite;
    var etudiant = flags.etudiant;
    var enFormation = flags.enFormation;
    var aEnfants = flags.aEnfants;
    var chomageNonIndem = flags.chomageNonIndem;
    var enEmploi = flags.enEmploi;
    var permisN = flags.permisN;
    var permisS = flags.permisS;
    var sansStatut = flags.sansStatut;
    var permiRI = flags.permiRI;
    var alreadyRI = flags.alreadyRI;
    var alreadyPC = flags.alreadyPC;
    var alreadyLAMal = flags.alreadyLAMal;
    var alreadyAF = flags.alreadyAF;
    var alreadyBourse = flags.alreadyBourse;
    var alreadyAI = flags.alreadyAI;
    var alreadyChomage = flags.alreadyChomage;
    var invalidite = flags.invalidite;
    var loyerEleve = flags.loyerEleve;
    var urgenceActive = flags.urgenceActive;
    var grandeCommune = flags.grandeCommune;

    if (urgenceActive) addUrgenceOrientationResults(res);
    if (permisN) addPermisNResults(res);
    if (permisS) addPermisSResults(res);
    if (flags.permisF) addPermisFResults(res);
    if (flags.permisL) addPermisLResults(res);
    if (flags.permisG) addPermisGResults(res);
    if (sansStatut) addSansStatutResults(res);

    if (!alreadyLAMal && !sansStatut && !permisN && !permisS) addLamalResult(res, flags);
    if (!alreadyRI && !alreadyPC && !etudiant && permiRI && !enEmploi) addRiResult(res, flags);
    if ((retraite || alreadyAI) && !alreadyPC) addPcResult(res, flags);
    if (aEnfants && !alreadyAF) addAllocationsFamilialesResult(res);
    addCarteCultureResult(res, flags);
    if (chomageNonIndem && !alreadyChomage && !permisN && !sansStatut) addLaciResult(res, flags);
    addRentePontResult(res, flags);
    if (enFormation && !alreadyBourse) addOcbeResult(res, flags);
    if (incapacite !== 'non' && !alreadyAI) addAiResult(res, flags);

    if (invalidite && !retraite) addProInfirmisResult(res);
    if (retraite || age === '65plus') addProSenectuteResult(res);
    if (invalidite) addCmsResult(res);
    if (dettes !== 'non') addDettesResult(res, dettes);
    if (logement.includes('Locataire') && !alreadyRI && (loyerEleve || dettes === 'loyer' || revenuFaible)) {
      addAidesLogementResult(res, grandeCommune, dettes, loyerEleve);
    }
    if (res.length === 0) addFallbackResult(res);

    return {
      results: res,
      context: {
        enEmploi: enEmploi
      }
    };
  };

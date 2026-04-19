  function normalizeCommune(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function readFieldValue(id, fallback) {
    var el = document.getElementById(id);
    if (el && el.value) return el.value;
    var checked = document.querySelector('input.choice-input[name="' + id + '"]:checked');
    if (checked && checked.value) return checked.value;
    return fallback || '';
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
      fortune: getFieldDisplayValue('fortune'),
      separation: readFieldValue('separation_en_cours', 'non') === 'oui' ? 'Oui' : '',
      protection: readFieldValue('besoin_protection', 'non') === 'oui' ? 'Oui' : '',
      procheAidant: readFieldValue('proche_aidant', 'non') === 'oui' ? 'Oui' : ''
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
      separationEnCours: readFieldValue('separation_en_cours', 'non'),
      besoinProtection: readFieldValue('besoin_protection', 'non'),
      procheAidant: readFieldValue('proche_aidant', 'non'),
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
    var separationEnCours = profile.separationEnCours || 'non';
    var besoinProtection = profile.besoinProtection || 'non';
    var procheAidant = profile.procheAidant || 'non';

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
      separationEnCours: separationEnCours,
      besoinProtection: besoinProtection,
      procheAidant: procheAidant,
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
      alreadyRI: aidesListe.includes('RI') || sitPro === 'Bénéficiaire du RI',
      alreadyPC: aidesListe.includes('PC'),
      alreadyLAMal: aidesListe.includes('lamal'),
      alreadyAF: aidesListe.includes('alloc_fam'),
      alreadyBourse: aidesListe.includes('bourse'),
      alreadyCarteCulture: aidesListe.includes('carteculture'),
      alreadyAI: aidesListe.includes('AI'),
      alreadyAVS: aidesListe.includes('AVS'),
      alreadyChomage: aidesListe.includes('chomage'),
      age60plus: age === '60-64' || age === '65plus',
      fortFaible: fortune === 'moins4000',
      fortSous50000: ['4000-8000', '8000-15000', '15000-30000', '30000-50000'].indexOf(fortune) !== -1,
      loyerEleve: loyer === '1200-1800' || loyer === 'plus1800',
      primeElevee: primeLamal === '250-400' || primeLamal === 'plus400',
      urgenceActive: dettes === 'loyer' || logement.includes('Sans logement fixe'),
      grandeCommune: ['lausanne', 'renens', 'vevey', 'nyon', 'yverdon', 'montreux', 'morges'].some(function(v) { return communeNorm.includes(v); }),
      statutStableOrdinaire: permis.includes('suisse') || permisB || permisC,
      statutAvecNuance: permisF || permisL || permisS,
      besoinAlimentaireProbable: revenu === 'aucun' || revenu === 'moins1000' || dettes === 'surendette',
      besoinLocalConcret: enfants !== 'non' || dettes !== 'non' || loyer === 'plus1800' || logement.includes('Sans logement fixe')
    };
  }

  function finalizeSimulationFlags(flags) {
    flags.chomage = flags.chomageIndem || flags.chomageNonIndem;
    flags.permiOK = !flags.permisN && !flags.sansStatut;
    flags.permiRI = flags.permiOK && !flags.permisS && !flags.permisG && !flags.permisL;
    flags.invalidite = flags.incapacite !== 'non' || flags.sitPro.includes('incapacit') || flags.sitPro.includes('invalidit') || flags.alreadyAI;
    flags.carteConfirmee = flags.alreadyRI || flags.alreadyPC || flags.alreadyLAMal || flags.alreadyBourse;
    return flags;
  }

  function buildResult(base) {
    return base;
  }

  function dedupeResults(results) {
    var seen = {};
    return (results || []).filter(function(item) {
      if (!item || !item.nom) return false;
      if (seen[item.nom]) return false;
      seen[item.nom] = true;
      return true;
    });
  }

  function addUrgenceOrientationResults(res) {
    res.push(buildResult({
      nom: 'Centre social régional (CSR)',
      badge: 'confirme',
      desc: 'Quand le logement ou le budget devient critique, le CSR peut faire un premier point rapidement et t’orienter vers les bons relais.',
      action: '1. Contacte le CSR de ta commune et dis clairement que la situation devient urgente.\n2. Prépare les courriers récents, le bail ou les factures concernées.\n3. Si un bail ou une expulsion est en jeu, contacte aussi l’ASLOCA Vaud : ☏ 021 617 16 17.\n4. Ne quitte pas ton logement ou une procédure sans avoir fait vérifier tes options.',
      today: 'Fais ce premier contact sans attendre un dossier complet.',
      docs: ['Pièce d’identité', 'Courriers reçus récemment', 'Contrat de bail ou factures concernées'],
      liensCSR: true
    }));
  }

  function addPermisNResults(res) {
    res.push(buildResult({
      nom: 'EVAM — Permis N, F et S',
      badge: 'confirme',
      desc: 'Avec un permis N, le premier relais passe généralement par l’EVAM et le dispositif asile.',
      action: '1. Commence par le relais EVAM qui suit déjà ton dossier.\n2. Rassemble ton permis N, les courriers SEM/SPOP et les documents du foyer ou du service EVAM.\n3. Si tu ne comprends pas une décision ou une procédure, ajoute une permanence du CSP Fraternité.\n4. Note tes questions avant le rendez-vous pour ne rien oublier.',
      today: 'Repère d’abord le service EVAM qui suit ton dossier.',
      docs: ['Permis N', 'Décisions SEM/SPOP ou courriers récents', 'Coordonnées du foyer ou du service EVAM'],
      liensEVAM: true
    }));
    res.push(buildResult({
      nom: 'La Fraternité CSP Vaud — questions de migration',
      badge: 'probable',
      desc: 'Utile si tu ne comprends pas un courrier, une procédure ou ce qui est possible avec ton permis.',
      action: '1. Va à une permanence migration avec tes papiers et tes courriers.\n2. Apporte les décisions officielles, même si tu ne les comprends pas encore.\n3. Explique ce que tu veux clarifier : permis, travail, logement, aide sociale ou courrier reçu.\n4. Demande quelle démarche faire en premier, pas tout en même temps.',
      today: 'Rassemble d’abord les courriers liés au séjour.',
      docs: ['Courriers officiels', 'Permis N', 'Questions notées à l’avance'],
      liensFraternite: true
    }));
  }

  function addPermisSResults(res) {
    res.push(buildResult({
      nom: 'EVAM — Permis N, F et S',
      badge: 'confirme',
      desc: 'Avec un permis S, il vaut mieux faire confirmer le cadre exact avant de lancer des démarches ordinaires.',
      action: '1. Passe d’abord par le relais EVAM ou le service qui suit ta situation.\n2. Demande quelles aides passent par le cadre permis S et lesquelles passent par les services ordinaires.\n3. Garde tes courriers et justificatifs de logement/revenus ensemble.\n4. Si tu reçois des informations contradictoires, fais relire la situation par le CSP Fraternité.',
      today: 'Fais confirmer d’abord le cadre de prise en charge.',
      docs: ['Permis S', 'Courriers récents', 'Pièce d’identité', 'Justificatifs de logement si tu en as'],
      liensEVAM: true
    }));
    res.push(buildResult({
      nom: 'La Fraternité CSP Vaud — questions de migration',
      badge: 'verifier',
      desc: 'Utile pour les questions sur le séjour, le renouvellement ou le travail.',
      action: '1. Contacte le CSP Fraternité si tu ne sais pas quelle porte utiliser.\n2. Prépare ton permis, les courriers récents et une liste courte de questions.\n3. Demande surtout quelle démarche est prioritaire selon ton statut.',
      liensFraternite: true
    }));
  }

  function addPermisFResults(res) {
    res.push(buildResult({
      nom: 'EVAM — Permis N, F et S',
      badge: 'verifier',
      desc: 'Avec un permis F, certaines aides peuvent exister, mais il faut souvent vérifier le bon cadre social et administratif.',
      action: '1. Si ta situation est suivie par l’EVAM, commence par là.\n2. Demande si la question concerne l’aide sociale, le séjour ou les deux.\n3. Si le permis ou une décision officielle est au centre du problème, complète avec le CSP Fraternité.\n4. Garde une copie des courriers et note les dates importantes.',
      today: 'Utilise ce relais si tu hésites entre aide sociale et questions de séjour.',
      liensEVAM: true
    }));
  }

  function addPermisLResults(res) {
    res.push(buildResult({
      nom: 'Permis L — séjour de courte durée',
      badge: 'verifier',
      desc: 'Avec un permis L, la durée du séjour et le domicile réel comptent beaucoup dans l’examen d’une demande.',
      action: '1. Avant une demande importante, vérifie d’abord ton cadre de séjour.\n2. Prépare ton permis L, ton contrat de travail et une attestation de domicile si tu en as une.\n3. Demande explicitement si la durée du séjour change l’accès à l’aide demandée.\n4. Si plusieurs services se renvoient la balle, demande une orientation écrite ou un contact précis.',
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
      action: '1. Clarifie d’abord ton pays de résidence, ton employeur et ton dernier lieu de travail.\n2. Garde ton permis G, ton contrat et les documents de fin d’emploi.\n3. Demande à l’ORP ou à une caisse de chômage quelle autorité est compétente.\n4. Vérifie aussi la couverture maladie et les droits liés au travail avant de chercher une aide sociale ordinaire.',
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
      action: '1. Va à une permanence du CSP Fraternité avant de lancer plusieurs démarches seul·e.\n2. Apporte passeport/pièce d’identité si tu en as, courriers officiels et preuves de présence ou de situation.\n3. Dis clairement s’il y a urgence : logement, santé, revenu, sécurité.\n4. Demande quelle aide de base est possible sans te mettre en difficulté.',
      today: 'Commence par cette permanence avant d’autres demandes.',
      docs: ['Courriers officiels si tu en as', 'Passeport ou pièce d’identité', 'Toute preuve de présence ou de situation'],
      liensFraternite: true
    }));
    res.push(buildResult({
      nom: 'Aide d’urgence — décision de renvoi ou sans droit de séjour',
      badge: 'confirme',
      desc: 'En cas de renvoi, de séjour sans droit ou d’absence totale de ressources, la piste pertinente est souvent l’aide d’urgence.',
      action: '1. Fais vérifier cette piste avec le CSP Fraternité ou le service indiqué dans les courriers reçus.\n2. Apporte les décisions de renvoi, courriers SPOP/SEM et tout document utile.\n3. Si tu n’as plus de quoi vivre, dis-le clairement dès le premier contact.\n4. Demande où dormir, manger et recevoir le courrier si ta situation est instable.',
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
      action: '1. Contacte Pro Infirmis Vaud : ☏ 021 321 02 00.\n2. Explique en une phrase ce qui bloque : AI, logement, travail, budget, mobilité ou démarches administratives.\n3. Prépare les courriers AI/médicaux si tu en as déjà.\n4. Si la situation est urgente, demande une permanence ou le lieu le plus proche.',
      docs: ['Courriers AI ou médicaux si disponibles', 'Pièce d’identité', 'Questions principales notées à l’avance'],
      today: 'Très utile si tu te sens perdu·e dans les démarches AI, logement ou emploi.',
      liensProInfirmis: true
    }));
  }

  function addProSenectuteResult(res) {
    res.push(buildResult({
      nom: 'Pro Senectute Vaud — conseil gratuit pour les 60+',
      badge: 'verifier',
      desc: 'Aide administrative, déclaration d\'impôts, questions AVS ou PC, accompagnement social : une bonne porte si les démarches deviennent lourdes.',
      action: '1. Contacte Pro Senectute Vaud : ☏ 021 646 17 21.\n2. Demande un conseil social si les démarches AVS, PC, impôts ou budget deviennent difficiles.\n3. Prépare les décisions AVS/PC, bail, primes maladie et courriers récents.\n4. Si tu aides un proche âgé, demande aussi les possibilités de soutien et de relève.',
      docs: ['Décision AVS ou PC', 'Bail et primes maladie', 'Courriers administratifs récents'],
      today: 'Appelle si tu as 60+ et que les démarches AVS/PC deviennent difficiles à gérer seul·e.',
      liensSenectute: true
    }));
  }

  function addCmsResult(res) {
    res.push(buildResult({
      nom: 'CMS — Soins et aide à domicile',
      badge: 'verifier',
      desc: 'Les CMS peuvent aider pour les soins, le maintien à domicile ou certaines aides du quotidien. Le financement dépend ensuite de la prestation et de la couverture.',
      action: '1. Si le besoin est médical, parle d’abord à ton médecin pour une prescription.\n2. Tu peux aussi contacter l’AVASAD / réseau CMS Vaud : 0800 820 830.\n3. Explique ce qui devient difficile à domicile : soins, toilette, repas, ménage, sécurité, mobilité.\n4. Demande quelles prestations sont évaluées et comment elles sont financées.',
      docs: ['Ordonnance ou certificat médical si disponible', 'Carte d’assurance maladie', 'Liste des besoins à domicile'],
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
      action: '1. Regarde le site de ta commune, rubrique aide sociale, logement ou prestations.\n2. Si tu ne trouves rien, appelle le CSR et demande s’il existe une aide locale liée au logement.\n3. Prépare ton bail, ton dernier loyer et une estimation de tes revenus.\n4. Si tu as reçu un rappel ou une menace d’expulsion, traite plutôt cela comme une urgence.',
      docs: ['Contrat de bail', 'Dernier avis de loyer', 'Revenus actuels ou budget mensuel'],
      today: 'Garde cette piste si ton loyer pèse trop lourd ou si tu crains de ne plus réussir à le tenir.',
      liensDettes: false
    }));
  }

  function addPrestationsCommunalesResult(res, flags) {
    res.push(buildResult({
      nom: 'Prestations communales et aides locales',
      badge: (flags.aEnfants || flags.grandeCommune) ? 'probable' : 'verifier',
      desc: flags.aEnfants
        ? 'Selon la commune, il existe parfois des aides concrètes pour les familles : garde, loisirs, couches, repas ou frais du quotidien.'
        : 'Certaines communes proposent des aides ponctuelles ou locales que le simulateur ne peut pas confirmer automatiquement.',
      action: '1. Va sur le site de ta commune et cherche “aide sociale”, “prestations”, “familles”, “subsides” ou “fonds”.\n2. Note les aides concrètes possibles : déchets, couches, garde, sport, mobilité, repas, vélo, activités.\n3. Si le site n’est pas clair, appelle le greffe communal ou le CSR et demande où poser la question.\n4. Garde les factures ou justificatifs liés aux frais concernés.',
      docs: ['Factures ou justificatifs du frais concerné', 'Budget ou preuve de revenu si demandé', 'Composition du ménage'],
      today: 'Garde cette piste surtout si tu as des enfants, des frais du quotidien lourds ou si tu vis dans une grande commune.',
      liensCommunes: true
    }));
  }

  function addGardeEnfantsMaladesResult(res, flags) {
    res.push(buildResult({
      nom: 'Garde d’enfants malades — soutien ponctuel aux parents',
      badge: 'verifier',
      desc: 'Quand un enfant tombe malade et qu’aucun parent ne peut rester à domicile, il existe parfois des relais ponctuels à demander selon les conditions du service.',
      action: '1. Vérifie les conditions de la Croix-Rouge vaudoise ou d’un relais parental de ta région.\n2. Prépare l’âge de l’enfant, le motif de garde et la durée probable du besoin.\n3. Demande le tarif, les délais et les conditions avant de compter dessus.\n4. Si le problème revient souvent, demande aussi une orientation plus globale via le CSR ou la commune.',
      docs: ['Âge de l’enfant', 'Attestation ou information médicale si disponible', 'Horaires de travail ou formation concernés'],
      today: 'Garde cette piste comme solution pratique si un enfant malade bloque le travail, la formation ou l’organisation familiale.',
      liensGardeEnfants: true
    }));
  }

  function addAideAlimentaireRegionResult(res, flags) {
    res.push(buildResult({
      nom: 'Aide alimentaire par région',
      badge: flags.revenu === 'aucun' ? 'probable' : 'verifier',
      desc: 'Si le budget ne suffit plus pour manger correctement, il existe des distributions, épiceries sociales ou relais alimentaires à chercher près de chez toi.',
      action: '1. Cherche d’abord une distribution ou épicerie sociale proche de ta commune.\n2. Vérifie les horaires, les conditions d’accès et s’il faut une attestation.\n3. Si tu n’as plus assez pour manger régulièrement, contacte aussi le CSR ou une permanence sociale.\n4. Garde cette piste comme aide immédiate, mais traite en parallèle la cause du manque de revenu.',
      docs: ['Pièce d’identité si demandée', 'Attestation sociale si disponible', 'Sac/cabas et horaires du lieu choisi'],
      today: 'Utilise cette piste surtout si la nourriture devient une difficulté immédiate.',
      liensAideAlimentaire: true
    }));
  }

  function addSeparationResult(res, flags) {
    res.push(buildResult({
      nom: 'Séparation, divorce et premiers repères',
      badge: flags.aEnfants ? 'probable' : 'verifier',
      desc: flags.aEnfants
        ? 'Quand une séparation commence avec des enfants, il faut souvent clarifier rapidement pension, garde, budget et premières démarches.'
        : 'Quand une séparation ou un divorce commence, il est utile de clarifier rapidement les premiers repères administratifs et financiers.',
      action: flags.aEnfants
        ? '1. Fais une liste courte des sujets urgents : garde, pension, logement, budget, assurances.\n2. Si une pension alimentaire n’est pas versée, regarde rapidement la piste BRAPA.\n3. Prépare les décisions existantes, conventions, preuves de revenus et frais des enfants.\n4. Si la séparation crée une urgence financière ou de logement, contacte aussi le CSR.'
        : '1. Clarifie d’abord ce qui change concrètement : logement, budget, assurances, dettes, courrier.\n2. Rassemble les documents importants avant les rendez-vous.\n3. Si tu ne sais pas par quoi commencer, demande une permanence sociale ou juridique pour trier les priorités.',
      docs: flags.aEnfants
        ? ['Jugement ou convention si existant', 'Preuves de pension payée ou non payée', 'Frais et documents des enfants']
        : ['Bail ou documents logement', 'Revenus actuels', 'Courriers administratifs liés à la séparation'],
      liensSeparation: true
    }));
  }

  function addViolenceProtectionResult(res) {
    res.push(buildResult({
      nom: 'Violences conjugales / besoin de protection',
      badge: 'confirme',
      desc: 'Si tu vis de la violence ou que tu as besoin de protection, la priorité est la sécurité et l’accès à un relais spécialisé.',
      action: '1. Si le danger est immédiat, appelle le 117. En cas de blessure ou d’urgence médicale, appelle le 144.\n2. Si tu peux parler en sécurité, contacte MalleyPrairie au 021 620 76 76 pour conseil, évaluation du danger ou mise à l’abri.\n3. Contacte ensuite la LAVI pour connaître tes droits, les aides possibles et l’accompagnement, même sans plainte déposée.\n4. Garde messages, constats ou certificats uniquement si c’est sans danger. Ne prends pas de risque pour récupérer des affaires ou des papiers.',
      docs: ['Pièce d’identité si disponible', 'Messages ou preuves uniquement si c’est sans danger', 'Certificats médicaux ou constats si existants', 'Adresse ou lieu sûr où te rappeler si possible'],
      liensViolence: true
    }));
  }

  function addProchesAidantsResult(res) {
    res.push(buildResult({
      nom: 'Proches aidant·es — répit et aides concrètes',
      badge: 'verifier',
      desc: 'Si tu aides régulièrement un proche, il existe dans le canton des soutiens concrets : Espace Proches, CMS, carte d’urgence, relève, congés et parfois aides financières.',
      action: '1. Note concrètement ce que tu fais pour le proche : soins, repas, administratif, présence, déplacements, surveillance.\n2. Appelle Espace Proches au 0800 660 660 pour faire le tri gratuitement.\n3. Si la personne aidée vit à domicile, contacte aussi le CMS pour demander une évaluation, une carte d’urgence proche aidant ou une relève.\n4. Si tu as réduit ou arrêté ton activité pour aider, demande explicitement si une aide financière ou un congé proche aidant est possible.',
      docs: ['Coordonnées du proche aidé', 'Courriers médicaux ou CMS si disponibles', 'Liste des tâches d’aide au quotidien', 'Preuve de réduction d’activité ou perte de revenu si concerné·e'],
      liensProchesAidants: true
    }));
  }

  function addFallbackResult(res) {
    res.push(buildResult({
      nom: 'Aucune aide identifiée automatiquement',
      badge: 'verifier',
      desc: 'Ta situation ne correspond pas aux critères détectés automatiquement. Cela ne veut pas dire qu\'il n\'existe pas d\'aide pour toi.',
      action: '1. Ouvre le catalogue et cherche par besoin : santé, logement, revenu, formation, migration ou urgence.\n2. Si tu hésites entre plusieurs portes, commence par le CSR ou Vaud pour vous.\n3. Note ta situation en trois lignes avant d’appeler : problème principal, revenu/logement, documents reçus.\n4. Reviens ensuite au simulateur si ta situation change.'
    }));
  }

  function addLamalResult(res, flags) {
    if (flags.alreadyRI || flags.alreadyPC) {
      res.push(buildResult({
        nom: 'Subside LAMal — réduction de prime',
        badge: 'confirme',
        desc: 'Si tu touches déjà le RI ou les PC, le subside LAMal est généralement lié à cette situation. Le plus utile est de vérifier qu’il est bien actif et correctement appliqué.',
        action: '1. Vérifie que le subside apparaît bien sur ta prime ou dans ta décision.\n2. Si ce n’est pas clair, contacte ton agence AAS ou l’OVAM avec ta décision RI/PC et ta police LAMal.\n3. Garde la décision : elle peut servir de justificatif pour d’autres démarches, notamment la CarteCulture.',
        today: 'Regarde ta dernière décision ou appelle ton agence AAS pour vérifier que la réduction est bien active.',
        docs: ['Attestation RI ou PC', 'Police LAMal actuelle'],
        liens: true
      }));
      return;
    }

    if (flags.revenuFaible || (flags.revenuModere && flags.primeElevee)) {
      res.push(buildResult({
        nom: 'Subside LAMal — réduction de prime',
        badge: 'probable',
        desc: (flags.permisF || flags.permisL)
          ? 'Le subside reste une piste importante, mais avec ton statut de séjour il vaut mieux faire vérifier le cadre exact par une AAS ou un relais spécialisé en plus du calcul officiel.'
          : flags.primeElevee
          ? 'Tes revenus semblent compatibles avec un subside et ta prime maladie pèse lourd dans le budget. C’est une piste importante à vérifier.'
          : 'Avec ton niveau de revenus, un subside est probablement envisageable. Le montant exact dépend ensuite du Revenu Déterminant Unifié (RDU), qui tient compte des revenus et de la fortune.',
        action: (flags.permisF || flags.permisL)
          ? '1. Fais d’abord le calcul officiel du subside.\n2. Si le résultat semble positif, prépare ta police LAMal, tes revenus et ton permis.\n3. Dépose la demande avec une agence d’assurances sociales (AAS) pour éviter une erreur de dossier.\n4. Si la question touche aussi au séjour, demande en parallèle un avis au CSP Fraternité.'
          : '1. Utilise le simulateur officiel du canton pour estimer ton droit.\n2. Prépare ta police LAMal, ta dernière taxation ou une estimation de tes revenus.\n3. Si la piste se confirme, dépose la demande en ligne ou avec une agence AAS.\n4. Garde la décision reçue : elle pourra aussi servir de justificatif pour d’autres aides.',
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
        action: '1. Fais le calcul officiel, même si tu n’es pas sûr·e des montants.\n2. Si tu hésites sur les revenus à indiquer, contacte une agence AAS avant d’envoyer.\n3. Si le calcul semble positif, dépose la demande et garde une copie de la confirmation.',
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
        badge: flags.permisF ? 'verifier' : 'probable',
        desc: flags.permisF
          ? 'Tes revenus et ton épargne font ressortir le RI comme piste à examiner, mais avec un permis F il vaut mieux faire vérifier le bon cadre par le CSR et, si besoin, par un relais migration.'
          : (flags.loyerEleve || flags.grandeCommune)
          ? 'Tes revenus, ton épargne et ton contexte de vie font ressortir le RI comme une piste forte. L\'éligibilité finale dépend toutefois d\'une évaluation complète par un·e assistant·e social·e.'
          : 'Tes revenus et ton épargne font ressortir le RI comme une piste sérieuse. L\'éligibilité finale dépend toutefois d\'une évaluation complète par un·e assistant·e social·e (charges, situation familiale, etc.).',
        action: flags.permisF
          ? '1. Contacte le CSR pour demander un entretien d’évaluation.\n2. Précise ton statut de séjour dès le premier contact : ça évite d’être orienté·e vers le mauvais service.\n3. Prépare tes relevés de compte, ton bail et tes justificatifs de revenus.\n4. Si la question du permis devient centrale, complète avec le CSP Fraternité.'
          : '1. Trouve le CSR de ta commune et demande un entretien d’évaluation.\n2. Explique simplement : revenus actuels, loyer, personnes dans le ménage, dettes urgentes s’il y en a.\n3. Prépare : pièce d’identité, relevés de compte des 3 derniers mois, bail, dernière prime maladie, bulletins de salaire ou preuve d’absence de revenu.\n4. Tu peux prendre contact même si ton dossier n’est pas parfait : le CSR t’indiquera les pièces manquantes.',
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
          ? '1. Contacte le CSR pour un entretien d’évaluation.\n2. Demande clairement si ton statut de séjour change la marche à suivre.\n3. Ajoute une permanence migration si le CSR te le conseille ou si tu reçois des informations contradictoires.'
          : '1. Contacte le CSR de ta commune pour demander un entretien d’évaluation.\n2. Prépare tes relevés de compte, ton bail et tes justificatifs de revenus.\n3. Si tu ne sais pas quoi préparer, demande simplement une liste de documents avant le rendez-vous.',
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
      desc: 'Les PC peuvent compléter une rente AVS ou AI quand elle ne suffit pas pour couvrir les besoins de base. Le droit dépend surtout de la rente, du loyer, des primes maladie, des autres revenus et de la fortune.',
      action: '1. Demande d’abord un calcul estimatif ou des explications à ton agence AAS.\n2. Prépare la décision AVS/AI, le bail, les primes maladie, les revenus et la fortune.\n3. Si la piste se confirme, dépose la demande officielle auprès de l’agence AAS de ta région.\n4. La Caisse AVS Vaud examine ensuite le dossier et rend la décision.',
      today: 'Commence par faire vérifier le calcul avec ton agence AAS.',
      docs: ['Décision AVS ou AI', 'Montant de la rente', 'Bail, primes maladie, relevés bancaires'],
      liensPC: true
    }));
  }

  function addAllocationsFamilialesResult(res) {
    res.push(buildResult({
      nom: 'Allocations familiales',
      badge: 'probable',
      desc: 'Si tu as des enfants à charge et que tu ne reçois pas déjà les allocations familiales, cette piste mérite d’être vérifiée. La porte d’entrée dépend de ta situation professionnelle.',
      action: '1. Si tu es salarié·e, demande à ton employeur ou à sa caisse d’allocations familiales.\n2. Si tu es au chômage, demande à ta caisse de chômage pour le supplément correspondant.\n3. Si tu es sans activité lucrative, vérifie avec une AAS si les conditions sont remplies.\n4. Prépare les actes de naissance et l’attestation de formation si l’enfant a entre 16 et 25 ans.\n5. Si l’autre parent touche déjà quelque chose, signale-le pour éviter les doublons.',
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
        desc: 'Si tu touches déjà le RI, les PC, un subside LAMal ou une bourse, la CarteCulture est souvent accessible avec le bon justificatif. Elle donne accès à de nombreuses offres culturelles, sportives et de loisirs à prix réduit.',
        action: '1. Demande ta carte sur carteculture.ch ou auprès de Caritas Vaud.\n2. Prépare le justificatif correspondant à ta situation : attestation RI, PC, décision de subside, bourse, etc.\n3. Ajoute une photo d’identité si elle est demandée.\n4. La carte est gratuite : garde-la ensuite avec tes justificatifs sociaux.',
        today: 'Tu peux garder cette piste juste après tes démarches prioritaires.',
        docs: ['Justificatif d’aide actuelle', 'Photo d’identité'],
        liensCarte: true
      }));
      return;
    }

    if (flags.revenuFaible && !flags.alreadyCarteCulture) {
      res.push(buildResult({
        nom: 'CarteCulture — Caritas',
        badge: 'probable',
        desc: 'Avec tes revenus, la CarteCulture pourrait être envisageable si le seuil retenu correspond bien à ta situation.',
        action: '1. Vérifie les critères sur le site CarteCulture.\n2. Si ta situation correspond, prépare un justificatif de revenu ou d’aide sociale.\n3. En cas de doute, contacte Caritas Vaud avant de déposer la demande.',
        today: 'Garde cette piste pour juste après les aides financières prioritaires.',
        liensCarte: true
      }));
    }
  }

  function addLaciResult(res, flags) {
    res.push(buildResult({
      nom: 'Assurance chômage (LACI)',
      badge: (flags.permisL || flags.permisG || flags.permisF || flags.permisS || flags.sitPro.indexOf('Sans emploi') !== -1) ? 'verifier' : 'probable',
      desc: (flags.permisL || flags.permisG || flags.permisF || flags.permisS)
        ? 'Le chômage peut rester une piste, mais avec ton statut ou ton cadre de séjour il faut vérifier plus finement les conditions de cotisation, de domicile en Suisse et l’autorité compétente.'
        : 'Une indemnité chômage peut être possible si tu as cotisé au moins 12 mois durant les 2 dernières années ou si tu es libéré·e des conditions de cotisation dans certains cas, puis si les autres conditions sont remplies.',
      action: (flags.permisL || flags.permisG || flags.permisF || flags.permisS)
        ? '1. Inscris-toi ou fais vérifier ta situation auprès de l’ORP.\n2. Choisis ensuite une caisse de chômage et demande un contrôle de ton droit.\n3. Fais préciser les règles liées à ton permis, ton domicile et ton dernier emploi avant de conclure que tu n’as pas droit.'
        : '1. Inscris-toi à l’ORP dès que possible si ce n’est pas encore fait.\n2. Choisis une caisse de chômage : c’est elle qui vérifie le droit financier.\n3. Fais vérifier les conditions principales : en général 12 mois de cotisation dans les 2 dernières années, ou une possible libération des conditions de cotisation selon la situation.\n4. Prépare : certificat de travail, attestation de l’employeur, pièce d’identité ou permis, derniers contrats et courriers de fin d’emploi.',
      today: 'Si ton contrat est terminé ou va se terminer, l’inscription ORP est une priorité à ne pas repousser.',
      docs: ['Certificat de travail', 'Attestation de l’employeur', 'Pièce d’identité ou permis'],
      liensLACI: true,
      liensCadreSejour: flags.permisL || flags.permisF || flags.permisS,
      liensFrontalier: flags.permisG
    }));
  }

  function addChomageActifResult(res) {
    res.push(buildResult({
      nom: 'Assurance chômage — droits déjà ouverts',
      badge: 'confirme',
      desc: 'Tu indiques recevoir déjà le chômage. L’enjeu principal est donc de garder le suivi ORP et caisse clair, et d’anticiper la suite si tes indemnités arrivent bientôt à la fin.',
      action: '1. Regarde ton dernier décompte de chômage pour savoir combien d’indemnités il reste.\n2. Si la fin de droit approche, demande rapidement à ton ORP ou à ta caisse quelles démarches anticiper.\n3. Si tu n’arrives plus à couvrir les besoins de base, prépare aussi un contact avec le CSR.\n4. Si tu as 60 ans ou plus, vérifie en plus la piste rente-pont.',
      today: 'Commence par ton dernier décompte : il te donne la durée restante et aide à savoir quoi anticiper.',
      docs: ['Dernier décompte chômage', 'Courriers ORP ou caisse de chômage', 'Contrats ou certificats de travail récents'],
      liensLACI: true
    }));
  }

  function addRentePontResult(res, flags) {
    if (flags.age60plus && flags.chomage && (flags.fortFaible || flags.fortSous50000)) {
      res.push(buildResult({
        nom: 'Rente-pont AVS — l\'aide la plus méconnue',
        badge: 'probable',
        desc: 'Si tu as 60 ans ou plus et que tes droits au chômage s’épuisent, la rente-pont peut devenir une piste importante. Le montant dépend ensuite d’un calcul sur ta situation.',
        action: '1. Vérifie les conditions principales : indemnités chômage épuisées, durée de cotisation AVS, années après 50 ans, fortune sous le seuil prévu.\n2. Demande à ta caisse de chômage ou à ton ORP combien d’indemnités restent.\n3. Prépare les décisions chômage, un extrait AVS si possible et les justificatifs de fortune.\n4. Fais la demande auprès de la caisse AVS dès que la fin de droit est proche ou atteinte.',
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
        action: '1. Garde cette piste en tête si le chômage dure.\n2. Demande à ta caisse ou à l’ORP comment suivre tes indemnités restantes.\n3. Si tu approches de 60 ans, renseigne-toi avant la fin de droit.',
        liensRentePont: true
      }));
    }
  }

  function addOcbeResult(res, flags) {
    var statutNuance = flags.permisL || flags.permisS || flags.permisF || flags.permisB || flags.permisG;
    var desc = statutNuance
      ? 'Tu es en formation post-obligatoire. Une bourse peut être possible, mais l’OCBE doit vérifier plusieurs points : formation reconnue, statut de séjour, domicile des parents ou statut d’indépendance, et situation financière.'
      : 'Tu es en formation post-obligatoire. Une bourse peut être possible, mais il faut vérifier plusieurs conditions avant de conclure : formation reconnue, domicile des parents ou indépendance, revenus du ménage et documents OCBE.';

    res.push(buildResult({
      nom: 'Bourses d\'études — OCBE',
      badge: 'verifier',
      desc: desc,
      action: '1. Commence par le questionnaire d’éligibilité OCBE.\n2. Vérifie que ta formation est reconnue en Suisse et qu’elle se déroule après l’école obligatoire.\n3. Prépare l’attestation de formation, les documents fiscaux et les informations sur tes parents, sauf si tu penses remplir les conditions d’indépendance.\n4. Dépose la demande même si certaines pièces doivent encore être complétées : le droit débute en principe le mois suivant le dépôt.\n5. Si tu reçois un refus ou si le montant semble insuffisant, demande rapidement de l’aide à Jet Service : le délai de réclamation est de 30 jours.',
      today: 'Commence par l’OCBE sans attendre le dossier parfait, puis fais-toi aider par Jet Service si le statut, les parents ou les documents compliquent la demande.',
      docs: ['Attestation de formation', 'Documents fiscaux du ménage ou des parents', 'Permis ou pièce d’identité', 'Bail si tu vis seul·e', 'Preuves d’activité si tu demandes le statut d’indépendant·e'],
      liensBourse: true,
      liensCadreSejour: statutNuance
    }));
  }

  function addAiResult(res, flags) {
    res.push(buildResult({
      nom: 'Assurance invalidité (AI)',
      badge: (flags.incapacite === 'totale' && !flags.statutAvecNuance) ? 'probable' : 'verifier',
      desc: (flags.permisF || flags.permisL || flags.permisS)
        ? 'L’AI peut rester une piste en cas d’incapacité durable, mais avec ton statut il faut souvent vérifier plus finement les conditions d’assurance, de cotisation et de séjour.'
        : flags.incapacite === 'totale'
        ? 'Ton niveau d\'incapacité semble compatible avec une piste AI. L\'objectif premier de l\'AI reste la réadaptation avant la rente : formation, aides techniques, retour au travail.'
        : 'Selon ton taux d\'incapacité, des mesures de réadaptation ou une rente partielle peuvent éventuellement être examinées.',
      action: (flags.permisF || flags.permisL || flags.permisS)
        ? '1. Si l’incapacité est durable, dépose quand même une demande si la piste est sérieuse.\n2. Prévois une vérification complémentaire sur le cadre d’assurance et de séjour.\n3. Garde les certificats médicaux et courriers reçus : ils seront importants pour comprendre le dossier.'
        : '1. Si l’incapacité dure, ne repousse pas la demande uniquement parce que le dossier n’est pas parfait.\n2. Télécharge le formulaire 001.303 sur aivd.ch ou demande-le à l’Office AI Vaud.\n3. Joins les certificats médicaux déjà disponibles, même si tout n’est pas encore complet.\n4. Note les dates importantes : début de l’incapacité, arrêts de travail, hospitalisations, changements d’emploi.\n5. Office AI Vaud : ☏ 021 342 91 11.',
      today: 'Si ton incapacité dure, dépose la demande sans attendre d’avoir un dossier “parfait”.',
      docs: ['Certificats médicaux', 'Pièce d’identité', 'Historique professionnel récent'],
      liensAI: true,
      liensCadreSejour: flags.permisF || flags.permisL || flags.permisS
    }));
  }

  function addJetServiceResult(res, flags) {
    var jeune = flags.age === '18-25';
    var formation = flags.enFormation;
    if (!jeune && !formation) return;

    res.push(buildResult({
      nom: 'CSP Jet Service — service social jeunes',
      badge: 'probable',
      desc: jeune && formation
        ? 'Comme tu as entre 18 et 25 ans et que tu es en formation, Jet Service est une très bonne porte d’entrée pour faire le point sur les bourses, le budget, le travail ou d’autres démarches sociales.'
        : jeune
        ? 'Comme tu as entre 18 et 25 ans, Jet Service peut être une porte d’entrée très utile pour faire le point sur tes droits, ton budget, le travail ou des démarches compliquées.'
        : 'Comme tu es en formation, Jet Service peut t’aider à faire le point sur les bourses, le budget, le travail ou d’autres démarches sociales liées à ta situation.'
      ,
      action: jeune && formation
        ? '1. Contacte Jet Service pour demander un appui social lié à ta formation.\n2. Explique le besoin principal : bourse, budget, contrat, job, courrier ou orientation.\n3. Prépare ton attestation de formation, tes revenus et les courriers reçus.\n4. Demande clairement si Jet Service peut t’aider directement ou te rediriger vers le bon service.'
        : jeune
        ? '1. Contacte Jet Service pour faire un premier tri de ta situation.\n2. Prépare le courrier, contrat, facture ou document qui te pose problème.\n3. Explique si le problème concerne le budget, le travail, la formation ou une démarche sociale.\n4. Demande quelle action faire en premier.'
        : '1. Contacte Jet Service si la question touche à ta formation, ton budget ou un dossier social.\n2. Prépare l’attestation de formation, les documents financiers et les courriers importants.\n3. Demande un appui pour remplir ou relire le dossier avant envoi.'
      ,
      today: 'Garde cette porte d’entrée si tu sens que les démarches sont floues ou trop lourdes à faire seul·e.',
      docs: ['Courriers reçus si tu en as', 'Pièce d’identité', 'Documents liés à la formation ou au budget selon ta question'],
      liensJetService: true
    }));
  }

  function addRuptureApprentissageResult(res, flags) {
    if (flags.age !== '18-25' || flags.enEmploi || (!flags.enFormation && !flags.etudiant)) return;

    res.push(buildResult({
      nom: 'Rupture d’apprentissage — premiers relais',
      badge: 'verifier',
      desc: 'Si ta formation se bloque, si un apprentissage s’arrête ou si tu n’as plus de solution claire, cette piste peut aider à rebondir plus vite.',
      action: '1. Demande rapidement un conseil en orientation ou regarde les guichets T1.\n2. Prépare ton contrat d’apprentissage, les courriers de rupture ou les messages importants.\n3. Si la rupture crée un problème de revenu, de dette ou de logement, contacte aussi Jet Service ou le CSR.\n4. Demande quelle option est réaliste : reprise, nouvelle place, semestre de motivation, autre formation.',
      today: 'Garde cette piste si la suite de ta formation devient floue ou se casse.',
      docs: ['Contrat d’apprentissage ou documents de formation si tu en as', 'Courriers reçus', 'Questions notées à l’avance'],
      liensRuptureApprentissage: true
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
    var separationEnCours = flags.separationEnCours;
    var besoinProtection = flags.besoinProtection;
    var procheAidant = flags.procheAidant;
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
    if (alreadyChomage) addChomageActifResult(res);
    if (chomageNonIndem && !alreadyChomage && !permisN && !sansStatut) addLaciResult(res, flags);
    addRentePontResult(res, flags);
    if (enFormation && !alreadyBourse) addOcbeResult(res, flags);
    if (incapacite !== 'non' && !alreadyAI) addAiResult(res, flags);
    addJetServiceResult(res, flags);
    addRuptureApprentissageResult(res, flags);
    if (besoinProtection === 'oui') addViolenceProtectionResult(res);
    if (separationEnCours === 'oui' && besoinProtection !== 'oui') addSeparationResult(res, flags);
    if (procheAidant === 'oui') addProchesAidantsResult(res);

    if (invalidite && !retraite) addProInfirmisResult(res);
    if (retraite || age === '65plus') addProSenectuteResult(res);
    if (invalidite) addCmsResult(res);
    if ((flags.besoinLocalConcret || (flags.revenuFaible && flags.grandeCommune)) && !sansStatut) addPrestationsCommunalesResult(res, flags);
    if (aEnfants && (enEmploi || enFormation)) addGardeEnfantsMaladesResult(res, flags);
    if (dettes !== 'non') addDettesResult(res, dettes);
    if ((flags.besoinAlimentaireProbable || dettes === 'dettes' || dettes === 'surendette') && !sansStatut) addAideAlimentaireRegionResult(res, flags);
    if (logement.includes('Locataire') && !alreadyRI && (loyerEleve || dettes === 'loyer' || revenuFaible)) {
      addAidesLogementResult(res, grandeCommune, dettes, loyerEleve);
    }
    if (res.length === 0) addFallbackResult(res);

    return {
      results: dedupeResults(res),
      context: {
        enEmploi: enEmploi
      }
    };
  };

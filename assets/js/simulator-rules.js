window.MONAIDE_SIMULATION_RULES = [
  {
    id: 'urgence-orientation',
    title: 'Urgence budget ou logement',
    intent: 'Prioriser un premier relais humain quand le logement ou le budget devient critique.',
    when: 'urgenceActive',
    handler: 'addUrgenceOrientationResults',
    confidence: 'orientation',
    guardrails: ['Ne remplace pas une procédure juridique ou une décision officielle.', 'Renvoie vers CSR et ASLOCA si le logement est en jeu.'],
    sourceType: 'réseau social vaudois'
  },
  {
    id: 'permis-n',
    title: 'Permis N',
    intent: 'Orienter d’abord vers le dispositif asile et les relais migration.',
    when: 'permisN',
    handler: 'addPermisNResults',
    confidence: 'orientation prioritaire',
    guardrails: ['Évite les aides ordinaires comme première réponse.', 'Invite à faire relire les courriers officiels.'],
    sourceType: 'statut de séjour'
  },
  {
    id: 'permis-s',
    title: 'Permis S',
    intent: 'Faire vérifier le cadre de prise en charge avant les démarches ordinaires.',
    when: 'permisS',
    handler: 'addPermisSResults',
    confidence: 'orientation prioritaire',
    guardrails: ['Ne conclut pas sur les droits ordinaires.', 'Renvoie vers EVAM ou CSP Fraternité si le cadre est flou.'],
    sourceType: 'statut de séjour'
  },
  {
    id: 'permis-f',
    title: 'Permis F',
    intent: 'Garder les pistes sociales possibles, mais avec prudence sur le cadre administratif.',
    when: 'permisF',
    handler: 'addPermisFResults',
    confidence: 'à vérifier',
    guardrails: ['Ajoute une nuance migration aux résultats ordinaires.', 'Ne transforme pas une piste en droit probable sans vérification.'],
    sourceType: 'statut de séjour'
  },
  {
    id: 'permis-l',
    title: 'Permis L',
    intent: 'Faire vérifier la durée du séjour, le domicile et le cadre de travail.',
    when: 'permisL',
    handler: 'addPermisLResults',
    confidence: 'à vérifier',
    guardrails: ['Domicile et durée de séjour peuvent changer la démarche.', 'Privilégie une vérification avant demande.'],
    sourceType: 'statut de séjour'
  },
  {
    id: 'permis-g',
    title: 'Permis G',
    intent: 'Prioriser le cadre frontalier, emploi, chômage et assurance.',
    when: 'permisG',
    handler: 'addPermisGResults',
    confidence: 'orientation prioritaire',
    guardrails: ['Domicile à l’étranger possible.', 'Les aides ordinaires vaudoises doivent rester à vérifier.'],
    sourceType: 'statut de séjour'
  },
  {
    id: 'sans-statut',
    title: 'Sans statut régulier',
    intent: 'Protéger la personne en priorisant les relais migration et l’aide d’urgence.',
    when: 'sansStatut',
    handler: 'addSansStatutResults',
    confidence: 'orientation prioritaire',
    guardrails: ['Ne propose pas une démarche ordinaire comme première porte.', 'Évite toute promesse de droit.'],
    sourceType: 'situation sensible'
  },
  {
    id: 'lamal',
    title: 'Subside assurance maladie (OVAM)',
    intent: 'Repérer si la prime maladie peut justifier une vérification OVAM/AAS.',
    when: 'needsLamal',
    handler: 'addLamalResult',
    confidence: 'probable ou à vérifier selon revenu, prime, fortune et aides actuelles',
    guardrails: ['Fortune élevée rétrograde la piste.', 'RI ou PC actuels servent surtout à vérifier que le subside est actif.'],
    sourceType: 'prestation cantonale'
  },
  {
    id: 'ri',
    title: 'Revenu d’insertion',
    intent: 'Repérer le CSR comme porte d’entrée quand les besoins de base ne passent plus.',
    when: 'needsRi',
    handler: 'addRiResult',
    confidence: 'probable ou à vérifier selon revenu, fortune, statut et formation',
    guardrails: ['Ne sort pas pour étudiant·e en formation comme piste ordinaire.', 'Ne valide jamais le droit au RI.', 'Le CSR reste seul à évaluer.'],
    sourceType: 'aide sociale cantonale'
  },
  {
    id: 'pc',
    title: 'Prestations complémentaires AVS/AI',
    intent: 'Proposer les PC quand une rente AVS/AI semble insuffisante.',
    when: 'needsPc',
    handler: 'addPcResult',
    confidence: 'probable ou à vérifier',
    guardrails: ['Fortune élevée impose une vérification officielle.', 'La caisse/AAS reste seule à trancher le droit.'],
    sourceType: 'prestation sociale'
  },
  {
    id: 'frais-maladie-invalidite',
    title: 'Frais maladie et invalidité liés aux PC',
    intent: 'Ne pas manquer les frais de santé ou de handicap qui peuvent parfois être annoncés quand les PC sont déjà ouvertes.',
    when: 'needsFraisMaladieInvalidite',
    handler: 'addFraisMaladieInvaliditeResult',
    confidence: 'à vérifier',
    guardrails: ['Seulement si les PC sont déjà indiquées.', 'Les factures doivent être vérifiées par AAS ou Caisse AVS.'],
    sourceType: 'prestation sociale'
  },
  {
    id: 'pc-familles',
    title: 'PC Familles',
    intent: 'Repérer les familles qui travaillent mais dont le budget reste trop serré.',
    when: 'needsPcFamilles',
    handler: 'addPcFamillesResult',
    confidence: 'probable ou à vérifier',
    guardrails: ['Vérifier activité lucrative, âge des enfants, revenus et fortune.', 'Ne pas proposer si RI ou PC déjà indiqués.'],
    sourceType: 'prestation cantonale'
  },
  {
    id: 'allocations-familiales',
    title: 'Allocations familiales',
    intent: 'Rappeler une aide fréquente dès qu’il y a des enfants à charge.',
    when: 'needsAllocationsFamiliales',
    handler: 'addAllocationsFamilialesResult',
    confidence: 'probable ou à vérifier selon situation professionnelle',
    guardrails: ['Bonne caisse variable selon emploi, chômage ou absence d’activité.', 'Attention à l’autre parent.'],
    sourceType: 'prestation familiale'
  },
  {
    id: 'carteculture',
    title: 'CarteCulture',
    intent: 'Ajouter une aide complémentaire utile après certaines prestations ou en cas de revenu modeste.',
    when: 'always',
    handler: 'addCarteCultureResult',
    confidence: 'probable si justificatif social existant, sinon à vérifier',
    guardrails: ['Ne doit pas passer avant les aides financières prioritaires.', 'Fortune élevée et absence de justificatif gardent la piste prudente.'],
    sourceType: 'aide associative'
  },
  {
    id: 'chomage-ouvert',
    title: 'Chômage déjà ouvert',
    intent: 'Aider à suivre la caisse/ORP et anticiper la fin de droit.',
    when: 'needsChomageActif',
    handler: 'addChomageActifResult',
    confidence: 'probable',
    guardrails: ['Ne réexamine pas le droit comme si rien n’était ouvert.', 'Oriente vers le décompte et la fin de droit.'],
    sourceType: 'assurance sociale'
  },
  {
    id: 'laci',
    title: 'Assurance chômage LACI',
    intent: 'Orienter vers ORP et caisse quand une perte d’emploi est indiquée.',
    when: 'needsLaci',
    handler: 'addLaciResult',
    confidence: 'à vérifier',
    guardrails: ['Reste à vérifier sans conditions de cotisation détaillées.', 'Passe avant le RI en sortie d’emploi.'],
    sourceType: 'assurance sociale'
  },
  {
    id: 'rente-pont',
    title: 'Rente-pont AVS',
    intent: 'Ne pas manquer une piste importante pour les 60+ proches de la fin du chômage.',
    when: 'always',
    handler: 'addRentePontResult',
    confidence: 'probable ou à anticiper',
    guardrails: ['Seulement liée à âge, chômage et fortune.', 'Ne remplace pas le calcul officiel.'],
    sourceType: 'prestation cantonale'
  },
  {
    id: 'ocbe',
    title: 'Bourses OCBE',
    intent: 'Orienter les personnes en formation post-obligatoire vers le test et la demande OCBE.',
    when: 'needsOcbe',
    handler: 'addOcbeResult',
    confidence: 'à vérifier',
    guardrails: ['Bourse avant RI pour étudiant·e.', 'Statut, parents, indépendance et formation reconnue doivent être vérifiés.'],
    sourceType: 'prestation cantonale'
  },
  {
    id: 'ai',
    title: 'Assurance invalidité',
    intent: 'Repérer une incapacité durable qui mérite un premier contact AI.',
    when: 'needsAi',
    handler: 'addAiResult',
    confidence: 'à vérifier',
    guardrails: ['Ne promet jamais rente ou mesure.', 'Le statut de séjour peut nuancer la démarche.'],
    sourceType: 'assurance sociale'
  },
  {
    id: 'jet-service',
    title: 'Jet Service',
    intent: 'Proposer un relais social jeunes/formation quand les démarches deviennent floues.',
    when: 'needsJetService',
    handler: 'addJetServiceResult',
    confidence: 'orientation utile',
    guardrails: ['Soutien, pas autorité de décision.', 'Ne doit pas remplacer OCBE quand la formation est centrale.'],
    sourceType: 'relais associatif'
  },
  {
    id: 'rupture-apprentissage',
    title: 'Rupture de formation',
    intent: 'Ajouter un relais si la formation d’un·e jeune semble se bloquer.',
    when: 'needsRuptureApprentissage',
    handler: 'addRuptureApprentissageResult',
    confidence: 'à vérifier',
    guardrails: ['Seulement jeune + formation ou situation étudiante.', 'Oriente vers conseil/transition plutôt qu’aide financière directe.'],
    sourceType: 'orientation formation'
  },
  {
    id: 'separation',
    title: 'Séparation',
    intent: 'Trier budget, enfants, logement et pensions quand une séparation est en cours.',
    when: 'needsSeparationSupport',
    handler: 'addSeparationResult',
    confidence: 'orientation utile',
    guardrails: ['Si violence, la règle protection passe avant.', 'Ne remplace pas un conseil juridique.'],
    sourceType: 'situation familiale'
  },
  {
    id: 'proches-aidants',
    title: 'Proches aidant·es',
    intent: 'Repérer les besoins de soutien, relève ou carte d’urgence proche aidant.',
    when: 'needsProchesAidants',
    handler: 'addProchesAidantsResult',
    confidence: 'orientation utile',
    guardrails: ['Distinguer aide au proche et droits propres de la personne aidante.'],
    sourceType: 'soutien social'
  },
  {
    id: 'aminh',
    title: 'AMINH enfant en situation de handicap',
    intent: 'Ajouter une piste de soutien à domicile quand la personne indique des enfants et un rôle de proche aidant.',
    when: 'needsAminh',
    handler: 'addAminhResult',
    confidence: 'à vérifier',
    guardrails: ['Ne suppose pas automatiquement le handicap de l’enfant.', 'Présenter comme piste à faire vérifier, pas comme droit acquis.'],
    sourceType: 'soutien social'
  },
  {
    id: 'pro-infirmis',
    title: 'Pro Infirmis',
    intent: 'Ajouter un relais handicap/maladie durable pour les personnes non retraitées.',
    when: 'needsProInfirmis',
    handler: 'addProInfirmisResult',
    confidence: 'orientation utile',
    guardrails: ['Complète AI/CMS, ne remplace pas une décision.'],
    sourceType: 'relais associatif'
  },
  {
    id: 'pro-senectute',
    title: 'Pro Senectute',
    intent: 'Ajouter un relais administratif/social pour les 60+.',
    when: 'needsProSenectute',
    handler: 'addProSenectuteResult',
    confidence: 'orientation utile',
    guardrails: ['Complète PC/AAS, ne remplace pas la caisse.'],
    sourceType: 'relais associatif'
  },
  {
    id: 'cms',
    title: 'CMS',
    intent: 'Repérer les besoins d’aide ou soins à domicile.',
    when: 'needsCms',
    handler: 'addCmsResult',
    confidence: 'à vérifier',
    guardrails: ['Financement et prescription à vérifier.', 'Prioriser médecin/CMS selon besoin.'],
    sourceType: 'réseau santé-social'
  },
  {
    id: 'prestations-communales',
    title: 'Aides communales',
    intent: 'Ne pas manquer les aides locales concrètes quand la commune ou la famille compte.',
    when: 'needsPrestationsCommunales',
    handler: 'addPrestationsCommunalesResult',
    confidence: 'à vérifier',
    guardrails: ['Très variable selon commune.', 'À explorer après les aides principales.'],
    sourceType: 'aide locale'
  },
  {
    id: 'garde-enfants-malades',
    title: 'Garde d’enfants malades',
    intent: 'Repérer une solution pratique quand un enfant malade bloque travail ou formation.',
    when: 'needsGardeMalade',
    handler: 'addGardeEnfantsMaladesResult',
    confidence: 'à vérifier',
    guardrails: ['Service ponctuel, conditions et tarifs à vérifier.'],
    sourceType: 'relais pratique'
  },
  {
    id: 'dettes',
    title: 'Dettes',
    intent: 'Orienter rapidement si poursuites, surendettement ou loyer menacé apparaissent.',
    when: 'needsDettes',
    handler: 'addDettesResult',
    confidence: 'orientation prioritaire selon urgence',
    guardrails: ['Loyer menacé passe en urgence.', 'Ne conseille pas d’arrangement irréaliste.'],
    sourceType: 'urgence budget'
  },
  {
    id: 'aide-alimentaire',
    title: 'Aide alimentaire',
    intent: 'Ajouter une aide immédiate quand manger devient difficile.',
    when: 'needsAideAlimentaire',
    handler: 'addAideAlimentaireRegionResult',
    confidence: 'probable ou à vérifier',
    guardrails: ['Aide immédiate, pas solution structurelle.', 'À traiter avec RI/CSR si besoin de base durable.'],
    sourceType: 'aide de proximité'
  },
  {
    id: 'aides-logement',
    title: 'Aides logement',
    intent: 'Repérer le loyer trop lourd ou les aides communales/parapubliques possibles.',
    when: 'needsAidesLogement',
    handler: 'addAidesLogementResult',
    confidence: 'à vérifier',
    guardrails: ['Ne sort pas si RI déjà indiqué comme aide actuelle.', 'Variable selon commune et statut.'],
    sourceType: 'aide locale/logement'
  },
  {
    id: 'fallback',
    title: 'Aucune piste automatique',
    intent: 'Ne jamais laisser la personne sans porte de sortie.',
    when: 'needsFallback',
    handler: 'addFallbackResult',
    confidence: 'orientation générale',
    guardrails: ['Ne prétend pas qu’il n’existe aucune aide.', 'Renvoie vers répertoire et premier relais humain.'],
    sourceType: 'sécurité UX'
  }
];

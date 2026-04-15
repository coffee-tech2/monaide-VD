  window.MONAIDE_CATALOG_LAYOUT_DATA = {
    groups: [
      {
        id: 'groupe-revenus',
        title: 'Familles, revenus & aides financières',
        subtitle: 'RI, aides familles, pensions, dettes et budget',
        items: [
          { id: 'csr', dataCat: 'financier', tier: 'essential' },
          { id: 'ri', dataCat: 'financier', tier: 'essential' },
          { id: 'prestations-communales', dataCat: 'financier', tier: 'essential' },
          { id: 'allocations-familiales', dataCat: 'financier', tier: 'essential' },
          { id: 'apg', dataCat: 'financier', tier: 'known' },
          { id: 'pc-familles', dataCat: 'financier', tier: 'known' },
          { id: 'comipp', dataCat: 'financier', tier: 'known' },
          { id: 'brapa', dataCat: 'financier', tier: 'known' },
          { id: 'separation-divorce', dataCat: 'financier', tier: 'known' },
          { id: 'mediation-familiale', dataCat: 'financier', tier: 'known' },
          { id: 'accueil-jour-enfants', dataCat: 'financier', tier: 'known' },
          { id: 'garde-enfants-malades', dataCat: 'financier', tier: 'known' },
          { id: 'parlons-cash', dataCat: 'financier', tier: 'complement' },
          { id: 'bcma', dataCat: 'financier', tier: 'complement' },
          { id: 'csp-vaud', dataCat: 'financier', tier: 'complement' },
          { id: 'croix-rouge-vaudoise', dataCat: 'financier', tier: 'complement' }
        ]
      },
      {
        id: 'groupe-emploi',
        title: 'Emploi & formation',
        subtitle: 'Chômage, bourses, apprentissage et orientation',
        items: [
          { id: 'laci', dataCat: 'emploi', tier: 'essential' },
          { id: 'bourse', dataCat: 'formation', tier: 'essential' },
          { id: 'jet-service', dataCat: 'formation emploi', tier: 'essential' },
          { id: 'guichet-t1', dataCat: 'formation emploi', tier: 'known' },
          { id: 'rupture-apprentissage', dataCat: 'formation emploi', tier: 'known' },
          { id: 'rente-pont', dataCat: 'emploi', tier: 'complement' }
        ]
      },
      {
        id: 'groupe-sante',
        title: 'Santé & assurances',
        subtitle: 'LAMal, AI, PC, soins, proches aidant·es',
        items: [
          { id: 'subside-lamal', dataCat: 'sante', tier: 'essential' },
          { id: 'aas', dataCat: 'sante', tier: 'essential' },
          { id: 'ai', dataCat: 'sante', tier: 'essential' },
          { id: 'pc', dataCat: 'sante', tier: 'essential' },
          { id: 'cms', dataCat: 'sante', tier: 'known' },
          { id: 'espace-proches', dataCat: 'sante', tier: 'known' },
          { id: 'repit-proches-aidants', dataCat: 'sante', tier: 'known' },
          { id: 'sante-mentale-relais', dataCat: 'sante', tier: 'known' },
          { id: 'pro-infirmis', dataCat: 'sante', tier: 'complement' },
          { id: 'pro-senectute', dataCat: 'sante', tier: 'complement' },
          { id: 'addiction-vaud', dataCat: 'sante', tier: 'complement' },
          { id: 'relaids', dataCat: 'sante', tier: 'complement' },
          { id: 'unisante', dataCat: 'sante', tier: 'complement' },
          { id: 'point-deau', dataCat: 'sante', tier: 'complement' },
          { id: 'sante-sexuelle-profa', dataCat: 'sante', tier: 'complement' },
          { id: 'l-check', dataCat: 'sante', tier: 'complement' },
          { id: 'voqueer', dataCat: 'sante', tier: 'complement' }
        ]
      },
      {
        id: 'groupe-logement',
        title: 'Logement',
        subtitle: 'Expulsion, logements subventionnés',
        items: [
          { id: 'menace-expulsion', dataCat: 'logement', tier: 'essential' },
          { id: 'asloca', dataCat: 'logement', tier: 'essential' },
          { id: 'aide-logement-familles', dataCat: 'logement', tier: 'known' },
          { id: 'lup', dataCat: 'logement', tier: 'complement' }
        ]
      },
      {
        id: 'groupe-urgences',
        title: 'Urgences & premiers secours psychosociaux',
        subtitle: 'Violences, crise, aide alimentaire, écoute',
        items: [
          { id: 'violences-conjugales', dataCat: 'urgence', tier: 'essential' },
          { id: 'malleyprairie', dataCat: 'urgence', tier: 'essential' },
          { id: 'lavi', dataCat: 'urgence', tier: 'essential' },
          { id: 'crise-psychique', dataCat: 'urgence', tier: 'essential' },
          { id: 'aide-alimentaire-region', dataCat: 'urgence', tier: 'known' },
          { id: 'distributions-alimentaires', dataCat: 'urgence', tier: 'known' },
          { id: 'lignes-ecoute', dataCat: 'urgence', tier: 'complement' },
          { id: 'le-passage', dataCat: 'urgence', tier: 'complement' },
          { id: 'vaud-pour-vous', dataCat: 'urgence', tier: 'complement' }
        ]
      },
      {
        id: 'groupe-migration',
        title: 'Migration',
        subtitle: 'Asile, séjour, accompagnement et intégration',
        items: [
          { id: 'fraternite', dataCat: 'migration', tier: 'essential' },
          { id: 'evam', dataCat: 'migration', tier: 'essential' },
          { id: 'aide-urgence-sejour', dataCat: 'migration urgence', tier: 'known' },
          { id: 'appartenances', dataCat: 'migration', tier: 'known' },
          { id: 'caritas-migration', dataCat: 'migration', tier: 'complement' },
          { id: 'foyer-evam-femmes', dataCat: 'migration', tier: 'complement' }
        ]
      },
      {
        id: 'groupe-petit-budget',
        title: 'Seconde main & petit budget',
        subtitle: 'Courses, habits, meubles et objets à prix solidaires',
        items: [
          { id: 'epicerie-caritas', dataCat: 'petitbudget', tier: 'essential' },
          { id: 'caritas-vetements', dataCat: 'petitbudget', tier: 'known' },
          { id: 'boutique-csp-palud', dataCat: 'petitbudget', tier: 'known' },
          { id: 'galetas-csp', dataCat: 'petitbudget', tier: 'complement' },
          { id: 'emmaus', dataCat: 'petitbudget', tier: 'complement' },
          { id: 'brocki-lausanne', dataCat: 'petitbudget', tier: 'complement' }
        ]
      },
      {
        id: 'groupe-culture',
        title: 'Loisirs & culture',
        subtitle: 'CarteCulture, offres solidaires',
        items: [
          { id: 'carte', dataCat: 'culture', tier: 'essential' },
          { id: 'passculture', dataCat: 'culture formation', tier: 'known' }
        ]
      }
    ]
  };

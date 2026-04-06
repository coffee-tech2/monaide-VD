  window.MONAIDE_CATALOG_ITEMS = [
    {
      id: 'aas',
      title: 'Agence d’assurances sociales (AAS)',
      category: 'sante',
      summary: 'Subside LAMal, AVS, AI, PC · Guichet administratif de proximité',
      audience: 'Personnes qui doivent comprendre une démarche sociale ou vérifier un droit administratif.',
      purpose: 'L’AAS aide à comprendre les démarches, vérifier le bon formulaire et savoir quoi préparer avant d’envoyer un dossier.',
      highlights: [
        'Explique le subside LAMal, les PC, l’AVS et d’autres démarches sociales',
        'Aide à identifier la bonne porte d’entrée',
        'Peut orienter vers le bon service si la demande ne passe pas par elle'
      ],
      firstSteps: [
        'Trouver l’agence AAS de ta région',
        'Prendre contact, même si tu n’as pas encore tous les documents',
        'Venir avec les courriers ou décisions déjà reçus si tu en as'
      ],
      bodyIntro: 'L’AAS est souvent la bonne première porte pour le subside LAMal, l’AVS, l’AI ou les PC. Tu peux y aller même si tu n’es pas encore sûr·e de ton droit.',
      sections: [
        {
          title: 'Pour quoi',
          items: [
            'Subside de caisse maladie',
            'Prestations AVS / AI / PC',
            'Orientation administrative de base'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Trouver l’agence de ta région',
            'Venir avec pièce d’identité et documents utiles',
            'Poser la question même si ton dossier n’est pas complet'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Trouver une agence AAS', url: window.MONAIDE_LINKS.AAS_LIST },
        { kind: 'info', label: 'Infos aides sociales Vaud', url: 'https://www.vd.ch/aides-financieres-et-soutien-social' },
        { kind: 'info', label: 'Guide détaillé', url: '/agence-assurances-sociales/' }
      ],
      documentationTarget: null
    },
    {
      id: 'subside-lamal',
      title: 'Subside LAMal — réduction de prime',
      category: 'sante',
      summary: 'Revenus modestes · Toute personne domiciliée dans le canton',
      audience: 'Personnes dont la prime maladie pèse trop lourd dans le budget.',
      purpose: 'Le subside LAMal réduit le coût de l’assurance maladie de base selon les revenus, la fortune et la composition du ménage.',
      highlights: [
        'Peut réduire fortement la prime mensuelle',
        'Passe par les critères cantonaux du canton de Vaud',
        'Peut être vérifié avec une AAS si la démarche n’est pas claire'
      ],
      firstSteps: [
        'Évaluer le droit sur la page officielle',
        'Faire la demande en ligne ou avec une agence AAS',
        'Préparer revenus, taxation et police LAMal'
      ],
      bodyIntro: 'Si ton revenu est modeste, l’État peut payer une partie de ta prime LAMal. La demande se fait en ligne ou avec une AAS. C’est l’OVAM qui rend la décision.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Domicile dans le canton de Vaud',
            'Permis de séjour valide',
            'RDU inférieur aux seuils cantonaux',
            'Automatique si tu reçois le RI ou des PC'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Dernière taxation à portée',
            'Évaluer le droit puis déposer la demande',
            'Demande possible en ligne ou via ton agence AAS',
            'L’OVAM confirme ensuite le droit ou non au subside'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'La date de dépôt compte. Le droit débute en principe le premier jour du deuxième mois qui suit la demande. Si l’OVAM accorde un effet rétroactif, l’assureur doit rembourser ou compenser les primes déjà payées en trop.'
        }
      ],
      links: [
        { kind: 'action', label: 'Évaluer et demander le subside', url: window.MONAIDE_LINKS.SUBSIDE_HOME },
        { kind: 'info', label: 'OVAM : infos officielles', url: window.MONAIDE_LINKS.SUBSIDE_HOME },
        { kind: 'action', label: 'Trouver une agence AAS', url: window.MONAIDE_LINKS.AAS_LIST },
        { kind: 'info', label: 'Guide détaillé', url: '/subside-lamal/' }
      ],
      documentationTarget: { blockId: 'bloc-lamal', accordionId: 'doc-lamal' }
    },
    {
      id: 'ri',
      title: 'Revenu d’insertion (RI)',
      category: 'financier',
      summary: 'Adultes sans ressources suffisantes · Aide de dernier recours',
      audience: 'Personnes qui n’ont plus assez pour vivre ou dont les revenus ne couvrent plus le minimum.',
      purpose: 'Le RI garantit un minimum pour vivre quand les revenus ne suffisent plus. La demande se fait via le CSR.',
      highlights: [
        'Aide financière de dernier recours dans le canton',
        'La demande passe par le CSR de la région',
        'Peut s’accompagner d’un suivi social'
      ],
      firstSteps: [
        'Contacter d’abord le CSR de ta commune',
        'Prendre un premier rendez-vous, même sans dossier parfait',
        'Préparer identité, revenus, bail et relevés si possible'
      ],
      bodyIntro: 'Le RI veut dire <strong>Revenu d’insertion</strong>. C’est l’aide financière de dernier recours dans le canton de Vaud. Si tu n’as plus assez pour vivre, le RI peut garantir un revenu minimum. La demande passe par le CSR, qui examine ensuite le dossier.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Majeur·e, domicilié·e dans le canton',
            'Permis valide (pas permis N)',
            'Revenus inférieurs au barème RI',
            'Fortune < 4 000 CHF (8 000 en couple)'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Contacter d’abord le CSR de ta commune',
            'Rendez-vous d’évaluation avec un·e assistant·e social·e',
            'Dossier financier à constituer'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Demander le RI', url: window.MONAIDE_LINKS.RI_APPLY },
        { kind: 'action', label: 'Trouver ton CSR', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/trouver-un-centre-social-regional-csr' },
        { kind: 'info', label: 'Guide détaillé', url: '/revenu-insertion/' }
      ],
      documentationTarget: { blockId: 'bloc-ri', accordionId: 'doc-ri' }
    },
    {
      id: 'ai',
      title: 'Assurance invalidité (AI)',
      category: 'sante',
      summary: 'Incapacité de travail durable · Dès 40% d’incapacité',
      audience: 'Personnes dont la santé limite durablement la capacité de travail.',
      purpose: 'L’AI peut financer une réadaptation, une formation, des aides techniques ou une rente selon la situation.',
      highlights: [
        'Peut aider avant même une décision de rente',
        'La réadaptation passe avant la rente',
        'Un dossier médical solide aide la demande'
      ],
      firstSteps: [
        'Ouvrir les formulaires AI Vaud',
        'Ne pas attendre pour déposer la demande',
        'Se faire aider par son médecin, psychiatre ou psychologue si besoin'
      ],
      bodyIntro: 'Si une maladie ou un accident t’empêche de travailler durablement, l’AI peut aider. Elle peut financer une réadaptation, une formation ou des aides techniques. Dépose ta demande sans trop attendre.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Incapacité ≥ 40% pendant au moins 1 an',
            '3 ans de cotisation AVS/AI minimum',
            'Rente partielle dès 40%, entière dès 70%'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Formulaire 001.303 à l’Office AI Vaud',
            'Déposer la demande sans trop attendre',
            'Ton médecin, ton psychiatre ou ton psychologue peut t’accompagner'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Formulaires AI Vaud', url: window.MONAIDE_LINKS.AI_FORMS },
        { kind: 'info', label: 'Infos AI Vaud', url: window.MONAIDE_LINKS.AI_HOME },
        { kind: 'info', label: 'Guide détaillé', url: '/assurance-invalidite/' }
      ],
      documentationTarget: { blockId: 'bloc-ai', accordionId: 'doc-ai' }
    },
    {
      id: 'bourse',
      title: 'Bourses d’études — OCBE',
      category: 'formation',
      summary: 'Étudiant·es et apprenti·es · Ressources familiales insuffisantes',
      audience: 'Personnes en formation post-obligatoire qui ont besoin d’un soutien pour financer leurs études.',
      purpose: 'L’OCBE peut prendre en charge une partie des frais d’études ou de formation selon les revenus du ménage.',
      highlights: [
        'Formation post-obligatoire concernée',
        'Demande à refaire en principe chaque année',
        'Jet Service peut aider à remplir le dossier'
      ],
      firstSteps: [
        'Lire les infos bourses OCBE',
        'Faire une demande en ligne',
        'Préparer les documents fiscaux et l’attestation d’inscription'
      ],
      bodyIntro: 'Tu es étudiant·e et tes parents n’ont pas les moyens de payer ta formation ? L’État peut prendre en charge une partie ou la totalité de tes frais.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Formation post-obligatoire (CFC, maturité, HES, uni…)',
            'Domicile vaudois',
            'Ressources familiales insuffisantes selon barème OCBE'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Tester son éligibilité avec le questionnaire OCBE',
            'Demande en ligne sur le portail OCBE',
            'Déclaration d’impôts des parents à préparer'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Si tu as un doute sur ton droit ou sur le dossier, n’hésite pas à contacter l’OCBE. Ils sont aussi là pour répondre à tes questions.'
        }
      ],
      links: [
        { kind: 'info', label: 'Infos bourses OCBE', url: window.MONAIDE_LINKS.OCBE_INFO },
        { kind: 'action', label: 'Faire une demande OCBE', url: window.MONAIDE_LINKS.OCBE_APPLY },
        { kind: 'info', label: 'Fondations privées (PDF)', url: 'https://www.vd.ch/fileadmin/user_upload/organisation/dsas/DGCS/OCBE_Liste_fondations_priv%C3%A9es.pdf' },
        { kind: 'info', label: 'Guide détaillé', url: '/bourses-ocbe/' }
      ],
      documentationTarget: { blockId: 'bloc-bourse', accordionId: 'doc-bourse' }
    },
    {
      id: 'carte',
      title: 'CarteCulture — Caritas',
      category: 'culture',
      summary: 'Bénéficiaires RI, PC, subside LAMal ou bourse · Gratuit',
      audience: 'Personnes avec petit budget qui veulent accéder à des offres culturelles et de loisirs à prix réduit.',
      purpose: 'La CarteCulture donne accès à des réductions dans la culture, le sport, les loisirs et certaines offres du quotidien.',
      highlights: [
        'Gratuite',
        'Très utile si tu as déjà une aide sociale ou un revenu modeste',
        'Réductions dans plus de 270 offres'
      ],
      firstSteps: [
        'Vérifier si tu as le bon justificatif',
        'Faire la demande en ligne',
        'Contacter l’équipe CarteCulture si tu bloques'
      ],
      bodyIntro: 'Tu bénéficies du RI, d’un subside LAMal ou d’une bourse ? Tu as probablement droit à la CarteCulture — réductions sur plus de 270 offres dans le canton. Entièrement gratuite.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Bénéficiaire RI, PC, subside LAMal ou bourse',
            'Ou revenus inférieurs au minimum vital',
            'Entièrement gratuite'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Demande en ligne ou via l’équipe CarteCulture Vaud',
            'Justificatif de situation à fournir',
            'Photo d’identité nécessaire'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Demander la CarteCulture', url: window.MONAIDE_LINKS.CARTECULTURE_APPLY },
        { kind: 'info', label: 'Contacter CarteCulture', url: window.MONAIDE_LINKS.CARTECULTURE_CONTACT },
        { kind: 'info', label: 'Guide détaillé', url: '/carteculture/' }
      ],
      documentationTarget: { blockId: 'bloc-carte', accordionId: 'doc-carte' }
    },
    {
      id: 'pc',
      title: 'Prestations complémentaires AVS/AI (PC)',
      category: 'sante',
      summary: 'Retraité·es et bénéficiaires AI · Rente insuffisante',
      audience: 'Personnes avec une rente AVS ou AI qui ne suffit pas à couvrir le budget de base.',
      purpose: 'Les PC complètent une rente AVS ou AI quand les revenus ne couvrent pas les besoins essentiels.',
      highlights: [
        'Concerne les rentiers AVS ou AI',
        'Les revenus, charges et la fortune sont examinés ensemble',
        'Une AAS peut aider à faire le premier tri'
      ],
      firstSteps: [
        'Faire estimer la situation avec une AAS',
        'Préparer revenus, charges et fortune',
        'Déposer ensuite la demande officielle'
      ],
      bodyIntro: 'Tu as une rente AVS ou AI mais elle ne suffit pas ? Les PC servent à compléter le budget de base. Dans le canton, le plus simple est souvent de commencer par une agence AAS.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Bénéficiaire d’une rente AVS ou AI',
            'Domicile en Suisse depuis 10 ans en principe',
            'Revenus, charges et fortune examinés ensemble'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Faire d’abord estimer la situation avec une AAS',
            'Déposer ensuite la demande officielle',
            'La Caisse AVS Vaud examine le dossier et rend la décision'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'PC AVS/AI', url: 'https://www.ahv-iv.ch/fr/Assurances-sociales/Prestations-complementaires-PC/Generalites' },
        { kind: 'action', label: 'Trouver une agence AAS', url: window.MONAIDE_LINKS.AAS_LIST },
        { kind: 'info', label: 'Caisse AVS Vaud', url: window.MONAIDE_LINKS.CAISSE_AVS_HOME },
        { kind: 'info', label: 'Guide détaillé', url: '/prestations-complementaires/' }
      ],
      documentationTarget: null
    },
    {
      id: 'csr',
      title: 'Centre social régional (CSR)',
      category: 'financier',
      summary: 'Premier contact social · Porte d’entrée pour le RI · Orientation locale',
      audience: 'Personnes qui ne savent pas par où commencer ou qui n’ont plus assez pour vivre.',
      purpose: 'Le CSR aide à faire le point, explique le RI, vérifie les pistes possibles et oriente vers les bons services.',
      highlights: [
        'Première porte d’entrée sociale locale',
        'Examine et octroie le RI',
        'Peut orienter vers d’autres aides'
      ],
      firstSteps: [
        'Trouver le CSR de ta région',
        'Prendre un premier contact, même sans dossier complet',
        'Préparer identité, revenus, bail et relevés si possible'
      ],
      bodyIntro: 'Le CSR est souvent la meilleure première porte quand tu ne sais pas par où commencer ou que tu n’as plus assez pour vivre. C’est aussi le service qui examine et octroie le Revenu d’insertion (RI).',
      sections: [
        {
          title: 'Ce qu’il fait',
          items: [
            'Explique ce qu’est le RI et vérifie si tu peux le demander',
            'Évalue le droit au Revenu d’insertion (RI)',
            'Aide à constituer un dossier',
            'Oriente vers d’autres services du canton ou de la commune'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Trouver le CSR de ta région',
            'Prendre un premier contact, même sans dossier complet',
            'Préparer identité, revenus, bail et relevés si possible'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Trouver ton CSR', url: 'https://www.vd.ch/aides-financieres-et-soutien-social/trouver-un-centre-social-regional-csr' },
        { kind: 'action', label: 'Demander le RI', url: window.MONAIDE_LINKS.RI_APPLY },
        { kind: 'info', label: 'Guide détaillé', url: '/centre-social-regional/' }
      ],
      documentationTarget: null
    },
    {
      id: 'parlons-cash',
      title: 'Parlons Cash — dettes et surendettement',
      category: 'financier',
      summary: 'Budget, poursuites, dettes · Repères clairs et orientation',
      audience: 'Personnes dont le budget ne tient plus, avec dettes, rappels ou poursuites.',
      purpose: 'Parlons Cash aide à comprendre la situation, trouver un premier repère et agir avant que les dettes s’aggravent.',
      highlights: [
        'Explications simples et concrètes',
        'Orientation vers les bons services du canton',
        'Utile aussi pour les proches',
        'Jet Service peut aussi aider sur le budget pour les jeunes et les personnes en formation'
      ],
      firstSteps: [
        'Lire les repères de Parlons Cash',
        'Faire le point sur les factures et rappels',
        'Contacter ensuite le bon service si besoin'
      ],
      bodyIntro: 'Si tu as des dettes, des poursuites ou que ton budget ne tient plus, Parlons Cash peut t’aider à y voir plus clair. C’est une bonne première porte pour comprendre la situation et savoir vers qui aller ensuite.',
      sections: [
        {
          title: 'Ce que tu y trouves',
          items: [
            'Explications simples sur dettes et surendettement',
            'Repères concrets pour agir sans attendre',
            'Orientation vers les bons services dans le canton',
            'Infos utiles aussi pour les proches'
          ]
        },
        {
          title: 'Quand l’utiliser',
          items: [
            'Factures qui s’accumulent',
            'Poursuites ou rappels',
            'Budget devenu trop serré',
            'Besoin d’un premier repère avant d’appeler'
          ]
        },
        {
          title: 'Autre porte utile',
          items: [
            'Jet Service si tu as entre 16 et 25 ans',
            'Ou si tu es en formation',
            'Utile pour le budget, les dettes et les démarches liées aux études ou au travail'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'N’hésite pas à appeler si tu as une question ou un doute. Ils sont aussi là pour ça.'
        }
      ],
      links: [
        { kind: 'info', label: 'Guide détaillé', url: '/dettes-budget/' },
        { kind: 'info', label: 'Voir Parlons Cash', url: window.MONAIDE_LINKS.PARLONS_CASH },
        { kind: 'info', label: 'Voir aussi le CSP Vaud', url: window.MONAIDE_LINKS.CSP_HOME },
        { kind: 'info', label: 'Voir aussi Jet Service', url: window.MONAIDE_LINKS.JET_SERVICE }
      ],
      documentationTarget: null
    },
    {
      id: 'bcma',
      title: 'Bureau cantonal de médiation administrative (BCMA)',
      category: 'financier',
      summary: 'Blocage avec une administration cantonale · Médiation gratuite et indépendante',
      audience: 'Personnes qui n’arrivent plus à avancer avec un service de l’État de Vaud ou qui ne comprennent pas une démarche administrative.',
      purpose: 'Le BCMA aide à renouer le dialogue avec une autorité cantonale, à clarifier une situation et à débloquer un différend avec l’administration.',
      highlights: [
        'Gratuit et indépendant',
        'Peut aider quand le dialogue avec l’administration est bloqué',
        'Utile pour clarifier une démarche ou une décision cantonale'
      ],
      firstSteps: [
        'Regarder si ton problème concerne bien une autorité cantonale',
        'Préparer les courriers ou décisions déjà reçus',
        'Contacter le BCMA pour expliquer simplement ce qui bloque'
      ],
      bodyIntro: 'Si tu es bloqué·e avec un service de l’État de Vaud, que tu ne comprends plus une démarche ou qu’un échange tourne en rond, le BCMA peut servir d’intermédiaire. Ce n’est pas un service qui décide à la place de l’administration, mais il peut aider à débloquer la situation.',
      sections: [
        {
          title: 'Quand cette fiche est utile',
          items: [
            'Tu n’arrives plus à avancer avec un service cantonal',
            'Tu ne comprends pas une démarche ou une réponse administrative',
            'Tu veux un intermédiaire neutre pour rétablir le dialogue'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Préparer les courriers, décisions ou échanges déjà reçus',
            'Expliquer simplement ce qui bloque',
            'Le BCMA regarde ensuite s’il peut intervenir ou orienter'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Le BCMA aide pour les rapports avec des <strong>autorités cantonales</strong>. Si le problème concerne une commune, un service privé ou une autorité fédérale, il faudra parfois une autre porte d’entrée.'
        }
      ],
      links: [
        { kind: 'action', label: 'Contacter le BCMA', url: window.MONAIDE_LINKS.BCMA_HOME },
        { kind: 'info', label: 'Médiation administrative : infos', url: window.MONAIDE_LINKS.BCMA_INFO }
      ],
      documentationTarget: null
    },
    {
      id: 'allocations-familiales',
      title: 'Allocations familiales',
      category: 'financier',
      summary: 'Parents avec enfants à charge · Dès le 1er enfant',
      audience: 'Parents avec un enfant à charge qui doivent vérifier par quelle porte passe leur demande.',
      purpose: 'Les allocations familiales soutiennent les parents, mais la demande dépend de la situation professionnelle et ne se fait pas toujours au même endroit.',
      highlights: [
        'Droit possible comme salarié·e, indépendant·e ou sans activité selon les cas',
        'La bonne porte dépend de ta situation',
        'Ce n’est pas automatique'
      ],
      firstSteps: [
        'Identifier si la demande passe par l’employeur, la caisse chômage ou une AAS',
        'Préparer les pièces des enfants',
        'Lancer la démarche sans attendre'
      ],
      bodyIntro: 'Si tu as un enfant à charge, des allocations familiales peuvent exister. Mais elles ne sont pas versées automatiquement : il faut les demander par la bonne porte selon ta situation.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Enfant à charge (< 16 ans ou < 25 ans si formation)',
            'Droit possible comme salarié·e, indépendant·e ou sans activité selon les cas',
            'Domicile en Suisse'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Salarié·e : demande via ton employeur ou sa caisse',
            'Au chômage : s’adresser à la caisse de chômage',
            'Sans activité : demande via une agence AAS'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Voir la démarche selon ta situation', url: window.MONAIDE_LINKS.ALLOCATIONS_INFO },
        { kind: 'info', label: 'Caisse AVS Vaud', url: window.MONAIDE_LINKS.AVS_FAMILY },
        { kind: 'info', label: 'Guide détaillé', url: '/allocations-familiales/' }
      ],
      documentationTarget: null
    },
    {
      id: 'cms',
      title: 'CMS — Soins et aide à domicile',
      category: 'sante',
      summary: 'Personnes malades ou âgées · Maintien à domicile',
      audience: 'Personnes qui ont besoin d’aide au quotidien pour rester chez elles.',
      purpose: 'Les CMS organisent des soins et du soutien à domicile pour éviter que le quotidien devienne ingérable.',
      highlights: [
        'Soins infirmiers, aide à la toilette, repas et téléalarme',
        'Peut démarrer sur prescription médicale ou demande directe',
        'Une partie des soins est prise en charge par la LAMal'
      ],
      firstSteps: [
        'Contacter le réseau AVASAD ou ton CMS de région',
        'Demander à ton médecin une prescription si besoin',
        'Expliquer concrètement ce qui devient difficile au quotidien'
      ],
      bodyIntro: 'Tu veux rester chez toi mais tu as besoin d’aide au quotidien ? Les CMS peuvent envoyer des professionnel·le·s pour les soins, l’aide à la toilette, les repas ou d’autres soutiens utiles à domicile.',
      sections: [
        {
          title: 'Pour quoi',
          items: [
            'Soins infirmiers à domicile',
            'Aide au quotidien et maintien à domicile',
            'Téléalarme, repas ou évaluation de situation selon les besoins'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Contacter l’AVASAD ou ton CMS de région',
            'Passer par ton médecin si une prescription est nécessaire',
            'Décrire les difficultés concrètes du quotidien'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Contacter AVASAD', url: window.MONAIDE_LINKS.CMS_AVASAD },
        { kind: 'info', label: 'Maintien à domicile — État de Vaud', url: window.MONAIDE_LINKS.CMS_VD_INFO }
      ],
      documentationTarget: null
    },
    {
      id: 'pro-infirmis',
      title: 'Pro Infirmis Vaud',
      category: 'sante',
      summary: 'Personnes en situation de handicap · Conseil gratuit',
      audience: 'Personnes en situation de handicap ou avec maladie chronique qui ont besoin d’un accompagnement social.',
      purpose: 'Pro Infirmis aide à clarifier les droits et à avancer dans les démarches liées au handicap, au logement, à l’emploi ou à l’AI.',
      highlights: [
        'Accompagnement gratuit et confidentiel',
        'Utile même si tu ne sais pas encore quelle démarche lancer',
        'Présence dans plusieurs villes du canton'
      ],
      firstSteps: [
        'Appeler Pro Infirmis Vaud',
        'Expliquer simplement ce qui bloque pour toi',
        'Demander un premier rendez-vous ou une orientation'
      ],
      bodyIntro: 'Tu as un handicap ou une maladie chronique ? Pro Infirmis peut t’aider gratuitement dans tes démarches liées à l’AI, au logement, à l’emploi ou aux droits sociaux. Tu n’as pas à gérer ça seul·e.',
      sections: [
        {
          title: 'Pour quoi',
          items: [
            'Questions AI et assurances sociales',
            'Logement, emploi ou vie quotidienne',
            'Accompagnement administratif et social'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Appeler le 021 321 02 00',
            'Lausanne, Nyon, Yverdon et Vevey',
            'Urgences possibles sans rendez-vous selon les situations'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Contacter Pro Infirmis Vaud', url: window.MONAIDE_LINKS.PRO_INFIRMIS }
      ],
      documentationTarget: null
    },
    {
      id: 'sante-sexuelle-profa',
      title: 'Santé sexuelle — PROFA',
      category: 'sante',
      summary: 'Contraception, dépistage, grossesse imprévue, questions intimes',
      audience: 'Personnes qui ont besoin d’un lieu sûr pour parler de santé sexuelle, de contraception, de dépistage ou de grossesse.',
      purpose: 'PROFA permet de poser des questions intimes, faire un dépistage, parler de contraception ou être accompagné·e dans une grossesse imprévue.',
      highlights: [
        'Consultations sans jugement',
        'Centres dans plusieurs villes du canton',
        'Bon premier relais si tu ne sais pas encore par où commencer'
      ],
      firstSteps: [
        'Chercher le centre PROFA le plus proche',
        'Prendre contact rapidement si la question est urgente',
        'Venir avec tes questions, même si tu ne sais pas exactement quoi demander'
      ],
      bodyIntro: 'Tu peux aller chez PROFA pour des questions de contraception, de dépistage, de grossesse imprévue, d’orientation sexuelle, d’identité de genre ou simplement si tu as besoin d’un lieu de parole sans jugement.',
      sections: [
        {
          title: 'Pour quoi',
          items: [
            'Dépistage VIH / IST',
            'Contraception et pilule d’urgence',
            'Grossesse imprévue ou interruption de grossesse',
            'Questions sur la vie affective ou sexuelle'
          ]
        },
        {
          title: 'Bon à savoir',
          items: [
            'Entretiens d’information et de prévention gratuits',
            'Tarifs adaptés selon les situations',
            'Centres dans plusieurs villes du canton',
            'Tu peux y aller même si tu ne sais pas encore par quoi commencer'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Si tu as besoin de parler vite à quelqu’un pour une grossesse imprévue ou une question urgente, contacte sans attendre un centre PROFA, ton/ta gynécologue ou une consultation de santé sexuelle.'
        }
      ],
      links: [
        { kind: 'action', label: 'Consulter PROFA', url: window.MONAIDE_LINKS.PROFA_HOME },
        { kind: 'action', label: 'Trouver un centre PROFA', url: window.MONAIDE_LINKS.PROFA_CENTRES },
        { kind: 'info', label: 'Infos Vaud — grossesse imprévue / IG', url: window.MONAIDE_LINKS.VAUD_GROSSESSE_INFO }
      ],
      documentationTarget: null
    },
    {
      id: 'l-check',
      title: 'L-Check — santé sexuelle inclusive',
      category: 'sante',
      summary: 'FSF, personnes trans et partenaires · Espace safe · Renens',
      audience: 'Personnes qui cherchent un lieu plus ciblé et plus rassurant pour parler de santé sexuelle, de genre ou d’orientation.',
      purpose: 'L-Check est une consultation inclusive portée par PROFA, pensée pour les personnes qui ne se sentent pas à l’aise dans un cadre plus classique.',
      highlights: [
        'Approche inclusive et communautaire',
        'Consultations sur rendez-vous',
        'Utile pour santé sexuelle, suivi gynécologique ou questions de genre'
      ],
      firstSteps: [
        'Voir L-Check',
        'Prendre rendez-vous',
        'Choisir ce lieu si tu veux un cadre plus safe et plus ciblé'
      ],
      bodyIntro: 'L-Check est une consultation de santé sexuelle portée par PROFA à Renens. C’est un espace plus ciblé pour les femmes* qui ont des relations sexuelles avec des femmes, les personnes trans et leurs partenaires, avec une approche safe et sans jugement.',
      sections: [
        {
          title: 'Pour quoi',
          items: [
            'Dépistage et suivi en santé sexuelle',
            'Contrôle gynécologique',
            'Questions sur l’identité de genre ou l’orientation sexuelle',
            'Espace d’écoute et de soutien'
          ]
        },
        {
          title: 'Bon à savoir',
          items: [
            'Consultations sur rendez-vous',
            'Approche communautaire et inclusive',
            'Lieu adapté si tu ne te sens pas à l’aise dans un suivi plus classique'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Si tu cherches un lieu plus ciblé et plus rassurant pour parler de santé sexuelle, L-Check peut être un meilleur point d’entrée qu’une consultation classique.'
        }
      ],
      links: [
        { kind: 'action', label: 'Voir L-Check', url: window.MONAIDE_LINKS.PROFA_LCHECK },
        { kind: 'action', label: 'Trouver un centre PROFA', url: window.MONAIDE_LINKS.PROFA_CENTRES }
      ],
      documentationTarget: null
    },
    {
      id: 'voqueer',
      title: 'Voqueer — soutien LGBTQIA+',
      category: 'sante',
      summary: 'Infos, soutien, groupes, ressources communautaires dans le canton',
      audience: 'Personnes LGBTQIA+ ou proches qui cherchent soutien, repères ou ressources dans le canton.',
      purpose: 'Voqueer peut être une bonne première porte si tu cherches du soutien communautaire, des groupes ou des ressources LGBTQIA+ vaudoises.',
      highlights: [
        'Association communautaire vaudoise',
        'Utile en complément d’un suivi médical ou social',
        'Repères et ressources pour toi ou tes proches'
      ],
      firstSteps: [
        'Voir Voqueer',
        'Regarder les groupes et ressources proposés',
        'Utiliser aussi PROFA ou L-Check si tu as besoin d’un suivi santé'
      ],
      bodyIntro: 'Voqueer est une association vaudoise pour la diversité sexuelle et de genre. Ce n’est pas une consultation médicale, mais cela peut être une vraie bonne porte d’entrée si tu cherches du soutien, des repères, des groupes ou des ressources LGBTQIA+ dans le canton.',
      sections: [
        {
          title: 'Tu peux y trouver',
          items: [
            'Infos et orientation',
            'Groupes, activités et espaces communautaires',
            'Soutien pour les proches et les familles',
            'Repères vers des ressources plus spécifiques si besoin'
          ]
        },
        {
          title: 'Quand c’est utile',
          items: [
            'Si tu te poses des questions sur ton orientation ou ton identité',
            'Si tu cherches un cadre plus safe ou communautaire',
            'Si tu veux rencontrer des ressources LGBTQIA+ vaudoises'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Voqueer peut compléter PROFA ou L-Check si tu cherches aussi du soutien communautaire, pas seulement une consultation.'
        }
      ],
      links: [
        { kind: 'action', label: 'Voir Voqueer', url: window.MONAIDE_LINKS.VOQUEER },
        { kind: 'info', label: 'Ressources Vaud', url: window.MONAIDE_LINKS.VAUD_QUEER_RESOURCES }
      ],
      documentationTarget: null
    },
    {
      id: 'lavi',
      title: 'LAVI — Aide aux victimes',
      category: 'urgence',
      summary: 'Violence conjugale, agression, abus · Gratuit · Confidentiel',
      audience: 'Personnes qui ont subi une violence, une agression, des abus ou une autre infraction pénale.',
      purpose: 'La LAVI offre un soutien gratuit et confidentiel aux victimes, avec accompagnement social, juridique et psychologique.',
      highlights: [
        'Gratuit et confidentiel',
        'Pas besoin de déposer plainte pour demander de l’aide',
        'Ouvert quel que soit le statut de séjour'
      ],
      firstSteps: [
        'Contacter le centre LAVI Vaud',
        'Demander un premier entretien',
        'Expliquer simplement ce qui s’est passé, même si tout n’est pas clair'
      ],
      bodyIntro: 'Tu as vécu une violence physique, sexuelle ou psychologique ? La LAVI t’offre un soutien gratuit et confidentiel : conseil, accompagnement, aide financière dans certains cas. Tu n’as pas à porter ça seul·e.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Toute personne victime d’une infraction pénale',
            'Quel que soit ton statut de séjour',
            'Avec ou sans plainte déposée'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Contacter directement le centre LAVI',
            'Pas besoin de déposer plainte pour bénéficier de l’aide',
            'Accompagnement juridique et psychologique possible'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'LAVI Vaud', url: window.MONAIDE_LINKS.LAVI_INFO },
        { kind: 'action', label: 'Centre LAVI Lausanne', url: window.MONAIDE_LINKS.LAVI_LAUSANNE }
      ],
      documentationTarget: null
    },
    {
      id: 'brapa',
      title: 'BRAPA — avances sur pensions alimentaires',
      category: 'financier',
      summary: 'Parent séparé·e · Pension non versée · Tout le canton',
      audience: 'Parents séparé·es qui ne reçoivent pas la pension alimentaire fixée par décision.',
      purpose: 'Le BRAPA peut avancer la pension non payée et t’aider à faire respecter les versements dus.',
      highlights: [
        'Avance les montants dans certains cas',
        'Peut aussi intervenir sur les allocations familiales non reversées',
        'Démarche gratuite'
      ],
      firstSteps: [
        'Contacter le BRAPA',
        'Rassembler la décision judiciaire et les preuves de non-paiement',
        'Attendre ensuite le questionnaire ou le rendez-vous'
      ],
      bodyIntro: 'L’autre parent ne paie pas la pension alimentaire fixée par le juge ? Le BRAPA peut avancer les montants à ta place et se charger ensuite de les récupérer. Tu n’as pas à te battre seul·e.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Décision judiciaire valable',
            'Pension non versée depuis au moins 1 mois',
            'Revenus inférieurs aux seuils BRAPA',
            'Domicile dans le canton de Vaud'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Appeler le 021 316 52 21',
            'Remplir ensuite le questionnaire transmis',
            'Préparer jugement, coordonnées et justificatifs utiles'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Le BRAPA peut aussi t’aider à obtenir le versement direct des allocations familiales si l’autre parent ne te les transfère pas.'
        }
      ],
      links: [
        { kind: 'action', label: 'Demander une avance BRAPA', url: window.MONAIDE_LINKS.BRAPA_APPLY },
        { kind: 'action', label: 'Contacter le BRAPA', url: window.MONAIDE_LINKS.BRAPA_CONTACT }
      ],
      documentationTarget: null
    },
    {
      id: 'laci',
      title: 'Assurance chômage (LACI)',
      category: 'emploi',
      summary: 'Personnes ayant perdu leur emploi · 12 mois cotisés AVS',
      audience: 'Personnes qui ont perdu leur emploi et doivent s’inscrire rapidement au chômage.',
      purpose: 'La LACI remplace une partie du salaire après une perte d’emploi, à condition de remplir les critères de cotisation et de disponibilité.',
      highlights: [
        'L’inscription à l’ORP doit se faire vite',
        'Le droit dépend des cotisations AVS',
        'Suivi ORP et recherches d’emploi obligatoires'
      ],
      firstSteps: [
        'S’inscrire à l’ORP sans attendre',
        'Préparer les pièces de fin de contrat',
        'Vérifier ensuite les indemnités avec la caisse chômage'
      ],
      bodyIntro: 'Tu as perdu ton emploi ? Si tu as cotisé à l’AVS pendant au moins 12 mois dans les 2 dernières années, tu peux avoir droit aux indemnités chômage. L’inscription à l’ORP doit se faire le plus vite possible.',
      sections: [
        {
          title: 'Conditions',
          items: [
            '12 mois de cotisation AVS dans les 2 dernières années',
            'Domicile en Suisse',
            'Disponible et apte au placement'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'S’inscrire à l’ORP dès la fin du contrat',
            'Préparer attestation employeur et certificat de travail',
            'Puis suivre les recherches d’emploi et convocations'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'S’inscrire à l’ORP', url: window.MONAIDE_LINKS.ORP_REGISTER },
        { kind: 'info', label: 'Infos chômage (LACI)', url: window.MONAIDE_LINKS.LACI_INFO },
        { kind: 'info', label: 'Guide détaillé', url: '/chomage-laci/' }
      ],
      documentationTarget: null
    },
    {
      id: 'rente-pont',
      title: 'Rente-pont AVS — l’aide la plus méconnue',
      category: 'emploi',
      summary: '60 ans et plus · Chômage en fin de droits · Très peu demandée',
      audience: 'Personnes de 60 ans ou plus qui arrivent en fin de droits au chômage.',
      purpose: 'La rente-pont AVS soutient certaines personnes proches de la retraite après l’épuisement des indemnités chômage.',
      highlights: [
        'Utile entre la fin du chômage et l’âge AVS',
        'Peu connue alors qu’elle peut éviter une chute brutale de revenus',
        'Conditions liées à l’âge, aux cotisations et à la fortune'
      ],
      firstSteps: [
        'Lire les conditions officielles',
        'Préparer les informations chômage et AVS',
        'Contacter la caisse AVS si la piste se confirme'
      ],
      bodyIntro: 'Tu as 60 ans ou plus et tu arrives en fin de droits chômage ? Cette aide existe pour toi et presque personne ne la connaît. Elle peut faire le lien jusqu’à la retraite AVS.',
      sections: [
        {
          title: 'Conditions',
          items: [
            '60 ans ou plus',
            'Indemnités chômage épuisées',
            'Durée minimale de cotisations AVS',
            'Fortune sous les seuils légaux'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Se renseigner dès la fin des droits chômage',
            'Préparer les décisions chômage et éléments AVS',
            'Faire la demande auprès de la caisse compétente'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Rente-pont AVS', url: window.MONAIDE_LINKS.RENTE_PONT_INFO }
      ],
      documentationTarget: null
    },
    {
      id: 'evam',
      title: 'EVAM — Permis N, F et S',
      category: 'migration',
      summary: 'Procédure d’asile, admission provisoire, protection temporaire',
      audience: 'Personnes en procédure d’asile ou relevant déjà du dispositif EVAM.',
      purpose: 'L’EVAM est souvent la première porte pour l’hébergement, l’accompagnement social et le soutien de base dans le cadre asile.',
      highlights: [
        'Premier relais pour permis N, F et S dans beaucoup de situations',
        'Le cadre EVAM ne fonctionne pas comme les aides ordinaires',
        'Utile aussi pour comprendre à qui appartient déjà ton suivi'
      ],
      firstSteps: [
        'Vérifier si ta situation dépend déjà de l’EVAM',
        'Contacter l’EVAM si tu es dans ce cadre',
        'Passer au CSP Fraternité pour les questions de permis ou de courrier'
      ],
      bodyIntro: 'Tu es en procédure d’asile (permis N), admis·e provisoirement (permis F) ou protégé·e temporairement (permis S) ? L’EVAM est souvent le premier relais pour l’accompagnement social, l’hébergement et le soutien de base.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Permis N : procédure d’asile',
            'Permis F : admission provisoire',
            'Permis S : protection temporaire',
            'Accompagnement variable selon la situation'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Contacter l’EVAM si tu dépends de ce dispositif',
            'Poser les questions de permis ou renouvellement au CSP Fraternité',
            'Ne pas supposer que les aides ordinaires s’appliquent automatiquement'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'EVAM Vaud', url: window.MONAIDE_LINKS.EVAM_HOME },
        { kind: 'info', label: 'Aide aux migrants — État de Vaud', url: window.MONAIDE_LINKS.EVAM_VD_INFO }
      ],
      documentationTarget: null
    },
    {
      id: 'appartenances',
      title: 'Appartenances — soutien aux personnes migrantes',
      category: 'migration',
      summary: 'Toutes nationalités et statuts · Conseil gratuit',
      audience: 'Personnes migrantes qui ont besoin d’un accompagnement social, psy ou administratif.',
      purpose: 'Appartenances propose un soutien global pour des démarches qu’on ne comprend pas toujours seul·e.',
      highlights: [
        'Gratuit et confidentiel',
        'Interprétariat possible',
        'Approche sociale et psychologique'
      ],
      firstSteps: [
        'Contacter Appartenances',
        'Expliquer ce qui bloque concrètement',
        'Demander un premier rendez-vous ou une orientation'
      ],
      bodyIntro: 'Tu te débrouilles seul·e avec des démarches que tu ne comprends pas forcément ? Appartenances propose un accompagnement gratuit — juridique, social, psy — pour les personnes migrantes et leurs proches.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Toutes nationalités et statuts de séjour',
            'Gratuit et confidentiel',
            'Interprétariat disponible'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Appeler le 021 341 12 40',
            'Lausanne et antennes dans le canton',
            'Urgences possibles selon les situations'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Appartenances Vaud', url: window.MONAIDE_LINKS.APPARTENANCES }
      ],
      documentationTarget: null
    },
    {
      id: 'fraternite',
      title: 'La Fraternité CSP Vaud — questions de migration',
      category: 'migration',
      summary: 'Toute personne étrangère ou suisse · Gratuit · Sans rendez-vous',
      audience: 'Personnes qui se posent des questions sur le permis, le séjour, l’asile, le regroupement familial ou les droits des sans-papiers.',
      purpose: 'La Fraternité aide à comprendre les courriers, le statut, les démarches migration et la bonne stratégie avant de déposer quoi que ce soit.',
      highlights: [
        'Permanences collectives sans rendez-vous',
        'Utile pour permis, régularisation, regroupement familial ou asile',
        'Très bonne première porte si tu ne comprends pas un courrier'
      ],
      firstSteps: [
        'Lire les thèmes traités',
        'Aller à une permanence régionale',
        'Prendre avec toi les courriers ou décisions déjà reçus'
      ],
      bodyIntro: 'La Fraternité du CSP Vaud répond à toutes les questions liées à la migration : permis de séjour, regroupement familial, asile, droits des sans-papiers. Les permanences sont gratuites, collectives et sans rendez-vous dans plusieurs régions.',
      sections: [
        {
          title: 'Thèmes traités',
          items: [
            'Permis de séjour et régularisation',
            'Regroupement familial',
            'Procédure d’asile',
            'Droits des sans-papiers'
          ]
        },
        {
          title: 'Permanences',
          items: [
            'Lausanne, Renens, Vevey, Nyon, Yverdon, Payerne, Orbe',
            'Sans rendez-vous — format collectif',
            '021 560 60 60 pour plus d’infos',
            'Gratuit et confidentiel'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'La Fraternité — CSP Vaud', url: window.MONAIDE_LINKS.CSP_MIGRATION },
        { kind: 'action', label: 'Permanences régionales', url: window.MONAIDE_LINKS.CSP_MIGRATION_HOURS }
      ],
      documentationTarget: null
    },
    {
      id: 'passculture',
      title: 'Passculture',
      category: 'culture',
      summary: 'Jeunes en formation postobligatoire · Tarif culturel à 5 CHF',
      audience: 'Jeunes en formation postobligatoire dans le canton qui veulent accéder à des sorties culturelles à petit prix.',
      purpose: 'Le Passculture donne accès à des billets à prix réduit dans de nombreux lieux culturels partenaires.',
      highlights: [
        'Tarif à 5 CHF',
        'Pas d’inscription préalable',
        'Très utile si tu es en gymnase, apprentissage ou autre formation concernée'
      ],
      firstSteps: [
        'Voir les conditions du Passculture',
        'Regarder les lieux partenaires',
        'Venir avec ta carte de légitimation'
      ],
      bodyIntro: 'Tu es au gymnase, en apprentissage ou dans une autre formation postobligatoire vaudoise ? Le Passculture donne accès à des billets à 5 CHF dans de nombreux lieux culturels du canton.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Gymnases et écoles professionnelles',
            'Apprentissages',
            'École de la Transition et École de l’Accueil',
            'Carte de légitimation en cours de validité'
          ]
        },
        {
          title: 'Comment faire',
          items: [
            'Choisir un lieu culturel partenaire',
            'Réserver ou acheter le billet au tarif Passculture',
            'Montrer sa carte de légitimation',
            'Pas d’inscription préalable'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Infos Passculture', url: window.MONAIDE_LINKS.PASSCULTURE_INFO },
        { kind: 'info', label: 'Lieux partenaires', url: window.MONAIDE_LINKS.PASSCULTURE_PARTNERS }
      ],
      documentationTarget: null
    },
    {
      id: 'epicerie-caritas',
      title: 'Épicerie Caritas — Lausanne',
      category: 'petitbudget',
      summary: 'Courses du quotidien · Petits budgets · Lausanne',
      audience: 'Personnes et familles dont le budget courses devient trop lourd.',
      purpose: 'L’Épicerie Caritas permet d’acheter l’essentiel à prix réduit quand le budget ne suit plus.',
      highlights: [
        'Produits alimentaires et du quotidien à prix réduit',
        'Très utile si chaque course devient un stress',
        'Bon repère si tu as déjà une aide, un subside ou une carte adaptée'
      ],
      firstSteps: [
        'Vérifier si tu peux obtenir une carte d’achat ou un accès',
        'Regarder les infos Caritas',
        'Demander à un service social si tu n’es pas sûr·e du fonctionnement'
      ],
      bodyIntro: 'Si faire les courses devient trop lourd, l’Épicerie Caritas permet d’acheter de l’alimentaire et des produits du quotidien à prix réduit. C’est une bonne piste quand le budget ne suit plus.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Personnes et familles avec petit budget',
            'Selon les cas avec CarteCulture ou carte d’achat Caritas',
            'Produits de base, frais et hygiène à prix réduit'
          ]
        },
        {
          title: 'Comment faire',
          items: [
            'Vérifier si tu peux obtenir une carte d’achat',
            'Prendre ta carte avec toi en magasin',
            'À Lausanne : avenue de Morges 26',
            'Si tu hésites, demande à Caritas ou à un service social'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Épicerie Caritas', url: 'https://caritas-regio.ch/fr/prestations/petits-budgets/epicerie-caritas' },
        { kind: 'info', label: 'Infos Lausanne', url: 'https://caritas-regio.ch/fr/a-propos-de-caritas/vaud/news/lepicerie-caritas-de-lausanne-ouvre-ses-portes-a-lavenue-de-morges-26' }
      ],
      documentationTarget: null
    },
    {
      id: 'caritas-vetements',
      title: 'Boutiques de vêtements Caritas — Lausanne',
      category: 'petitbudget',
      summary: 'Habits et accessoires · Seconde main · Lausanne',
      audience: 'Personnes qui ont besoin de vêtements corrects sans dépenser trop.',
      purpose: 'Les boutiques Caritas offrent une solution simple pour s’habiller à petit prix.',
      highlights: [
        'Seconde main et petits prix',
        'Utile pour s’équiper vite sans trop dépenser',
        'Ouvert à tout le monde'
      ],
      firstSteps: [
        'Regarder les points de vente Caritas',
        'Voir les repères à Lausanne',
        'Passer en boutique avec le budget que tu peux te permettre'
      ],
      bodyIntro: 'Si tu as besoin d’habits corrects sans dépenser trop, les boutiques Caritas sont une bonne piste. Tu y trouves des vêtements, chaussures et accessoires à petit prix, simplement.',
      sections: [
        {
          title: 'Ce qu’on y trouve',
          items: [
            'Vêtements femme, homme et enfant',
            'Chaussures, sacs et accessoires',
            'Seconde main et parfois fins de série',
            'Rabais supplémentaires avec certaines cartes Caritas'
          ]
        },
        {
          title: 'Repères à Lausanne',
          items: [
            'Une boutique au Tunnel',
            'Une autre près de l’épicerie, avenue de Morges',
            'Ouvert à tout le monde',
            'Pratique si tu dois t’équiper vite'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Seconde main Caritas', url: 'https://caritas-regio.ch/fr/prestations/petits-budgets/seconde-main' },
        { kind: 'info', label: 'Caritas Vaud', url: 'https://caritas-regio.ch/fr/a-propos-de-caritas/vaud' }
      ],
      documentationTarget: null
    },
    {
      id: 'boutique-csp-palud',
      title: 'Boutique CSP Vaud — Palud',
      category: 'petitbudget',
      summary: 'Vêtements d’occasion · Centre de Lausanne · Prix solidaires',
      audience: 'Personnes qui cherchent des habits à petit prix au centre de Lausanne.',
      purpose: 'La boutique du CSP près de la Palud est une piste directe pour s’équiper sans aller loin ni dépenser beaucoup.',
      highlights: [
        'Très central à Lausanne',
        'Prix solidaires',
        'Simple et direct si tu veux t’équiper vite'
      ],
      firstSteps: [
        'Voir la boutique CSP de Lausanne',
        'Regarder les horaires',
        'Passer sur place si tu es déjà au centre-ville'
      ],
      bodyIntro: 'Au centre de Lausanne, près de la Palud, le CSP a une boutique de vêtements d’occasion utile si tu veux t’équiper sans aller loin ni dépenser beaucoup. C’est une piste simple et directe en ville.',
      sections: [
        {
          title: 'Ce qu’on y trouve',
          items: [
            'Vêtements d’occasion',
            'Pièces homme et femme',
            'Quelques marques à prix très bas',
            'Livres d’occasion au rez-de-chaussée'
          ]
        },
        {
          title: 'Pratique',
          items: [
            '9, Escaliers-du-Marché, 1003 Lausanne',
            'Près de la place de la Palud',
            'Mar–ven : 10h–18h30',
            'Sam : 10h–15h'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Voir la boutique de Lausanne', url: 'https://csp.ch/vaud/une-nouvelle-boutique-de-vetements-au-centre-de-lausanne/' },
        { kind: 'info', label: 'Galetas et boutiques CSP', url: 'https://csp.ch/vaud/galetas-et-boutiques/' }
      ],
      documentationTarget: null
    },
    {
      id: 'galetas-csp',
      title: 'Galetas du CSP Vaud — meubles & objets à petits prix',
      category: 'petitbudget',
      summary: 'Meubles, vêtements, électroménager · Prix solidaires · 6 sites dans le canton',
      audience: 'Personnes qui doivent meubler un logement ou se rééquiper avec très peu de budget.',
      purpose: 'Les Galetas du CSP permettent de s’équiper pour un logement ou la vie quotidienne à prix très bas.',
      highlights: [
        'Très utile quand on s’installe ou qu’on recommence',
        'Meubles, électroménager, vêtements et objets',
        'Plusieurs sites dans le canton'
      ],
      firstSteps: [
        'Voir les Galetas du CSP ou galetas.ch',
        'Regarder le site le plus proche',
        'Prévoir le transport si tu cherches des meubles'
      ],
      bodyIntro: 'Tu dois meubler un logement sans budget ? Les Galetas du CSP Vaud vendent meubles, électroménager, habits et objets du quotidien à prix très bas. C’est une piste très utile quand on s’installe ou qu’on recommence.',
      sections: [
        {
          title: 'Ce qu’on y trouve',
          items: [
            'Meubles (lits, tables, armoires, canapés)',
            'Électroménager et vaisselle',
            'Vêtements pour toute la famille',
            'Livres, jouets, bijoux et objets déco'
          ]
        },
        {
          title: 'Repères',
          items: [
            'Mont-sur-Lausanne, Morges, Montreux, Payerne, Renens',
            'Le plus grand site est au Mont-sur-Lausanne',
            'Ramassage à domicile possible pour certains objets',
            'Horaires et adresses sur galetas.ch'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: '6 sites dans le canton : regarde d’abord l’adresse et les horaires avant de te déplacer.'
        }
      ],
      links: [
        { kind: 'info', label: 'Galetas CSP Vaud', url: 'https://csp.ch/vaud/galetas-et-boutiques/' },
        { kind: 'info', label: 'galetas.ch', url: 'https://www.galetas.ch' }
      ],
      documentationTarget: null
    },
    {
      id: 'emmaus',
      title: 'Emmaüs Étagnières — brocante solidaire',
      category: 'petitbudget',
      summary: 'Meubles, objets, vêtements · Plus de 1’000m² · Étagnières',
      audience: 'Personnes qui cherchent beaucoup d’équipement d’un coup à petit prix.',
      purpose: 'Emmaüs est utile pour meubler, s’habiller ou récupérer des objets du quotidien dans un même lieu.',
      highlights: [
        'Très grand choix au même endroit',
        'Meubles, habits, hi-fi, livres, objets',
        'Ramassage à domicile selon les besoins'
      ],
      firstSteps: [
        'Voir le magasin Emmaüs',
        'Regarder les horaires avant de partir',
        'Prévoir un moyen de transport si tu cherches du mobilier'
      ],
      bodyIntro: 'Emmaüs Étagnières propose une grande brocante solidaire avec meubles, habits et objets à petit prix. C’est pratique si tu cherches beaucoup de choses au même endroit.',
      sections: [
        {
          title: 'Ce qu’on y trouve',
          items: [
            'Meubles et rangements',
            'Canapés, tables, chaises, bibliothèques',
            'Hi-fi, électronique, livres, vinyles',
            'Vêtements et décoration'
          ]
        },
        {
          title: 'Pratique',
          items: [
            'Rue de la Combe 39, 1037 Étagnières',
            'Lu–ve : 10h–12h et 13h–17h',
            'Sa : 9h–16h30',
            'Ramassage à domicile gratuit sur rendez-vous'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Emmaüs Vaud', url: 'https://www.emmaus-vd.ch' },
        { kind: 'info', label: 'Le magasin', url: 'https://www.emmaus-vd.ch/le-magasin' }
      ],
      documentationTarget: null
    },
    {
      id: 'brocki-lausanne',
      title: 'Armée du Salut — Brocki Lausanne',
      category: 'petitbudget',
      summary: 'Meubles, vêtements, objets · Prix modestes · Ramassage à domicile',
      audience: 'Personnes qui cherchent une option simple d’occasion à Lausanne.',
      purpose: 'La Brocki de l’Armée du Salut permet de s’équiper à prix modestes en meubles, habits et objets du quotidien.',
      highlights: [
        'Occasion simple et accessible à Lausanne',
        'Meubles, vêtements et objets du quotidien',
        'Ramassage ou débarras possibles selon les besoins'
      ],
      firstSteps: [
        'Voir la Brocki de Lausanne',
        'Regarder les horaires',
        'Prévoir le transport si tu cherches des meubles'
      ],
      bodyIntro: 'La Brocki de l’Armée du Salut vend meubles, habits et objets du quotidien à prix modestes. C’est une bonne option si tu cherches de l’occasion simple et accessible à Lausanne.',
      sections: [
        {
          title: 'Ce qu’on y trouve',
          items: [
            'Meubles et électroménager',
            'Vêtements pour toute la famille',
            'Vaisselle, livres, outils, jouets',
            'Objets électroniques d’occasion'
          ]
        },
        {
          title: 'Pratique',
          items: [
            'Avenue du Temple 20, 1012 Lausanne',
            'Ma–ve : 10h–12h et 14h–18h30',
            'Sa : 10h–17h',
            'Ramassage à domicile gratuit pour objets en bon état'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Armée du Salut Lausanne', url: 'https://armeedusalut.ch/trouver-de-laide/' }
      ],
      documentationTarget: null
    },
    {
      id: 'croix-rouge-vaudoise',
      title: 'Croix-Rouge vaudoise — aide et accompagnement',
      category: 'logement',
      summary: 'Situations de vulnérabilité · Aîné·es · Familles · Précarité',
      audience: 'Personnes fragilisées qui ont besoin d’un appui concret dans le quotidien.',
      purpose: 'La Croix-Rouge vaudoise propose des aides pratiques et un accompagnement pour des situations de vulnérabilité variées.',
      highlights: [
        'Aide concrète du quotidien',
        'Utile pour aîné·es, familles ou situations de précarité',
        'Présence dans tout le canton'
      ],
      firstSteps: [
        'Voir les aides disponibles',
        'Contacter la Croix-Rouge vaudoise',
        'Expliquer la situation concrète qui pose problème'
      ],
      bodyIntro: 'La Croix-Rouge vaudoise propose une aide concrète aux personnes en situation de vulnérabilité : accompagnement, aide aux aîné·es, garde d’enfants malades, orientation sociale.',
      sections: [
        {
          title: 'Prestations',
          items: [
            'Accompagnement à domicile pour les aîné·es',
            'Garde d’enfants malades',
            'Transport de personnes à mobilité réduite',
            'Orientation et soutien social'
          ]
        },
        {
          title: 'Pratique',
          items: [
            'Rue Beau-Séjour 9-13, 1003 Lausanne',
            '021 340 00 99',
            'Présence dans tout le canton',
            'Biens de première nécessité possibles selon les situations'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Croix-Rouge vaudoise', url: 'https://croixrougevaudoise.ch/jai-besoin-daide/' }
      ],
      documentationTarget: null
    },
    {
      id: 'menace-expulsion',
      title: 'Menace d’expulsion — que faire ?',
      category: 'logement',
      summary: 'Locataires en difficulté · Urgence — agir immédiatement',
      audience: 'Locataires qui ont reçu une résiliation ou craignent de perdre leur logement.',
      purpose: 'Cette fiche aide à réagir vite et dans le bon ordre quand le logement est menacé.',
      highlights: [
        'Urgence réelle',
        'Délais légaux courts',
        'Ne jamais quitter le logement sans décision de justice'
      ],
      firstSteps: [
        'Contacter vite le CSR si la situation est financière',
        'Contacter l’ASLOCA Vaud',
        'Garder tous les courriers et ne rien ignorer'
      ],
      bodyIntro: 'Tu as reçu une lettre de résiliation ? Ne panique pas, mais agis vite. Tu as des droits et des délais. Ne quitte pas ton logement sans décision de justice.',
      sections: [
        {
          title: 'Repères',
          items: [
            'Tout locataire en Suisse a des droits et des délais',
            'Délai légal de contestation souvent de 30 jours',
            'Une prolongation de bail peut parfois être demandée'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Contacter immédiatement le CSR si le loyer n’est plus tenable',
            'Contacter l’ASLOCA pour la défense des locataires',
            'Ne jamais quitter le logement sans décision judiciaire'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'ASLOCA Vaud', url: window.MONAIDE_LINKS.ASLOCA_VAUD },
        { kind: 'info', label: 'CSP Vaud', url: window.MONAIDE_LINKS.CSP_HOME },
        { kind: 'info', label: 'Guide détaillé', url: '/aides-logement/' }
      ],
      documentationTarget: null
    },
    {
      id: 'jet-service',
      title: 'CSP Jet Service — service social jeunes',
      category: 'formation',
      summary: '16–25 ans & toute personne en formation · Gratuit · Confidentiel',
      audience: 'Jeunes ou personnes en formation qui ont besoin d’un appui sur leurs droits, leur budget, leur travail ou leur formation.',
      purpose: 'Jet Service aide à faire le point sur des questions sociales, juridiques ou financières liées à la jeunesse et à la formation.',
      highlights: [
        'Consultations sociales et juridiques gratuites',
        'Très utile pour bourses, contrat de travail, dettes ou logement',
        'Présent dans plusieurs villes du canton'
      ],
      firstSteps: [
        'Voir Jet Service',
        'Regarder le lieu de permanence le plus proche',
        'Venir avec tes questions et tes papiers utiles'
      ],
      bodyIntro: 'Tu es jeune ou en formation et tu as des questions sur tes droits, tes bourses, un problème avec un employeur ou des dettes ? Jet Service offre des consultations sociales et juridiques gratuites dans plusieurs lieux du canton.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Jeunes de 16 à 25 ans',
            'Toute personne en formation',
            'Gratuit et confidentiel'
          ]
        },
        {
          title: 'Thèmes traités',
          items: [
            'Bourses d’études',
            'Droit du travail et contrats',
            'Dettes, budget et problèmes financiers',
            'Assurances sociales et logement'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Lausanne, Vevey, Yverdon, Payerne, Aigle : avec ou sans rendez-vous selon les sites.'
        }
      ],
      links: [
        { kind: 'action', label: 'Jet Service — CSP Vaud', url: window.MONAIDE_LINKS.JET_SERVICE }
      ],
      documentationTarget: null
    },
    {
      id: 'pro-senectute',
      title: 'Pro Senectute Vaud — services pour les 60+',
      category: 'sante',
      summary: '60 ans et plus · Conseil administratif et social gratuit',
      audience: 'Personnes de 60 ans et plus qui ont besoin d’aide dans leurs démarches ou leur quotidien.',
      purpose: 'Pro Senectute aide à faire le point sur les droits, les démarches et certaines difficultés du quotidien après 60 ans.',
      highlights: [
        'Gratuit et sans jugement',
        'Très utile pour AVS, PC, impôts et démarches administratives',
        'Permanences dans tout le canton'
      ],
      firstSteps: [
        'Contacter Pro Senectute Vaud',
        'Expliquer ce qui te pose problème',
        'Préparer les courriers ou décisions utiles si tu en as'
      ],
      bodyIntro: 'Tu as 60 ans ou plus ? Pro Senectute t’aide avec tes démarches administratives, tes impôts, tes droits AVS et PC. Gratuit, sans jugement.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            '60 ans et plus',
            'Domicile dans le canton',
            'Quel que soit ton statut'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Appeler le 021 646 17 21',
            'Permanences dans tout le canton',
            'Accueil de jour dans plusieurs communes'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Pro Senectute Vaud', url: window.MONAIDE_LINKS.PRO_SENECTUTE }
      ],
      documentationTarget: null
    },
    {
      id: 'addiction-vaud',
      title: 'Addiction Vaud — informations & orientation',
      category: 'sante',
      summary: 'Alcool, drogues, jeux, écrans · Gratuit · Confidentiel',
      audience: 'Personnes concernées par une addiction ou proches qui cherchent un premier repère.',
      purpose: 'Addiction Vaud aide à faire le point, à se situer et à trouver le bon relais dans le canton.',
      highlights: [
        'Infos claires et sans jugement',
        'Tests d’auto-évaluation disponibles',
        'Utile aussi pour les proches'
      ],
      firstSteps: [
        'Consulter Addiction Vaud',
        'Faire un test si tu veux un premier repère',
        'Appeler si tu veux parler à quelqu’un sans t’engager'
      ],
      bodyIntro: 'Tu te poses des questions sur ta consommation ou celle d’un proche ? Addiction Vaud offre des informations claires, des tests d’auto-évaluation et une orientation vers les ressources vaudoises adaptées.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Toute personne concernée par une addiction',
            'Proches et familles',
            'Professionnel·les du canton'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Site avec tests d’auto-évaluation',
            '021 811 51 74 pour une orientation',
            'Confidentiel — pas besoin de s’identifier'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Géré par REL’IER (Fondation Le Relais) — soutenu par le canton de Vaud.'
        }
      ],
      links: [
        { kind: 'info', label: 'Addiction Vaud', url: window.MONAIDE_LINKS.ADDICTION_VAUD },
        { kind: 'info', label: 'Tests d’auto-évaluation', url: window.MONAIDE_LINKS.ADDICTION_TESTS }
      ],
      documentationTarget: null
    },
    {
      id: 'relaids',
      title: 'Rel’Aids — réduction des risques',
      category: 'sante',
      summary: 'Consommation de drogues · Équipe mobile · Sans inscription',
      audience: 'Personnes marginalisées par leur consommation de drogues ou proches qui cherchent un contact humain.',
      purpose: 'Rel’Aids va au-devant des personnes concernées pour réduire les risques et créer un lien vers des soins ou un soutien.',
      highlights: [
        'Pas d’inscription',
        'Équipe mobile sur le canton',
        'Approche sans jugement'
      ],
      firstSteps: [
        'Voir la structure Rel’Aids',
        'Prendre contact si toi ou un proche en avez besoin',
        'Utiliser ce relais même sans projet de soin clair'
      ],
      bodyIntro: 'Rel’Aids est une équipe de travailleurs sociaux qui se déplace sur tout le canton à la rencontre des personnes marginalisées par leur consommation de drogues. Pas de jugement, pas d’inscription.',
      sections: [
        {
          title: 'Ce qu’ils font',
          items: [
            'Accompagnement individuel et familial',
            'Réduction des risques et matériel stérile',
            'Orientation vers les structures de soins',
            'Présence sur tout le canton'
          ]
        },
        {
          title: 'Contact',
          items: [
            '079 210 58 13',
            'Pas d’inscription requise',
            'Présence soutenue à Lausanne et Nyon'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Rel’Aids — Fondation Le Relais', url: window.MONAIDE_LINKS.RELAIDS }
      ],
      documentationTarget: null
    },
    {
      id: 'unisante',
      title: 'Unisanté — soins médicaux accessibles',
      category: 'sante',
      summary: 'Urgences · Sans-papiers · Situations précaires · 24h/24',
      audience: 'Personnes qui ont besoin de soins ou d’une porte médicale accessible, y compris en situation précaire.',
      purpose: 'Unisanté est une vraie porte d’entrée santé à Lausanne pour des soins de base, des urgences et des situations complexes.',
      highlights: [
        'Référence en médecine générale à Lausanne',
        'Permanence du Flon sans rendez-vous',
        'Accessible aussi aux personnes en situation précaire'
      ],
      firstSteps: [
        'Voir la permanence du Flon si tu as besoin de soins rapides',
        'Regarder le site Unisanté',
        'Ne pas attendre si la situation médicale se dégrade'
      ],
      bodyIntro: 'Unisanté est le centre de référence en médecine générale à Lausanne. Il accueille toute personne en consultation ou en urgence, y compris les personnes en situation précaire ou sans statut légal.',
      sections: [
        {
          title: 'Prestations',
          items: [
            'Médecine générale et urgences',
            'Consultations sans rendez-vous (Permanence du Flon)',
            'Soins accessibles aux personnes vulnérables',
            'Repères vers les urgences psy ou autres relais'
          ]
        },
        {
          title: 'Pratique',
          items: [
            'Permanence du Flon : 7j/7, 8h à 20h',
            'Rue du Bugnon 44, 1011 Lausanne',
            '021 314 60 60',
            'LAMal souvent requise, avec possibilités d’orientation'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Site Unisanté', url: window.MONAIDE_LINKS.UNISANTE },
        { kind: 'action', label: 'Permanence du Flon', url: window.MONAIDE_LINKS.UNISANTE_FLON }
      ],
      documentationTarget: null
    },
    {
      id: 'point-deau',
      title: 'Le Point d’Eau — accueil & hygiène',
      category: 'sante',
      summary: 'Personnes en grande précarité · Sans condition · Lausanne',
      audience: 'Personnes qui ont besoin d’un lieu d’accueil bas seuil avec hygiène, soins et orientation.',
      purpose: 'Le Point d’Eau permet de retrouver des services de base très concrets sans inscription ni jugement.',
      highlights: [
        'Accueil bas seuil',
        'Douches, lessive, vêtements, orientation',
        'Sans condition et sans rendez-vous'
      ],
      firstSteps: [
        'Voir le Point d’Eau',
        'Regarder les horaires',
        'T’y rendre directement si tu as besoin de ces services'
      ],
      bodyIntro: 'Le Point d’Eau est une fondation lausannoise d’accueil bas seuil. Elle propose des prestations d’hygiène, de soins et d’orientation sans inscription, sans condition et sans jugement.',
      sections: [
        {
          title: 'Ce qu’on y trouve',
          items: [
            'Douches et sanitaires',
            'Machines à laver gratuites',
            'Vestiaires et vêtements disponibles',
            'Soins et orientation sociale'
          ]
        },
        {
          title: 'Pratique',
          items: [
            'Avenue d’Echallens 123, Lausanne',
            'Sans rendez-vous',
            'Ouvert aux personnes en situation de précarité, avec ou sans statut'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Site du Point d’Eau', url: window.MONAIDE_LINKS.POINT_DEAU },
        { kind: 'info', label: 'Contact et horaires', url: window.MONAIDE_LINKS.POINT_DEAU_CONTACT }
      ],
      documentationTarget: null
    },
    {
      id: 'apg',
      title: 'Allocations perte de gain — maternité & paternité (APG)',
      category: 'financier',
      summary: 'Maternité (98j) · Paternité (14j) · Adoption',
      audience: 'Parents qui doivent faire valoir un droit APG après une naissance ou une adoption.',
      purpose: 'Les APG compensent une partie de la perte de revenu pendant certains congés liés à la parentalité.',
      highlights: [
        'Droit lié aux cotisations AVS',
        'Peut concerner salarié·es, indépendant·es ou personnes au chômage',
        'À faire valoir, ce n’est pas toujours automatique'
      ],
      firstSteps: [
        'Lire les infos APG',
        'Annoncer à l’employeur ou à la caisse compétente',
        'Préparer les justificatifs liés à la naissance ou l’adoption'
      ],
      bodyIntro: '98 jours de congé payé pour la maman, 14 jours pour le papa. C’est une assurance à laquelle tu as cotisé : pense à faire valoir ce droit.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Cotisation AVS suffisante avant l’accouchement',
            'Salarié·e, indépendant·e ou au chômage selon les cas',
            '80% du salaire, dans les limites légales'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Annoncer à l’employeur et à la caisse AVS',
            'Le droit peut aussi concerner l’adoption',
            'Ne pas laisser traîner la demande'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'APG maternité/paternité — AVS/AI', url: window.MONAIDE_LINKS.APG_INFO }
      ],
      documentationTarget: null
    },
    {
      id: 'csp-vaud',
      title: 'CSP Vaud — soutien social & permanence juridique',
      category: 'financier',
      summary: 'Toute personne en difficulté · Gratuit · Confidentiel',
      audience: 'Personnes qui ont besoin d’un soutien social ou juridique de premier recours.',
      purpose: 'Le CSP Vaud aide sur les dettes, les démarches, le droit du bail, certaines questions juridiques et des situations sociales complexes.',
      highlights: [
        'Consultations sociales et juridiques gratuites',
        'Très utile quand tu ne sais pas quel service saisir',
        'Permanences dans plusieurs régions'
      ],
      firstSteps: [
        'Contacter le CSP Vaud',
        'Préciser si ta question est sociale, juridique ou liée aux dettes',
        'Venir avec les papiers utiles si tu en as'
      ],
      bodyIntro: 'Le Centre Social Protestant Vaud offre des consultations sociales et juridiques gratuites pour toute personne en difficulté : dettes, droits, démarches administratives, logement, assurances sociales.',
      sections: [
        {
          title: 'Domaines couverts',
          items: [
            'Dettes et budget',
            'Droits et démarches administratives',
            'Questions juridiques (bail, travail, assurances)',
            'Couple et famille'
          ]
        },
        {
          title: 'Démarche',
          items: [
            '021 560 60 60',
            'Rue Beau-Séjour 28, Lausanne',
            'Permanences dans tout le canton',
            'Sans rendez-vous pour certaines permanences'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Priorité aux personnes à ressources modestes pour certaines questions juridiques.'
        }
      ],
      links: [
        { kind: 'action', label: 'CSP Vaud', url: window.MONAIDE_LINKS.CSP_HOME },
        { kind: 'info', label: 'Permanence juridique', url: 'https://csp.ch/vaud/services/questions-juridiques/' }
      ],
      documentationTarget: null
    },
    {
      id: 'lup',
      title: 'Logements à loyer abordable (LUP)',
      category: 'logement',
      summary: 'Revenus modestes · Domicile vaudois 2 ans+',
      audience: 'Personnes ou familles à revenu modeste qui cherchent un logement à loyer plus accessible.',
      purpose: 'Les logements à loyer abordable peuvent réduire durablement la charge du loyer, mais les listes d’attente sont souvent longues.',
      highlights: [
        'Piste utile si le loyer actuel est trop lourd',
        'Demande souvent longue à anticiper',
        'Inscription par commune ou par fondation selon les cas'
      ],
      firstSteps: [
        'Voir les logements subventionnés',
        'Vérifier si la commune ou la FVL est la bonne porte',
        'Préparer un dossier et le mettre à jour régulièrement'
      ],
      bodyIntro: 'Il existe des logements à loyer réduit réservés aux personnes à revenus modestes. Les listes d’attente peuvent être longues, donc il faut souvent s’inscrire tôt.',
      sections: [
        {
          title: 'Conditions',
          items: [
            'Revenus sous le plafond cantonal',
            'Domicile vaudois depuis au moins 2 ans',
            'Taille du ménage adaptée au logement'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Inscription auprès du service communal du logement',
            'Ou auprès de la FVL selon les objets',
            'Mettre son dossier à jour régulièrement'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Logements subventionnés', url: window.MONAIDE_LINKS.LUP_INFO },
        { kind: 'info', label: 'FVL', url: window.MONAIDE_LINKS.FVL },
        { kind: 'info', label: 'Guide détaillé', url: '/aides-logement/' }
      ],
      documentationTarget: null
    },
    {
      id: 'asloca',
      title: 'ASLOCA Vaud — défense des locataires',
      category: 'logement',
      summary: 'Locataires vaudois · Permanences régionales · Cotisation requise',
      audience: 'Locataires qui ont un problème avec le bailleur, le loyer, la résiliation ou le dépôt de garantie.',
      purpose: 'L’ASLOCA aide à défendre les droits des locataires et à comprendre la bonne stratégie en cas de conflit de bail.',
      highlights: [
        'Référence utile en droit du bail',
        'Permanences régionales',
        'Très importante en cas de résiliation ou hausse contestée'
      ],
      firstSteps: [
        'Voir les services ASLOCA',
        'Regarder la permanence la plus proche',
        'Garder tous les courriers et pièces du bail'
      ],
      bodyIntro: 'L’ASLOCA défend les droits des locataires dans tout le canton. Si tu as un problème avec ton bailleur, une hausse de loyer ou une résiliation, c’est souvent la bonne porte.',
      sections: [
        {
          title: 'Ce qu’ils font',
          items: [
            'Conseils en droit du bail',
            'Permanences régionales',
            'Défense des membres',
            'Représentation face aux bailleurs'
          ]
        },
        {
          title: 'Pratique',
          items: [
            'Rue Jean-Jacques Cart 8, Lausanne',
            '021 617 16 17',
            'Cotisation annuelle requise pour le suivi juridique',
            'Permanences à Lausanne, Morges, Vevey, Nyon, Yverdon'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'ASLOCA Vaud', url: window.MONAIDE_LINKS.ASLOCA_VAUD },
        { kind: 'info', label: 'Voir les services', url: window.MONAIDE_LINKS.ASLOCA_SERVICES }
      ],
      documentationTarget: null
    },
    {
      id: 'aide-urgence-sejour',
      title: 'Aide d’urgence — décision de renvoi ou sans droit de séjour',
      category: 'migration',
      summary: 'Sans ressources, décision de renvoi, besoin immédiat de base',
      audience: 'Personnes sans ressources dont la situation ne relève plus des aides ordinaires.',
      purpose: 'L’aide d’urgence sert à couvrir la base immédiate dans certaines situations de renvoi ou d’absence de droit de séjour.',
      highlights: [
        'Pas la même logique que les aides ordinaires',
        'Très liée au cadre migration',
        'Souvent à croiser avec un accompagnement spécialisé'
      ],
      firstSteps: [
        'Lire la démarche officielle',
        'Vérifier la situation avec un service migration',
        'Passer par le CSP Fraternité si tu ne comprends pas le cadre'
      ],
      bodyIntro: 'En cas de décision de renvoi, de séjour sans droit ou de grande précarité sans statut, la logique n’est pas celle des aides sociales ordinaires. Il faut souvent passer par l’aide d’urgence et un accompagnement migration.',
      sections: [
        {
          title: 'Quand cette fiche est utile',
          items: [
            'Décision de renvoi du territoire suisse',
            'Sans droit de séjour / sans papiers',
            'Aucune ressource financière',
            'Besoin de nourriture, hébergement ou base immédiate'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Vérifier la situation auprès de l’autorité ou du service compétent',
            'L’EVAM délivre les prestations quand la situation relève de l’aide d’urgence',
            'Le CSP Fraternité aide à comprendre les courriers et les options'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Aide d’urgence — Vaud', url: window.MONAIDE_LINKS.URGENCE_SEJOUR },
        { kind: 'action', label: 'La Fraternité — CSP Vaud', url: window.MONAIDE_LINKS.CSP_MIGRATION }
      ],
      documentationTarget: null
    },
    {
      id: 'caritas-migration',
      title: 'Caritas Vaud — aide aux personnes migrantes',
      category: 'migration',
      summary: 'Personnes réfugiées et migrantes · Intégration · Soutien',
      audience: 'Personnes migrantes qui ont besoin d’un accompagnement d’intégration ou de soutien concret.',
      purpose: 'Caritas Vaud accompagne certaines personnes migrantes dans des démarches d’intégration, de logement, de formation ou de soutien concret.',
      highlights: [
        'Soutien d’intégration',
        'Repères utiles sur plusieurs villes du canton',
        'Complémentaire d’autres services migration'
      ],
      firstSteps: [
        'Voir l’aide pour les personnes migrantes',
        'Contacter Caritas Vaud si besoin',
        'Vérifier si la prestation correspond à ta situation'
      ],
      bodyIntro: 'Caritas Vaud accompagne des personnes en fuite et des personnes migrantes dans leurs démarches d’intégration : logement, emploi, formation ou soutien concret selon les situations.',
      sections: [
        {
          title: 'Prestations',
          items: [
            'Accompagnement à l’intégration',
            'Cours de langue et formation',
            'Soutien dans certaines démarches administratives',
            'Repères vers d’autres aides de Caritas'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Contacter Caritas Vaud directement',
            'Présence à Lausanne, Yverdon, Vevey',
            'Certaines prestations sur mandat des communes',
            'Collaboration possible avec CSP et EVAM'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Caritas Vaud migration', url: window.MONAIDE_LINKS.CARITAS_MIGRATION },
        { kind: 'info', label: 'Trouver de l’aide — Caritas Vaud', url: window.MONAIDE_LINKS.CARITAS_VAUD_HELP }
      ],
      documentationTarget: null
    },
    {
      id: 'foyer-evam-femmes',
      title: 'Foyer EVAM — hébergement pour femmes migrantes',
      category: 'migration',
      summary: 'Femmes en situation de vulnérabilité · Avec ou sans enfants · Lausanne',
      audience: 'Femmes migrantes en situation de vulnérabilité orientées vers un hébergement adapté.',
      purpose: 'Cette fiche aide à repérer qu’un hébergement EVAM spécialisé pour femmes existe dans certaines situations.',
      highlights: [
        'Pour femmes en situation de vulnérabilité',
        'Avec ou sans enfants',
        'Orientation via EVAM ou services cantonaux'
      ],
      firstSteps: [
        'Passer d’abord par l’EVAM ou le service qui suit déjà la situation',
        'Expliquer les besoins spécifiques de protection ou de vulnérabilité',
        'Ne pas se déplacer sans orientation préalable'
      ],
      bodyIntro: 'L’EVAM a mis en place un hébergement spécifiquement pensé pour certaines femmes migrantes en situation de vulnérabilité, avec ou sans enfants. La porte d’entrée reste l’EVAM ou les services cantonaux.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Femmes migrantes (asile, admission provisoire, autres situations EVAM)',
            'Femmes en situation de vulnérabilité',
            'Avec ou sans enfants'
          ]
        },
        {
          title: 'Démarche',
          items: [
            'Orientation via l’EVAM ou les services cantonaux',
            '021 341 14 00',
            'Accompagnement spécifique aux besoins des femmes'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'EVAM', url: window.MONAIDE_LINKS.EVAM_HOME }
      ],
      documentationTarget: null
    },
    {
      id: 'lignes-ecoute',
      title: 'Lignes d’écoute d’urgence',
      category: 'urgence',
      summary: 'Toute personne en détresse · Gratuit · Anonyme · 24h/24',
      audience: 'Personnes en détresse ou proches qui ont besoin de parler immédiatement.',
      purpose: 'Ces lignes permettent de parler tout de suite à quelqu’un, sans jugement, de façon anonyme et gratuite.',
      highlights: [
        'Disponibles maintenant',
        'Anonymes et gratuites',
        'Adultes, jeunes et familles'
      ],
      firstSteps: [
        'Appeler la ligne la plus adaptée',
        'Parler maintenant plutôt que rester seul·e',
        'Si le danger est immédiat, appeler les urgences'
      ],
      bodyIntro: 'Si tu traverses une période difficile ou que tu as besoin de parler, ces lignes sont là maintenant. Gratuites, anonymes et sans jugement.',
      sections: [
        {
          title: 'Adultes',
          items: [
            '143 — La Main Tendue (24h/24)',
            'Urgences psy CHUV — 021 314 11 11',
            'Stop Suicide — prévention et ressources'
          ]
        },
        {
          title: 'Jeunes & familles',
          items: [
            '147 — Pro Juventute (24h/24)',
            'Par téléphone ou chat selon le service',
            'Gratuit et anonyme'
          ]
        }
      ],
      links: [
        { kind: 'action', label: '143 — Main Tendue', url: window.MONAIDE_LINKS.MAIN_TENDUE },
        { kind: 'action', label: '147 — Pro Juventute', url: window.MONAIDE_LINKS.PRO_JUVENTUTE_147 },
        { kind: 'info', label: 'Stop Suicide', url: window.MONAIDE_LINKS.STOP_SUICIDE }
      ],
      documentationTarget: null
    },
    {
      id: 'distributions-alimentaires',
      title: 'Distributions alimentaires — Canton de Vaud',
      category: 'urgence',
      summary: 'Personnes en situation de précarité · Conditions variables',
      audience: 'Personnes ou familles qui ont besoin d’un accès rapide à de la nourriture.',
      purpose: 'Cette fiche aide à repérer les distributions alimentaires et épiceries solidaires selon les régions.',
      highlights: [
        'Accès gratuit ou à prix solidaire selon les lieux',
        'Conditions variables selon les structures',
        'Utile en urgence budget ou fin de mois'
      ],
      firstSteps: [
        'Regarder la liste par commune ou région',
        'Appeler si tu veux vérifier horaires et conditions',
        'Ne pas hésiter à y aller si le besoin est là'
      ],
      bodyIntro: 'Des endroits dans tout le canton permettent d’avoir accès à des aliments gratuitement ou à prix solidaire. Tu n’as pas à avoir honte d’y aller.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Personnes seules, familles, étudiant·es, personnes sans revenu',
            'Conditions variables selon le lieu',
            'Parfois en accès direct, parfois avec orientation'
          ]
        },
        {
          title: 'Comment faire',
          items: [
            'Regarder la liste complète par commune ou région',
            'Appeler pour vérifier horaires et conditions',
            'Regarder aussi les épiceries solidaires'
          ]
        }
      ],
      links: [
        { kind: 'info', label: 'Liste complète Vaud', url: window.MONAIDE_LINKS.GUIDE_SOCIAL_FOOD },
        { kind: 'info', label: 'Cartons du Cœur', url: window.MONAIDE_LINKS.CARTONS_COEUR },
        { kind: 'info', label: 'Épiceries Caritas Vaud', url: window.MONAIDE_LINKS.CARITAS_EPICERIES }
      ],
      documentationTarget: null
    },
    {
      id: 'malleyprairie',
      title: 'MalleyPrairie — violence conjugale & familiale',
      category: 'urgence',
      summary: 'Femmes, hommes, LGBTIQ+ · Hébergement d’urgence · 24h/24',
      audience: 'Personnes victimes de violences conjugales ou familiales qui ont besoin d’un soutien ou d’une mise à l’abri.',
      purpose: 'MalleyPrairie est une porte d’entrée très concrète pour la violence conjugale et familiale, avec hébergement d’urgence et accompagnement.',
      highlights: [
        '24h/24, 7j/7',
        'Hébergement d’urgence et consultations',
        'Interprétariat possible'
      ],
      firstSteps: [
        'Appeler avant de te déplacer',
        'Dire si le danger est immédiat',
        'Demander une mise à l’abri ou un conseil urgent'
      ],
      bodyIntro: 'Tu subis des violences au sein de ton couple ou de ta famille ? MalleyPrairie est là 24h/24, 7j/7. Hébergement d’urgence pour les femmes, consultations ambulatoires pour toutes et tous.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Femmes, hommes, LGBTIQ+ victimes de violence',
            'Personnes majeures domiciliées dans le canton',
            'Avec ou sans enfants'
          ]
        },
        {
          title: 'Démarche',
          items: [
            '021 620 76 76 — 24h/24 et 7j/7',
            'Appeler avant de te déplacer',
            'Interprétariat disponible si nécessaire'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: '021 620 76 76 — disponible 24h/24, 7j/7.'
        }
      ],
      links: [
        { kind: 'action', label: 'MalleyPrairie', url: window.MONAIDE_LINKS.MALLEY_PRAIRIE },
        { kind: 'info', label: 'Violence Que Faire', url: window.MONAIDE_LINKS.VIOLENCE_QUE_FAIRE }
      ],
      documentationTarget: null
    },
    {
      id: 'le-passage',
      title: 'Le Passage — accueil de jour bas seuil',
      category: 'urgence',
      summary: 'Personnes en grande précarité · Gratuit · Sans rendez-vous · 7j/7',
      audience: 'Personnes qui ont besoin d’un lieu où aller dans la journée pour souffler, manger, se soigner ou être orientées.',
      purpose: 'Le Passage offre un accueil de jour très accessible pour retrouver un repère concret dans une situation de grande précarité.',
      highlights: [
        'Sans inscription',
        'Repas, écoute, soins et orientation',
        'Ouvert 7j/7'
      ],
      firstSteps: [
        'Te rendre sur place',
        'Demander ce dont tu as besoin',
        'Utiliser ce lieu comme premier repère si tu n’as nulle part où aller'
      ],
      bodyIntro: 'Tu as besoin d’un endroit où aller, d’écoute, de soins ou d’un repas ? Le Passage est un espace d’accueil de jour ouvert à toutes les personnes en situation de précarité, sans inscription et sans condition.',
      sections: [
        {
          title: 'Ce qu’on y trouve',
          items: [
            'Écoute et orientation sociale',
            'Soins infirmiers',
            'Repas et collations',
            'Adresse postale possible'
          ]
        },
        {
          title: 'Pratique',
          items: [
            'Place du Vallon 4, 1005 Lausanne',
            '7j/7 de 9h30 à 17h30',
            'Sans rendez-vous',
            '021 311 11 15'
          ]
        }
      ],
      links: [
        { kind: 'action', label: 'Le Passage — Fondation ABS', url: window.MONAIDE_LINKS.LE_PASSAGE }
      ],
      documentationTarget: null
    },
    {
      id: 'vaud-pour-vous',
      title: 'Programme Vaud pour vous',
      category: 'urgence',
      summary: 'Toute la population · Accompagnement gratuit · Démarches administratives',
      audience: 'Personnes qui ne savent pas à quelles aides elles ont droit ou qui n’arrivent plus à faire les démarches seules.',
      purpose: 'Vaud pour vous aide à trouver la bonne porte et à avancer dans les démarches administratives avec un accompagnement humain.',
      highlights: [
        'Pour toute la population vaudoise',
        'Pas réservé au RI',
        'Très bonne première porte quand tout paraît flou'
      ],
      firstSteps: [
        'Contacter le programme',
        'Expliquer ce qui bloque dans les démarches',
        'Demander une orientation ou un accompagnement'
      ],
      bodyIntro: 'Tu ne sais pas à quelle aide tu as droit ou tu n’arrives pas à faire tes démarches ? Le programme Vaud pour vous met à disposition des professionnel·le·s qui t’accompagnent gratuitement.',
      sections: [
        {
          title: 'Pour qui',
          items: [
            'Toute personne habitant le canton de Vaud',
            'En difficulté momentanée ou durable',
            'Pas réservé aux bénéficiaires de l’aide sociale'
          ]
        },
        {
          title: 'Ce qu’ils proposent',
          items: [
            'Écoute, information et orientation',
            'Accompagnement dans les démarches administratives',
            'Permanences dans plusieurs régions du canton',
            'Gratuit et confidentiel'
          ]
        }
      ],
      callouts: [
        {
          kind: 'callout',
          html: 'Centrale des solidarités : 0800 30 30 38 — gratuit, lu–ve 9h–17h30.'
        }
      ],
      links: [
        { kind: 'action', label: 'Vaud pour vous', url: window.MONAIDE_LINKS.VAUD_POUR_VOUS }
      ],
      documentationTarget: null
    }
  ];

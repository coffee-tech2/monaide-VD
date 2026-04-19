  var LINKS = window.MONAIDE_LINKS || {};

  window.MONAIDE_DOCUMENTATION_DATA = {
    items: [
      {
        id: 'ri',
        blockId: 'bloc-ri',
        accordionId: 'doc-ri',
        menuLabel: 'Revenu d’insertion (RI)',
        accordion: {
          title: 'Revenu d’insertion (RI)',
          subtitle: 'Demande · Documents · CSR',
          leadHtml: 'Le RI peut aider à couvrir le minimum pour vivre après examen du dossier. La demande se fait auprès du <strong class="doc-strong">CSR de ta commune</strong>.',
          contact: {
            label: 'Qui contacter d’abord',
            text: 'Le CSR de ta région. Même si ton dossier n’est pas complet, tu peux commencer par là.'
          },
          infoBoxes: [
            { label: 'Comment faire', text: 'Commence par le CSR de ta commune. Le CSR vérifie ensuite si le RI est la bonne piste ou s’il faut d’abord activer une autre aide.' },
            { label: 'Bon repère', text: 'Tu peux commencer même si tu n’as pas encore tous les papiers. Le plus important est de ne pas rester seul·e si le budget ne tient plus.' },
            { label: 'Conditions de base', text: 'Être majeur·e, vivre dans le canton, avoir un séjour compatible, des ressources sous le barème RI et une fortune sous les limites cantonales.' },
            { label: 'À éviter', text: 'Ne vide pas tes comptes, ne cache pas une ressource et ne quitte pas ton logement sans conseil. Le CSR doit comprendre la situation réelle.' }
          ],
          preChecklistNotes: [
            '<strong>Astuce.</strong> Prépare les documents que tu as déjà, même si le dossier n’est pas parfait. Une photo lisible sur téléphone peut parfois aider à démarrer, puis le CSR te dira ce qu’il faut compléter.'
          ],
          checklistLabel: 'Documents à préparer',
          checklist: [
            'Pièce d’identité ou permis de séjour',
            'Numéro AVS — sur ta carte d’assurance maladie, ta carte AVS ou certains courriers officiels',
            'Fiche du contrôle des habitants ou attestation de domicile — à demander à ta commune si tu ne l’as pas',
            'Revenus récents — salaires, indemnités chômage, rentes, pensions ou autres entrées d’argent',
            'Décomptes des 3 derniers mois de tous tes comptes bancaires ou postaux, en Suisse ou à l’étranger',
            'Bail à loyer et preuve de paiement du dernier loyer',
            'Police LAMal et factures de primes — disponibles dans les courriers ou l’espace client de ta caisse maladie',
            'Dernière taxation ou déclaration fiscale — via VaudTax, le courrier des impôts ou l’office d’impôt si besoin'
          ],
          notes: [
            'Si tu n’as pas tous les papiers, commence quand même. Le CSR te dira la suite.',
            'Si tu as perdu des bulletins de salaire, tu peux demander une copie à ton employeur ou aux RH. C’est une demande normale.'
          ],
          actions: [
            { label: 'Ouvrir la démarche officielle RI', href: LINKS.RI_APPLY, primary: true },
            { label: 'Trouver ton CSR', href: 'https://www.vd.ch/aides-financieres-et-soutien-social/trouver-un-centre-social-regional-csr', primary: false },
            { label: 'Guide détaillé MonAide-VD', href: '/revenu-insertion/', primary: false }
          ]
        },
        shortcut: {
          kicker: 'Formulaire officiel',
          title: 'Revenu d’insertion',
          text: 'Commencer la demande et voir les papiers utiles.',
          href: LINKS.RI_APPLY
        }
      },
      {
        id: 'lamal',
        blockId: 'bloc-lamal',
        accordionId: 'doc-lamal',
        menuLabel: 'Subside LAMal',
        accordion: {
          title: 'Subside LAMal',
          subtitle: 'Calcul · Demande · AAS',
          leadHtml: 'Le subside peut réduire la prime d’assurance maladie selon le dossier. La demande se fait en ligne ou avec une <strong class="doc-strong">agence AAS</strong>. C’est l’<strong class="doc-strong">OVAM</strong> qui rend la décision.',
          contact: {
            label: 'Qui contacter d’abord',
            text: 'Une agence AAS si tu bloques sur le calcul ou sur la demande. L’OVAM reste le service qui décide ensuite.'
          },
          infoBoxes: [
            { label: 'Comment faire', text: 'Fais le calcul officiel puis dépose la demande. Si le résultat est flou, une AAS peut t’aider gratuitement.' },
            { label: 'Bon repère', text: 'La date de dépôt compte. En cas de doute, demande de l’aide plutôt que d’attendre.' },
            { label: 'Calcul', text: 'Le droit dépend du RDU : revenus, fortune, ménage et région de primes. L’outil officiel donne une estimation, l’OVAM rend la décision.' },
            { label: 'Version papier', text: 'Si tu ne peux pas faire la demande en ligne, une agence AAS peut la remplir avec toi gratuitement.' }
          ],
          checklistLabel: 'Documents à préparer',
          checklist: [
            'Numéro AVS — sur la carte d’assurance maladie ou la carte AVS',
            'Pièce d’identité ou permis de séjour',
            'Dernière taxation — courrier des impôts, VaudTax ou demande à l’office d’impôt',
            'Police LAMal — courrier de ta caisse maladie ou espace client en ligne',
            'Revenus actuels si la situation a changé depuis la taxation',
            'Coordonnées bancaires si demandées'
          ],
          notes: [
            'La date de dépôt compte. Si l’OVAM accorde un effet rétroactif, l’assureur corrige ensuite les primes payées en trop.',
            'Erreur fréquente : croire que le calcul rapide suffit. Il faut déposer une vraie demande pour recevoir une décision.',
            'Le subside concerne l’assurance obligatoire LAMal. Les assurances complémentaires ne sont pas prises en charge.'
          ],
          actions: [
            { label: 'Évaluer et demander le subside', href: LINKS.SUBSIDE_HOME, primary: true },
            { label: 'OVAM : infos officielles', href: LINKS.SUBSIDE_HOME, primary: false },
            { label: 'Trouver une agence AAS', href: LINKS.AAS_LIST, primary: false },
            { label: 'Guide détaillé MonAide-VD', href: '/subside-lamal/', primary: false }
          ]
        },
        shortcut: {
          kicker: 'Formulaire officiel',
          title: 'Subside LAMal',
          text: 'Faire le calcul officiel puis lancer la demande.',
          href: LINKS.SUBSIDE_HOME
        }
      },
      {
        id: 'ai',
        blockId: 'bloc-ai',
        accordionId: 'doc-ai',
        menuLabel: 'Assurance invalidité (AI)',
        accordion: {
          title: 'Assurance invalidité (AI)',
          subtitle: 'Formulaires · Santé · Réadaptation',
          leadHtml: 'L’AI intervient en cas d’incapacité durable. Elle cherche d’abord la <strong class="doc-strong">réadaptation avant la rente</strong>, selon la situation examinée.',
          contact: {
            label: 'Qui contacter d’abord',
            text: 'AI Vaud. Ton médecin, ton psychiatre ou ton psychologue peut aussi t’accompagner dans la démarche.'
          },
          infoBoxes: [
            { label: 'Canal', text: 'Formulaires PDF à télécharger, imprimer et envoyer si tu préfères une demande papier.' },
            { label: 'Bon repère', text: 'Un suivi médical peut t’aider à préparer le dossier.' },
            { label: 'À retenir', text: 'L’AI ne sert pas seulement à demander une rente. Elle peut aussi proposer des mesures de réadaptation ou des moyens auxiliaires.' }
          ],
          preChecklistNotes: [
            '<strong>Formulaire PDF.</strong> Ici, tu peux bien télécharger des formulaires PDF AI, les imprimer et les utiliser pour une demande papier si c’est plus simple pour toi.'
          ],
          checklistLabel: 'Documents à préparer',
          checklist: [
            'Pièce d’identité',
            'Formulaire AI 001.303 rempli et signé',
            'Certificats et rapports médicaux récents',
            'Coordonnées du médecin, psychiatre, psychologue ou thérapeute qui te suit',
            'Contrat de travail, certificats de salaire ou attestations chômage si tu en as',
            'Dates importantes : début des symptômes, arrêt de travail, hospitalisation, reprise partielle',
            'Courriers d’assurance perte de gain, accident ou employeur si concernés'
          ],
          notes: [
            'N’attends pas que tout soit fixé. L’AI peut aider avant même qu’une rente soit décidée.',
            'Erreur fréquente : attendre une année complète avant de déposer. Si l’incapacité dure ou risque de durer, il vaut mieux demander conseil rapidement.'
          ],
          actions: [
            { label: 'Ouvrir les formulaires AI Vaud', href: LINKS.AI_FORMS, primary: true },
            { label: 'Infos AI Vaud', href: LINKS.AI_HOME, primary: false },
            { label: 'Guide détaillé MonAide-VD', href: '/assurance-invalidite/', primary: false }
          ]
        },
        shortcut: {
          kicker: 'Formulaire officiel',
          title: 'Assurance invalidité',
          text: 'Accéder aux formulaires et démarrer la demande AI.',
          href: LINKS.AI_FORMS
        }
      },
      {
        id: 'bourse',
        blockId: 'bloc-bourse',
        accordionId: 'doc-bourse',
        menuLabel: 'Bourses d’études',
        accordion: {
          title: 'Bourses d’études (OCBE)',
          subtitle: 'Demande · Formation · Pièces utiles',
          leadHtml: 'La demande se fait en ligne auprès de l’OCBE. Si la formation dure plusieurs années, il faut en principe <strong class="doc-strong">refaire une demande chaque année</strong>.',
          contact: {
            label: 'Qui contacter d’abord',
            text: 'L’OCBE pour la demande. Si tu bloques sur le dossier, Jet Service peut aussi t’aider à le remplir.'
          },
          infoBoxes: [
            { label: 'Canal', text: 'La demande commence en ligne. Ensuite, la confirmation signée peut partir par mail ou par courrier.' },
            { label: 'Bon repère', text: 'N’attends pas d’avoir toutes les pièces pour commencer. Le droit débute en principe le mois suivant le dépôt de la demande.' },
            { label: 'Attention', text: 'Une bourse dépend souvent aussi de la situation des parents ou du ménage. Ce n’est pas seulement ton revenu personnel.' },
            { label: 'Formation reconnue', text: 'La formation doit se dérouler dans un établissement reconnu en Suisse. Les écoles privées non reconnues/subventionnées sont en principe exclues.' },
            { label: 'Dépendant·e / indépendant·e', text: 'L’OCBE distingue les personnes dépendantes et indépendantes financièrement des parents. Ce point peut changer le calcul et les conditions.' }
          ],
          preChecklistNotes: [
            '<strong>Courrier postal.</strong> Si tu utilises le courrier postal, la demande commence en ligne. Ensuite, tu imprimes la page de confirmation, tu la signes et tu l’envoies en PDF à <a href="mailto:info.bourses@vd.ch">info.bourses@vd.ch</a> ou par courrier à <strong>OCBE, Route des Plaines-du-Loup 1, 1014 Lausanne</strong>.'
          ],
          checklistLabel: 'Documents à préparer',
          checklist: [
            'Pièce d’identité ou permis',
            'Attestation d’inscription ou confirmation de formation',
            'Documents fiscaux utiles de l’étudiant·e et, selon la situation, des parents ou du ménage',
            'Attestation de domicile',
            'Bail ou justificatif de logement si tu ne vis pas chez tes parents',
            'Coordonnées bancaires',
            'Contrat d’apprentissage, salaire d’apprenti·e ou revenu d’activité si concerné'
          ],
          notes: [
            'Pour les bourses, la date de dépôt compte. Si certaines pièces manquent, l’OCBE peut te dire comment compléter ensuite.',
            'Erreur fréquente : abandonner parce qu’il manque une pièce. Commence la demande et garde la confirmation de dépôt.',
            'Si la formation dure plusieurs années, une nouvelle demande doit en principe être déposée chaque année.',
            'En cas de refus, une réclamation peut être déposée dans les 30 jours. Jet Service peut aider gratuitement à relire la décision.'
          ],
          actions: [
            { label: 'Faire le test d’éligibilité OCBE', href: LINKS.OCBE_ELIGIBILITY, primary: true },
            { label: 'Faire une demande OCBE', href: LINKS.OCBE_APPLY, primary: false },
            { label: 'Infos bourses OCBE', href: LINKS.OCBE_INFO, primary: false },
            { label: 'Guide détaillé MonAide-VD', href: '/bourses-ocbe/', primary: false }
          ]
        },
        shortcut: {
          kicker: 'Formulaire officiel',
          title: 'Bourse ou prêt OCBE',
          text: 'Faire une première demande ou un renouvellement.',
          href: LINKS.OCBE_APPLY
        }
      },
      {
        id: 'carte',
        blockId: 'bloc-carte',
        accordionId: 'doc-carte',
        menuLabel: 'CarteCulture',
        accordion: {
          title: 'CarteCulture — Caritas',
          subtitle: 'Qui peut l’obtenir · Justificatifs · Démarche',
          leadHtml: 'Carte gratuite qui peut donner accès à des réductions dans la culture, le sport, les loisirs et certaines offres du quotidien.',
          contact: {
            label: 'Qui contacter d’abord',
            text: 'L’équipe CarteCulture Vaud si tu veux vérifier ton droit ou savoir quel justificatif envoyer.'
          },
          infoBoxes: [
            { label: 'Canal', text: 'Formulaire en ligne. Si tu bloques, l’équipe peut t’aider par téléphone.' },
            { label: 'Bon repère', text: 'Le justificatif de situation demandé peut varier selon ton cas.' },
            { label: 'À quoi ça sert', text: 'La carte peut réduire le prix de certaines offres culturelles, sportives, de loisirs ou du quotidien.' }
          ],
          preChecklistNotes: [
            '<strong>Version papier.</strong> La demande passe par le formulaire en ligne. Si ce n’est pas possible, tu peux appeler l’équipe CarteCulture Vaud au <a href="tel:0213175980">021 317 59 80</a>.'
          ],
          plainList: [
            'Bénéficiaire RI, PC AVS/AI, subside LAMal ou bourse',
            'Ou revenus inférieurs au minimum vital'
          ],
          checklistLabel: 'Documents à préparer',
          checklist: [
            'Pièce d’identité',
            'Justificatif de situation — attestation RI, PC, subside LAMal, bourse ou autre preuve demandée',
            'Photo d’identité format passeport',
            'Adresse e-mail ou numéro de téléphone pour le suivi de la demande'
          ],
          notes: [
            'Si tu hésites sur le justificatif à envoyer, l’équipe CarteCulture Vaud peut te renseigner.',
            'Erreur fréquente : ne pas demander la carte alors qu’on reçoit déjà une aide qui peut servir de justificatif.'
          ],
          actions: [
            { label: 'Demander la CarteCulture', href: LINKS.CARTECULTURE_APPLY, primary: true },
            { label: 'Contacter l’équipe CarteCulture Vaud', href: LINKS.CARTECULTURE_CONTACT, primary: false },
            { label: 'Guide détaillé MonAide-VD', href: '/carteculture/', primary: false }
          ]
        }
      }
    ]
  };

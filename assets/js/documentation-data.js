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
            { label: 'Comment faire', text: 'Commence par le CSR. On te dira ensuite quoi apporter.' },
            { label: 'Bon repère', text: 'Tu peux commencer même si tu n’as pas encore tous les papiers.' }
          ],
          checklistLabel: 'Documents à préparer',
          checklist: [
            'Pièce d’identité ou permis de séjour',
            'Numéro AVS et attestation de domicile',
            'Revenus, relevés de compte et bail',
            'Police LAMal et dernière taxation'
          ],
          notes: [
            'Si tu n’as pas tous les papiers, commence quand même. Le CSR te dira la suite.'
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
            { label: 'Comment faire', text: 'Fais le calcul officiel puis dépose la demande.' },
            { label: 'Bon repère', text: 'La date de dépôt compte. En cas de doute, demande de l’aide.' },
            { label: 'Version papier', text: 'Si tu ne peux pas faire la demande en ligne, une agence AAS peut la remplir avec toi gratuitement.' }
          ],
          checklistLabel: 'Documents à préparer',
          checklist: [
            'Numéro AVS et pièce d’identité',
            'Dernière taxation',
            'Police LAMal'
          ],
          notes: [
            'La date de dépôt compte. Si l’OVAM accorde un effet rétroactif, l’assureur corrige ensuite les primes payées en trop.'
          ],
          actions: [
            { label: 'Évaluer et demander le subside', href: LINKS.SUBSIDE_HOME, primary: true },
            { label: 'OVAM : infos officielles', href: LINKS.SUBSIDE_HOME, primary: false },
            { label: 'Trouver une agence AAS', href: LINKS.AAS_LIST, primary: false },
            { label: 'Guide détaillé MonAide-VD', href: '/subside-lamal/', primary: false }
          ]
        },
        shortcut: {
          kicker: 'Demande en ligne',
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
            { label: 'Bon repère', text: 'Un suivi médical peut t’aider à préparer le dossier.' }
          ],
          preChecklistNotes: [
            '<strong>Formulaire PDF.</strong> Ici, tu peux bien télécharger des formulaires PDF AI, les imprimer et les utiliser pour une demande papier si c’est plus simple pour toi.'
          ],
          checklistLabel: 'Documents à préparer',
          checklist: [
            'Pièce d’identité',
            'Certificats et rapports médicaux',
            'Formulaire AI 001.303'
          ],
          notes: [
            'N’attends pas que tout soit fixé. L’AI peut aider avant même qu’une rente soit décidée.'
          ],
          actions: [
            { label: 'Ouvrir les formulaires AI Vaud', href: LINKS.AI_FORMS, primary: true },
            { label: 'Infos AI Vaud', href: LINKS.AI_HOME, primary: false },
            { label: 'Guide détaillé MonAide-VD', href: '/assurance-invalidite/', primary: false }
          ]
        },
        shortcut: {
          kicker: 'Formulaires AI',
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
            { label: 'Bon repère', text: 'N’attends pas d’avoir toutes les pièces pour commencer. La date de dépôt compte.' }
          ],
          preChecklistNotes: [
            '<strong>Courrier postal.</strong> Si tu utilises le courrier postal, la demande commence en ligne. Ensuite, tu imprimes la page de confirmation, tu la signes et tu l’envoies en PDF à <a href="mailto:info.bourses@vd.ch">info.bourses@vd.ch</a> ou par courrier à <strong>OCBE, Route des Plaines-du-Loup 1, 1014 Lausanne</strong>.'
          ],
          checklistLabel: 'Documents à préparer',
          checklist: [
            'Pièce d’identité ou permis',
            'Attestation d’inscription',
            'Documents fiscaux utiles',
            'Attestation de domicile'
          ],
          notes: [
            'Pour les bourses, la date de dépôt compte. Si certaines pièces manquent, l’OCBE peut te dire comment compléter ensuite.'
          ],
          actions: [
            { label: 'Faire une demande OCBE', href: LINKS.OCBE_APPLY, primary: true },
            { label: 'Infos bourses OCBE', href: LINKS.OCBE_INFO, primary: false },
            { label: 'Guide détaillé MonAide-VD', href: '/bourses-ocbe/', primary: false }
          ]
        },
        shortcut: {
          kicker: 'Demande en ligne',
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
            { label: 'Bon repère', text: 'Le justificatif de situation demandé peut varier selon ton cas.' }
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
            'Justificatif de situation (attestation RI, PC, subside ou bourse)',
            'Photo d’identité (format passeport)'
          ],
          notes: [
            'Si tu hésites sur le justificatif à envoyer, l’équipe CarteCulture Vaud peut te renseigner.'
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

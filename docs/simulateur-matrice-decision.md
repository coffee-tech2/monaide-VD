# Simulateur MonAide-VD — matrice de décision v1

Document de référence produit pour faire évoluer le simulateur sans empiler des règles au hasard.

Le simulateur ne décide pas à la place des services officiels. Son rôle est d’orienter vers la meilleure première porte, puis vers les pistes secondaires utiles.

## Principes

- Une réponse doit d’abord donner une porte d’entrée claire.
- Une piste ne doit jamais être présentée comme certaine si un service officiel doit calculer ou examiner le droit.
- Les urgences concrètes passent avant les aides générales.
- Les pistes secondaires doivent rester visibles sans noyer la personne.
- Les statuts sensibles, l’âge AVS, la formation et le permis peuvent exclure ou déprioriser certaines aides.
- Le texte doit toujours aider à faire une démarche, pas seulement nommer une prestation.

## Niveaux de sortie

| Niveau | Sens produit | Exemple |
| --- | --- | --- |
| Probable | Forte piste selon les réponses, mais validation officielle nécessaire | RI avec revenu absent et fortune faible |
| À vérifier | Piste utile mais dépend d’un calcul, statut ou détail manquant | LACI sans savoir si le droit chômage est ouvert |
| Secondaire | Piste complémentaire après la porte principale | CarteCulture après RI/LAMal |
| Exclue | Ne doit pas sortir dans ce parcours | RI ordinaire pour étudiant en formation |

## Règles transversales

| Signal | Effet attendu |
| --- | --- |
| Permis N ou S | EVAM / cadre migration avant les aides ordinaires |
| Sans statut clair | Relais migration avant prestations ordinaires |
| Âge AVS / retraité·e | PC AVS/AI + Pro Senectute avant LAMal ; pas RI dans le simulateur |
| En formation post-obligatoire | OCBE + Jet Service avant RI |
| Sans emploi et sans revenu | RI d’abord ; aide alimentaire/dettes ensuite ; LACI à vérifier |
| Perte d’emploi / chômage | LACI d’abord ; RI ensuite si revenu insuffisant |
| Urgence loyer / menace expulsion | Menace expulsion / ASLOCA / CSR avant LAMal |
| Prime maladie lourde seule | LAMal d’abord ; ne pas inventer RI sans signal de besoin de base |
| Fortune élevée | Dégrader RI, LAMal, PC et PC Familles en “à vérifier” ou les retirer selon cas |
| Aide déjà reçue | Ne pas reproposer comme nouvelle porte principale ; garder les compléments liés |

## Aides principales

### Revenu d’insertion / CSR

| Élément | Règle v1 |
| --- | --- |
| Porte principale si | Sans emploi/sans revenu, revenu très faible, fortune faible, besoin de base probable |
| À vérifier si | Permis F, revenu faible mais fortune non négligeable, statut à clarifier |
| Exclure/déprioriser si | Étudiant·e en formation, âge AVS/retraite, PC déjà reçues, RI déjà reçu |
| À placer avant | LAMal si le problème est “plus assez pour vivre” |
| À placer après | LACI si le problème est clairement perte d’emploi/chômage |
| Message | “Demande un entretien d’évaluation au CSR, même si ton dossier n’est pas parfait.” |

### Subside LAMal

| Élément | Règle v1 |
| --- | --- |
| Porte principale si | Prime maladie lourde avec revenu modeste, sans autre urgence plus forte |
| Probable si | Revenu faible/modéré, fortune faible, pas déjà LAMal |
| À vérifier si | Fortune élevée, revenu inconnu, permis ou composition du ménage à clarifier |
| Exclure/déprioriser si | Permis N/S, LAMal déjà reçu |
| À placer après | RI si absence de revenu ; PC si retraité·e ; OCBE/Jet Service si formation |
| Message | “Fais le calcul officiel et dépose la demande si la piste paraît plausible.” |

### Prestations complémentaires AVS/AI

| Élément | Règle v1 |
| --- | --- |
| Porte principale si | Âge AVS, retraite, AI existante, rente insuffisante |
| Probable si | Revenu faible + âge AVS/AI + fortune faible |
| À vérifier si | Fortune ou situation de ménage à clarifier |
| Exclure/déprioriser si | Pas AVS/AI et pas âge AVS |
| À placer avant | LAMal, aides locales, CarteCulture |
| Message | “Commence par l’agence AAS ou la caisse AVS pour vérifier le calcul PC.” |

### PC Familles

| Élément | Règle v1 |
| --- | --- |
| Porte principale si | Parent avec enfant(s), activité professionnelle, revenu faible/modéré |
| Probable si | En emploi + enfant(s) + budget insuffisant + fortune faible |
| À vérifier si | Revenu/fortune ou taux d’activité peu clair |
| Exclure/déprioriser si | Pas d’enfant, pas d’activité professionnelle, RI/PC déjà reçues |
| À placer avant | LAMal si parent travailleur à bas revenu |
| Message | “Vérifie PC Familles auprès de l’agence AAS avec revenus, bail, primes et composition du ménage.” |

### Assurance chômage / LACI

| Élément | Règle v1 |
| --- | --- |
| Porte principale si | Perte d’emploi récente, chômage, pas encore de droit ouvert |
| À vérifier si | Sans emploi sans savoir s’il y a droit aux indemnités |
| Exclure/déprioriser si | Permis N, sans statut, retraite, activité sans perte d’emploi |
| À placer avant | RI quand le signal dominant est “perte d’emploi” |
| À placer après | RI quand le signal dominant est “sans revenu / plus assez pour vivre” |
| Message | “Inscris-toi à l’ORP rapidement et garde les preuves de recherches.” |

### OCBE / Jet Service

| Élément | Règle v1 |
| --- | --- |
| Porte principale si | Formation post-obligatoire, études, apprentissage, jeune adulte en formation |
| OCBE probable/à vérifier si | Formation + ressources insuffisantes |
| Jet Service probable si | 18-25 ans, formation, parcours bloqué, besoin d’aide pour dossier |
| Exclure/déprioriser si | Pas de formation et âge adulte hors problématique jeune |
| À placer avant | RI ordinaire pour étudiant·e |
| Message | “Fais le test OCBE, mais dépose quand même une demande si la situation semble fragile ou si le test est négatif.” |

### Logement / expulsion

| Élément | Règle v1 |
| --- | --- |
| Porte principale si | Dette de loyer, menace d’expulsion, résiliation, logement instable |
| Probable si | Retard de loyer ou courrier bailleur |
| À vérifier si | Loyer lourd mais pas d’urgence immédiate |
| À placer avant | LAMal et aides générales en cas de menace logement |
| Message | “Regarde d’abord les délais et contacte ASLOCA/CSR si un courrier menace le logement.” |

### Dettes / Parlons Cash

| Élément | Règle v1 |
| --- | --- |
| Porte principale si | Surendettement, factures impossibles, poursuites, dettes multiples |
| À vérifier si | Dette ponctuelle sans urgence logement |
| À placer avant | Aides secondaires quand la dette bloque le quotidien |
| À placer après | RI/CSR si absence totale de revenu |
| Message | “Ne laisse pas les rappels s’empiler : demande un tri budget/dettes.” |

### Aide alimentaire

| Élément | Règle v1 |
| --- | --- |
| Porte immédiate si | Absence de revenu, dettes, besoin de base concret |
| Probable si | Revenu absent ou très bas |
| À vérifier si | Revenu modeste mais situation pas claire |
| À placer après | RI/CSR si absence de revenu ; avant aides secondaires |
| Message | “Utilise cette piste comme aide immédiate, en parallèle du traitement de la cause.” |

### EVAM / Fraternité / permis

| Élément | Règle v1 |
| --- | --- |
| Porte principale si | Permis N/S, sans statut, statut migratoire sensible |
| Probable si | Permis N/S |
| À vérifier si | Permis F, L, G, B avec situation administrative complexe |
| À placer avant | RI/LAMal ordinaires si le permis change le cadre |
| Message | “Le statut de séjour peut changer la bonne porte. Fais vérifier avant de lancer plusieurs démarches.” |

## Parcours de référence v1

| Parcours | Top attendu |
| --- | --- |
| Étudiant·e / apprenti·e | OCBE → Jet Service → LAMal → aides locales |
| Perte d’emploi | LACI → RI → LAMal → aides immédiates |
| Plus assez pour vivre | RI → dettes/aide alimentaire → LACI à vérifier → LAMal |
| Parent solo sans revenu | RI → aide alimentaire → LACI à vérifier → allocations/PC Familles selon emploi |
| Parent en emploi bas revenu | PC Familles → LAMal → allocations → aides locales |
| Retraité budget bas | PC AVS/AI → Pro Senectute/AAS → LAMal |
| Prime maladie trop lourde | LAMal seul ou presque, sauf autres signaux |
| Urgence loyer | Menace expulsion/ASLOCA → CSR → aide logement → dettes |
| Permis N/S sans revenu | EVAM → Fraternité/migration → aide alimentaire |
| Permis F sans revenu | RI à vérifier → EVAM/Fraternité → aide alimentaire → LAMal |

## Prochaine étape technique

Transformer cette matrice en structure testable :

1. Ajouter des scénarios de référence dans les tests de régression.
2. Pour chaque aide, définir conditions fortes, conditions faibles, exclusions, priorité.
3. Remplacer progressivement les règles dispersées par une table de décision lisible.
4. Garder les textes de résultats séparés de la logique de scoring.


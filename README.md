# MonAide-VD

Version statique de publication pour GitHub Pages.

Domaine public vise:
- `https://monaide-vaud.ch/`

Le site sert:
- un simulateur d’aides sociales pour le canton de Vaud
- un catalogue des aides
- une documentation pratique
- plusieurs guides detailles pour le SEO et l’orientation directe

## Contrôles utiles avant publication

```bash
node scripts/run-quality-suite.js
```

Ce script vérifie les points sensibles du site: catalogue, guides, métadonnées SEO, sitemap, simulateur, tracking analytics et erreurs de diff.

Vérification séparée des liens externes (pas dans la suite ci-dessus car elle fait de vraies requêtes réseau — lent et dépendant de sites tiers). À lancer périodiquement, pas à chaque commit:

```bash
node scripts/check-external-links.js
```

## Suivi du trafic

Le site utilise Google Tag Manager avec le conteneur `GTM-NFQRW574`.

- En local (`file://`), le tracking est volontairement désactivé.
- Sur `monaide-vaud.ch`, les pages et les événements sont envoyés à GA4 via GTM.
- Dans Google Analytics, les premiers tests se voient dans `Rapports > Temps réel`.
- Les données plus propres arrivent ensuite dans `Rapports > Engagement > Événements`, souvent après quelques heures.

Déclencheur GTM recommandé pour les événements MonAide-VD:

```text
^(simulator_start|simulator_step_view|simulator_step_complete|simulator_validation_error|simulator_edit_answers|simulator_edit_field|simulator_submit|simulator_restart|simulator_abandon|simulator_results_view|result_detail_open|result_catalog_open|result_guide_open|catalog_search|catalog_filter|catalog_card_open|catalog_direct_open|catalog_note_close|catalog_link_click|catalog_guide_open|guide_card_click|guide_detail_view|guide_detail_link_click|site_search|site_search_suggestion)$
```

Événements à surveiller en priorité:

- `simulator_start`: une personne commence le simulateur.
- `simulator_step_complete`: une étape du simulateur est terminée.
- `simulator_submit`: le formulaire est envoyé.
- `simulator_abandon`: une personne quitte le simulateur avant les résultats, avec l'étape et le bloc atteints.
- `simulator_results_view`: la page de résultats est affichée.
- `result_detail_open`: une personne ouvre le détail d'une piste.
- `result_guide_open`: une personne passe d'un résultat de simulateur au guide détaillé lié.
- `catalog_search`: une recherche est faite dans le catalogue.
- `catalog_guide_open`: une personne ouvre le guide détaillé depuis une fiche catalogue.
- `guide_card_click`: une page guide est ouverte depuis la liste des guides.
- `guide_detail_view`: une page guide détaillée est consultée.
- `guide_detail_link_click`: une personne clique un lien depuis un guide détaillé.

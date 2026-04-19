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
node scripts/simulator-smoke-test.js
node scripts/catalog-quality-check.js
```

Ces scripts vérifient les cas sensibles du simulateur et la qualité minimale des fiches du catalogue (champs essentiels, doublons et liens internes).

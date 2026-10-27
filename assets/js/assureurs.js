/* Assureurs-maladie actifs dans toute la Suisse (assurance de base).
   Point de départ : OFSP, « Liste des assureurs-maladie admis », état au 1er octobre 2026.
   Chaque adresse a ensuite été comparée au site de la caisse (octobre 2026) ; quand elles différaient, c'est le site de la
   caisse qui l'emporte (liste OFSP périmée pour Sanitas, Galenos ; KPT et SWICA : adresse postale/NPA de leur propre site ;
   Helsana : guichet « Kündigungen » indiqué par la caisse ; Assura : case postale 531 de la déclaration de protection des données)
   https://www.bag.admin.ch/fr/listes-des-assureurs-et-des-reassureurs-autorises
   Champ mail : adresse e-mail de résiliation, renseignée seulement quand la caisse l'indique elle-même sur son site
   (Helsana : helsana.ch/fr/prives/services/assurance/resilier.html ; Sanitas : sanitas.com, page « résilier »).
   À relire à chaque nouvelle liste publiée (changements d'adresse, radiations). */
window.MONAIDE_ASSUREURS = [
  { k: 'Agrisano', nom: 'Agrisano Krankenkasse AG', rue: 'Laurstrasse 10', npa: '5201 Brugg AG' },
  { k: 'Aquilana', nom: 'Aquilana Versicherungen', rue: 'Bruggerstrasse 46', npa: '5401 Baden' },
  { k: 'Assura', nom: 'Assura-Basis SA', rue: 'Avenue C.-F. Ramuz 70, case postale 531', npa: '1009 Pully' },
  { k: 'Atupri', nom: 'Atupri Assurance de la santé SA', rue: 'Laupenstrasse 18', npa: '3008 Bern' },
  { k: 'Avenir', alias: 'Groupe Mutuel', nom: 'Avenir Assurance Maladie SA', rue: 'Rue des Cèdres 5', npa: '1919 Martigny' },
  { k: 'Concordia', nom: 'CONCORDIA Assurance suisse de maladie et accidents SA', rue: 'Bundesplatz 15', npa: '6002 Luzern' },
  { k: 'CSS', nom: 'CSS Assurance-maladie SA', rue: 'Tribschenstrasse 21, case postale 2568', npa: '6002 Luzern' },
  { k: 'EGK', nom: 'EGK Grundversicherungen AG', rue: 'Birspark 1', npa: '4242 Laufen' },
  { k: 'Galenos', nom: 'Galenos AG', rue: 'Rautistrasse 60', npa: '8048 Zürich' },
  { k: 'Helsana', nom: 'Helsana Versicherungen AG', rue: 'IDPH Kündigungen D-CH, Postfach', npa: '8081 Zürich', mail: 'resiliations@helsana.ch' },
  { k: 'KPT', nom: 'KPT Caisse-maladie SA', rue: 'Case postale', npa: '3001 Bern' },
  { k: 'Mutuel', alias: 'Groupe Mutuel', nom: 'Mutuel Assurance Maladie SA', rue: 'Rue des Cèdres 5', npa: '1919 Martigny' },
  { k: 'ÖKK', nom: 'ÖKK Kranken- und Unfallversicherungen AG', rue: 'Bahnhofstrasse 13, case postale', npa: '7302 Landquart' },
  { k: 'Philos', alias: 'Groupe Mutuel', nom: 'Philos Assurance Maladie SA', rue: 'Rue des Cèdres 5', npa: '1919 Martigny' },
  { k: 'rhenusana', nom: 'rhenusana', rue: 'Widnauerstrasse 6', npa: '9435 Heerbrugg' },
  { k: 'sana24', nom: 'sana24 AG', rue: 'Weltpoststrasse 19, case postale', npa: '3000 Bern 16' },
  { k: 'Sanitas', nom: 'Sanitas Grundversicherungen AG', rue: 'Jägergasse 3', npa: '8004 Zürich', mail: 'info@sanitas.com' },
  { k: 'SWICA', nom: 'SWICA Assurance-maladie SA', rue: 'Römerstrasse 37', npa: '8400 Winterthur' },
  { k: 'Visana', nom: 'Visana AG', rue: 'Weltpoststrasse 19, case postale', npa: '3000 Bern 16' },
  { k: 'Vivao Sympany', nom: 'Vivao Sympany SA', rue: 'Peter Merian-Weg 4', npa: '4002 Basel' },
  { k: 'vita surselva', nom: 'vita surselva', rue: 'Bahnhofstrasse 33', npa: '7130 Ilanz' }
];

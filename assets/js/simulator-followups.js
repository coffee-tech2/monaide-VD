window.MONAIDE_SIMULATOR_FOLLOWUPS = [
  {
    id: 'fortune',
    patterns: ['Subside LAMal', 'Revenu d\'insertion', 'CarteCulture', 'Prestations communales'],
    title: 'Fortune et épargne',
    text: 'L’épargne peut changer certaines aides. Si tu n’es pas sûr·e du montant, fais vérifier ce point avant de déposer une demande.',
    when: function(profile) {
      return !profile || !profile.fortune || profile.fortune === 'inconnu';
    }
  },
  {
    id: 'chomage-cotisations',
    patterns: ['Assurance chômage'],
    title: 'Droit au chômage',
    text: 'Pour le chômage, il faut souvent vérifier la durée de cotisation, la date de fin de contrat et l’inscription à l’ORP.',
    when: function(profile) {
      if (!profile) return false;
      return !profile.aidesListe || profile.aidesListe.indexOf('chomage') === -1;
    }
  },
  {
    id: 'statut-sejour',
    patterns: ['Revenu d\'insertion', 'Subside LAMal', 'Prestations complémentaires', 'questions de migration'],
    title: 'Statut de séjour précis',
    text: 'Le type de permis peut changer le bon service à contacter. Si ce point est flou, fais-le vérifier rapidement.',
    when: function(profile) {
      if (!profile || !profile.permis) return false;
      return [
        'Permis F',
        'Permis S',
        'Permis L',
        'Permis N',
        'Permis G',
        'Autre / sans statut régulier'
      ].indexOf(profile.permis) !== -1;
    }
  },
  {
    id: 'formation-ocbe',
    patterns: ['Bourses d\'études'],
    title: 'Situation de formation',
    text: 'Pour une bourse OCBE, le type de formation, le domicile et parfois la situation des parents peuvent compter.',
    when: function(profile) {
      return !!(profile && profile.formation && profile.formation !== 'non');
    }
  },
  {
    id: 'loyer',
    patterns: ['Aides logement', 'Revenu d\'insertion'],
    title: 'Montant du loyer',
    text: 'Le montant du loyer aide à savoir s’il faut regarder le budget, le logement, ou les deux.',
    when: function(profile) {
      return !profile || !profile.loyer;
    }
  }
];

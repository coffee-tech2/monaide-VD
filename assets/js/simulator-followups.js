window.MONAIDE_SIMULATOR_FOLLOWUPS = [
  {
    id: 'fortune',
    patterns: ['Subside LAMal', 'Revenu d\'insertion', 'CarteCulture', 'Prestations communales'],
    title: 'Fortune et épargne',
    text: 'Le niveau d’épargne ou de fortune peut changer le résultat pour certaines aides. Si tu hésites, vérifie ce point avant de conclure.',
    when: function(profile) {
      return !profile || !profile.fortune || profile.fortune === 'inconnu';
    }
  },
  {
    id: 'chomage-cotisations',
    patterns: ['Assurance chômage'],
    title: 'Droit au chômage',
    text: 'Pour l’assurance chômage, il faut souvent vérifier la durée de cotisation, la date de fin de contrat et l’inscription à l’ORP.',
    when: function(profile) {
      if (!profile) return false;
      return !profile.aidesListe || profile.aidesListe.indexOf('chomage') === -1;
    }
  },
  {
    id: 'statut-sejour',
    patterns: ['Revenu d\'insertion', 'Subside LAMal', 'Prestations complémentaires', 'questions de migration'],
    title: 'Statut de séjour précis',
    text: 'Le type de permis ou de statut de séjour peut changer la porte d’entrée ou les conditions. Si ce point est flou, fais-le confirmer rapidement.',
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
    text: 'Pour une bourse OCBE, il faut souvent clarifier le type exact de formation, le domicile, et parfois la situation financière des parents ou l’indépendance.',
    when: function(profile) {
      return !!(profile && profile.formation && profile.formation !== 'non');
    }
  },
  {
    id: 'loyer',
    patterns: ['Aides logement', 'Revenu d\'insertion'],
    title: 'Montant du loyer',
    text: 'Le montant du loyer et la stabilité du logement aident à savoir si le problème est surtout budgétaire, social ou lié au logement lui-même.',
    when: function(profile) {
      return !profile || !profile.loyer;
    }
  }
];

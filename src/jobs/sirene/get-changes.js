export const getLegalUnitChanges = (data) => {

  const periode = data.periodesUniteLegale?.[0] || {};

  const trackedFields = [
    "changementNicSiegeUniteLegale",
    "changementEtatAdministratifUniteLegale",
    "changementNomUniteLegale",
    "changementNomUsageUniteLegale",
    "changementDenominationUniteLegale",
    "changementCategorieJuridiqueUniteLegale",
    "changementDenominationUsuelleUniteLegale"
  ];

  const getChangeValue = (field, periode) => {
    if (field === 'changementDenominationUsuelleUniteLegale') {
      return [
        periode.denominationUsuelle1UniteLegale,
        periode.denominationUsuelle2UniteLegale,
        periode.denominationUsuelle3UniteLegale
      ].filter(Boolean);
    }
    if (trackedFields.includes(field)) {
      const fieldWithoutChangement = field.replace('changement', '');
      return periode[fieldWithoutChangement.charAt(0).toLowerCase() + fieldWithoutChangement.slice(1)];
    }
  };

  return Object.entries(periode)
    .filter(([field, value]) => trackedFields.includes(field) && value === true)
    .map(([field]) => {
      const value = getChangeValue(field, periode);
      if (value === undefined) return null;
      return {
        changeType: 'change',
        changeEffectiveDate: periode.dateDebut,
        field,
        value
      };
    })
    .filter(Boolean);

};

export const getEstablishmentChanges = (data) => {

  const period = data.periodesEtablissement?.[0];

  const changes = [];

  if (period.changementEtatAdministratifEtablissement) {
    changes.push({
      changeType: 'change',
      changeEffectiveDate: period.dateDebut,
      field: 'etatAdministratifEtablissement',
      value: period.etatAdministratifEtablissement
    });
  }
  changes.push({
    changeType: 'check',
    field: 'dateCreationEtablissement',
    value: data.dateCreationEtablissement
  });
  changes.push({
    changeType: 'check',
    field: 'addressEtablissement',
    value: data.adresseEtablissement
  })

  return changes;
};

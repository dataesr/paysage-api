import { fetchLegalUnitById, fetchEstablishmentById } from './api';

export const getLegalUnitChanges = async (element) => {
  const { siren } = element;

  const legalUnit = await fetchLegalUnitById(siren);
  if (!legalUnit) return [];
  const period = legalUnit.periodesUniteLegale?.[0] || {};
  const previousPeriod = legalUnit.periodesUniteLegale?.[1] || {};

  const trackedFields = [
    "changementNicSiegeUniteLegale",
    "changementEtatAdministratifUniteLegale",
    "changementNomUniteLegale",
    "changementNomUsageUniteLegale",
    "changementDenominationUniteLegale",
    "changementCategorieJuridiqueUniteLegale",
    "changementDenominationUsuelleUniteLegale"
  ];

  const getChangeValue = (field, period) => {
    if (field === 'changementDenominationUsuelleUniteLegale') {
      return [
        period.denominationUsuelle1UniteLegale,
        period.denominationUsuelle2UniteLegale,
        period.denominationUsuelle3UniteLegale
      ].filter(Boolean);
    }
    if (trackedFields.includes(field)) {
      const fieldWithoutChangement = field.replace('changement', '');
      return period[fieldWithoutChangement.charAt(0).toLowerCase() + fieldWithoutChangement.slice(1)];
    }
  };

  const changes = Object.entries(period)
    .filter(([field, value]) => trackedFields.includes(field) && value === true)
    .map(([field]) => {
      const value = getChangeValue(field, period);
      const previousValue = getChangeValue(field, previousPeriod);
      if (value === undefined) return null;
      return {
        siren,
        paysage,
        type: 'legalUnit',
        siret: null,
        field,
        value,
        previousValue,
        changeEffectiveDate: period.dateDebut,
        numberOfPeriods: legalUnit.nombrePeriodesUniteLegale,
      };
    })
    .filter(Boolean);

  if (changes.find((change) => change.field === 'changementNicSiegeUniteLegale')) {
    const headquarter = await fetchEstablishmentById(siren + period.nicSiegeUniteLegale);
    if (headquarter) {
      changes.push({
        siren,
        paysage,
        type: 'legalUnit',
        siret: null,
        field: 'changementAdresseSiegeUniteLegale',
        value: headquarter.adresseEtablissement,
        previousValue: null,
        changeEffectiveDate: period.dateDebut,
        numberOfPeriods: legalUnit.nombrePeriodesUniteLegale,
      });
    }
  }
  return changes;
};

export const getEstablishmentChanges = async (element) => {
  const { siren, siret, paysage } = element;

  const establishment = await fetchEstablishmentById(siret);
  if (!establishment) return [];

  const period = data.periodesEtablissement?.[0];
  const previousPeriod = data.periodesEtablissement?.[1];

  const changes = [];

  if (period.changementEtatAdministratifEtablissement) {
    changes.push({
      siren,
      paysage,
      siret,
      type: 'establishment',
      field,
      value: period.etatAdministratifEtablissement,
      previousValue: previousPeriod.etatAdministratifEtablissement,
      changeEffectiveDate: period.dateDebut,
      numberOfPeriods: establishment.nombrePeriodesEtablissement,
    });
  }

  return changes;
};

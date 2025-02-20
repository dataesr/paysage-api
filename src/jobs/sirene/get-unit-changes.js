import { fetchLegalUnitById, fetchEstablishmentById } from './api';

const TRACKED_FIELDS = [
  "changementNicSiegeUniteLegale",
  "changementEtatAdministratifUniteLegale",
  "changementNomUniteLegale",
  "changementNomUsageUniteLegale",
  "changementDenominationUniteLegale",
  "changementCategorieJuridiqueUniteLegale",
  "changementDenominationUsuelleUniteLegale"
];

const extractDenominationUsuelle = (period) =>
  [
    period.denominationUsuelle1UniteLegale,
    period.denominationUsuelle2UniteLegale,
    period.denominationUsuelle3UniteLegale
  ].filter(Boolean);

const getFieldWithoutChangement = (field) => {
  const fieldWithoutChangement = field.replace('changement', '');
  return fieldWithoutChangement.charAt(0).toLowerCase() + fieldWithoutChangement.slice(1);
};

const getFieldValue = (field, period) => {
  if (!period) return undefined;

  if (field === 'changementDenominationUsuelleUniteLegale') {
    return extractDenominationUsuelle(period);
  }

  return TRACKED_FIELDS.includes(field)
    ? period[getFieldWithoutChangement(field)]
    : undefined;
};


function* periodPairsGenerator(periods) {
  for (let i = periods.length - 1; i > 0; i--) {
    yield {
      previousPeriod: periods[i],
      currentPeriod: periods[i - 1]
    };
  }
}

async function* changesGenerator(periodPair) {
  const { previousPeriod, currentPeriod } = periodPair;

  // Generate base changes
  for (const [field, value] of Object.entries(currentPeriod)) {
    if (TRACKED_FIELDS.includes(field) && value === true) {
      const change = {
        siren,
        paysage,
        type: 'legalUnit',
        siret: null,
        field,
        value: getFieldValue(field, currentPeriod),
        previousValue: getFieldValue(field, previousPeriod),
        changeEffectiveDate: currentPeriod.dateDebut,
        numberOfPeriods: currentPeriod.period,
      };

      if (change.value !== undefined) {
        yield change;
      }
    }
  }

  // Handle address changes
  if (currentPeriod.changementNicSiegeUniteLegale) {
    const headquarter = await fetchEstablishmentById(siren + currentPeriod.nicSiegeUniteLegale);
    if (headquarter) {
      yield {
        siren,
        paysage,
        type: 'legalUnit',
        siret: null,
        field: 'changementAdresseSiegeUniteLegale',
        value: headquarter.adresseEtablissement,
        previousValue: null,
        changeEffectiveDate: currentPeriod.dateDebut,
        numberOfPeriods: legalUnit.nombrePeriodesUniteLegale,
      };
    }
  }
}

export const getLegalUnitChanges = async (element) => {
  const { siren, paysage } = element;

  const legalUnit = await fetchLegalUnitById(siren);
  if (!legalUnit) return [];

  const periods = legalUnit.periodesUniteLegale || [];

  const allChanges = [];

  for (const periodPair of periodPairsGenerator(periods)) {
    for await (const change of changesGenerator(periodPair)) {
      allChanges.push(change);
    }
  }

  return allChanges;
};

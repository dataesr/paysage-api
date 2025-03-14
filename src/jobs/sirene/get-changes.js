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
  if (!periods || periods.length < 2) return;
  for (let i = periods.length - 1; i > 0; i--) {
    yield {
      previousPeriod: periods[i],
      currentPeriod: periods[i - 1],
    };
  }
}


export const getLegalUnitChanges = async (element) => {
  const { siren, paysage } = element;
  if (!siren) return [];

  const legalUnit = await fetchLegalUnitById(siren);
  if (!legalUnit) return [];

  async function getChangesForPeriodPair(periodPair) {
    const { previousPeriod, currentPeriod } = periodPair;
    const periodPairChanges = []

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
        };

        if (change.value !== undefined) {
          periodPairChanges.push(change);
        }
      }
    }

    // Handle address changes
    if (currentPeriod.changementNicSiegeUniteLegale) {
      const headquarter = await fetchEstablishmentById(siren + currentPeriod.nicSiegeUniteLegale);
      if (headquarter) {
        periodPairChanges.push({
          siren,
          paysage,
          type: 'legalUnit',
          siret: null,
          field: 'changementAdresseSiegeUniteLegale',
          value: headquarter.adresseEtablissement,
          previousValue: null,
          changeEffectiveDate: currentPeriod.dateDebut,
        });
      }
    }
    return periodPairChanges;
  }
  const periods = legalUnit.periodesUniteLegale || [];
  const changes = [];

  for (const periodPair of periodPairsGenerator(periods)) {
    const pairChanges = await getChangesForPeriodPair(periodPair);
    changes.push(...pairChanges);
  }
  return changes;
};

export const getEstablishmentChanges = async (element) => {
  const { siren, siret, paysage } = element;
  if (!siret) return [];

  const establishment = await fetchEstablishmentById(siret);
  if (!establishment) return [];

  const periods = establishment.periodesEtablissement || [];
  const changes = [];

  for (const periodPair of periodPairsGenerator(periods)) {
    const { previousPeriod, currentPeriod } = periodPair;

    if (currentPeriod.changementEtatAdministratifEtablissement) {
      changes.push({
        siren,
        paysage,
        siret,
        type: 'establishment',
        field: "changementEtatAdministratifEtablissement",
        value: currentPeriod.etatAdministratifEtablissement,
        previousValue: previousPeriod.etatAdministratifEtablissement,
        changeEffectiveDate: currentPeriod.dateDebut,
      });
    }
  }
  return changes;
};

import structuresLightQuery from '../../api/commons/queries/structures.light.query';
import { client, db } from '../../services/mongo.service';
import { formatDateToString } from './utils';

const dataset = 'fr-esr-paysage-fonctions-gouvernance';

export default async function exportFrEsrPaysageFonctionsGourvernance() {
  const data = await db.collection('relationships').aggregate([
    { $match: { relationTag: 'gouvernance' } },
    {
      $lookup: {
        from: 'structures',
        localField: 'resourceId',
        foreignField: 'id',
        pipeline: structuresLightQuery,
        as: 'structure',
      },
    },
    { $set: { structure: { $arrayElemAt: ['$structure', 0] } } },
    {
      $lookup: {
        from: 'persons',
        localField: 'relatedObjectId',
        foreignField: 'id',
        pipeline: [],
        as: 'person',
      },
    },
    { $set: { person: { $arrayElemAt: ['$person', 0] } } },
    {
      $lookup: {
        from: 'relationtypes',
        localField: 'relationTypeId',
        foreignField: 'id',
        pipeline: [],
        as: 'relationType',
      },
    },
    { $set: { relationType: { $arrayElemAt: ['$relationType', 0] } } },
  ]).toArray();
  const json = data.map(({ structure = {}, person = {}, relationType = {}, ...relationship }) => {
    const startDate = new Date(relationship.startDate);
    const endDate = new Date(relationship.endDate);
    const previsionalEndDate = new Date(relationship.endDatePrevisional);
    let state;
    if (!relationship.startDate && !relationship.endDate) { state = 'Sans date'; }
    if (relationship.startDate && startDate > new Date()) { state = 'Futur'; }
    if (relationship.startDate && startDate <= new Date()) { state = 'Actif'; }
    if (relationship.endDate && endDate < new Date()) { state = 'Passé'; }
    if (relationship.active === false) { state = 'Passé'; }
    const annelis = (structure?.identifiers?.find((i) => i.type === 'annelis')?.value
      && relationType.annelisId
      && ['Futur', 'Actif'].includes(state)
    ) ? 'Y' : 'N';
    const row = {
      dataset,
      etat: state,
      liaison_id_paysage: relationship.id,
      eta_cat: structure.category?.usualNameFr,
      eta_cat_jur: structure.legalcategory?.longNameFr,
      eta_cat_act: structure.categories.map((cat) => cat?.usualNameFr).join(';'),
      eta_id: structure?.identifiers?.find((i) => i.type === 'annelis')?.value,
      eta_uai: structure?.identifiers?.find((i) => i.type === 'uai')?.value,
      eta_id_paysage: structure.id,
      eta_lib: structure.currentName?.usualName,
      personne_id_paysage: person?.id,
      genre: person.gender?.[0],
      prenom: person.firstName,
      nom: person.lastName,
      fonction_cat_id_paysage: relationType.id,
      fonction_cat_id: relationType.annelisId,
      interim: (relationship.mandateTemporary === true) ? 'O' : 'N',
      fonction_cat_lib: (person.gender === 'Femme') ? relationType.feminineName : relationType.maleName,
      fonction_cat_lib_U: relationType.name,
      fonction_cat_lib_exact: relationship.mandatePrecision || (person.gender === 'Femme') ? relationType.feminineName : relationType.maleName,
      fonction_groupe: relationType.mandateTypeGroup,
      email_generique: relationship.mandateEmail,
      email_nominatif: relationship.personalEmail,
      telephone: relationship.mandatePhonenumber,
      date_debut: (!Number.isNaN(startDate.getTime())) ? formatDateToString(startDate) : undefined,
      date_fin: (!Number.isNaN(endDate.getTime())) ? formatDateToString(endDate) : undefined,
      date_fin_prevue: (!Number.isNaN(previsionalEndDate.getTime())) ? formatDateToString(previsionalEndDate) : undefined,
      date_maj: relationship.updatedAt ? formatDateToString(relationship.updatedAt) : formatDateToString(relationship.createdAt),
      annelis,
    };
    return row;
  });
  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('opendata').deleteMany({ dataset });
    await db.collection('opendata').insertMany(json);
    await session.endSession();
  });

  return { status: 'success', location: `/opendata/${dataset}` };
}

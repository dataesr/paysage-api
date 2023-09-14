import { db } from '../../services/mongo.service';
import structuresLightQuery from '../../api/commons/queries/structures.light.query';
import personLightQuery from '../../api/commons/queries/persons.light.query';
import relationTypesLightQuery from '../../api/commons/queries/relation-types.light.query';

export default async function synchronizeAnnuaireCollection(job) {
  await db.collection('relationships')
    .aggregate([
      { $match: { relationTag: 'gouvernance' } },
      {
        $lookup: {
          from: 'persons',
          localField: 'relatedObjectId',
          foreignField: 'id',
          pipeline: personLightQuery,
          as: 'persons',
        },
      },
      {
        $lookup: {
          from: 'structures',
          localField: 'resourceId',
          foreignField: 'id',
          pipeline: structuresLightQuery,
          as: 'structures',
        },
      },
      { $set: { structures: { $arrayElemAt: ['$structures', 0] } } },
      { $set: { persons: { $arrayElemAt: ['$persons', 0] } } },
      { $set: { category: '$structures.category.usualNameFr' } },
      { $set: { structureId: '$structures.id' } },
      { $set: { structureName: '$structures.displayName' } },
      { $set: { person: '$persons.displayName' } },
      { $set: { personId: '$persons.id' } },
      { $set: { gender: '$persons.gender' } },
      {
        $lookup: {
          from: 'relationtypes',
          localField: 'relationTypeId',
          foreignField: 'id',
          pipeline: relationTypesLightQuery,
          as: 'relationType',
        },
      },
      { $set: { relationType: { $arrayElemAt: ['$relationType', 0] } } },
      { $set: { mandateTypeGroup: '$relationType.mandateTypeGroup' } },
      { $set: { relationType: '$relationType.name' } },
      { $set: { endDate: { $ifNull: ['$endDate', null] } } },
      { $set: { active: { $ifNull: ['$active', false] } } },
      { $set: { active: { $or: [{ $eq: ['$active', true] }, { $eq: ['$endDate', null] }, { $gte: ['$endDate', new Date().toISOString().split('T')[0]] }] } } },
      {
        $project: {
          _id: 0,
          id: 1,
          person: 1,
          personId: 1,
          structureId: 1,
          gender: 1,
          category: 1,
          structureName: 1,
          relationType: 1,
          mandateTypeGroup: 1,
          startDate: { $ifNull: ['$startDate', null] },
          endDate: { $ifNull: ['$endDate', null] },
          endDatePrevisional: { $ifNull: ['$endDatePrevisional', null] },
          mandatePosition: { $ifNull: ['$mandatePosition', null] },
          mandateReason: { $ifNull: ['$mandateReason', null] },
          mandateEmail: { $ifNull: ['$mandateEmail', null] },
          personalEmail: { $ifNull: ['$personalEmail', null] },
          mandatePhonenumber: { $ifNull: ['$mandatePhonenumber', null] },
          mandateTemporary: { $ifNull: ['$mandateTemporary', null] },
          mandatePrecision: { $ifNull: ['$mandatePrecision', null] },
          active: 1,
        },
      },
      { $out: 'annuaire' },
    ]).toArray().catch((e) => {
      job.fail(`La synchronisation a échouée: ${e.message}`);
      return null;
    });
  return { ok: 1 }
}

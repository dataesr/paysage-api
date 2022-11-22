import metas from './metas.query';
import officialtextLightQuery from './official-texts.light.query';
import relationTypesLightQuery from './relation-types.light.query';
import { relatedObjectLookup, resourceLookup, associatedObjectsListLookup } from './related-object.query';

export default [
  ...relatedObjectLookup,
  ...resourceLookup,
  ...associatedObjectsListLookup,
  ...metas,
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
  {
    $lookup: {
      from: 'officialtexts',
      localField: 'startDateOfficialTextId',
      foreignField: 'id',
      pipeline: officialtextLightQuery,
      as: 'startDateOfficialText',
    },
  },
  { $set: { startDateOfficialText: { $arrayElemAt: ['$startDateOfficialText', 0] } } },
  {
    $lookup: {
      from: 'officialtexts',
      localField: 'endDateOfficialTextId',
      foreignField: 'id',
      pipeline: officialtextLightQuery,
      as: 'endDateOfficialText',
    },
  },
  { $set: { endDateOfficialText: { $arrayElemAt: ['$endDateOfficialText', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
      resourceId: 1,
      resource: 1,
      relationsGroupId: { $ifNull: ['$relationsGroupId', null] },
      relatedObject: 1,
      relationType: { $ifNull: ['$relationType', { priority: 99 }] },
      startDateOfficialText: 1,
      endDateOfficialText: 1,
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      endDatePrevisional: { $ifNull: ['$endDatePrevisional', null] },
      mandatePosition: { $ifNull: ['$mandatePosition', null] },
      mandateReason: { $ifNull: ['$mandateReason', null] },
      mandateEmail: { $ifNull: ['$mandateEmail', null] },
      mandateTemporary: { $ifNull: ['$mandateTemporary', null] },
      mandatePrecision: { $ifNull: ['$mandatePrecision', null] },
      otherAssociatedObjectIds: { $ifNull: ['$otherAssociatedObjectIds', []] },
      otherAssociatedObjects: 1,
      active: { $ifNull: ['$active', null] },
    },
  },
];

import metas from './metas.query';
import officialtextLightQuery from './officialtexts.light.query';
import relationTypesLightQuery from './relation-types.light.query';
import { relatedObjectLookup, resourceLookup } from './related-object.query';

export default [
  ...metas,
  ...relatedObjectLookup,
  ...resourceLookup,
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
      resourceId: 1,
      resource: 1,
      relationsGroupId: 1,
      relatedObject: 1,
      relationType: 1,
      startDateOfficialText: 1,
      endDateOfficialText: 1,
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

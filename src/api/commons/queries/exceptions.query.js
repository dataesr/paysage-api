import metas from './metas.query';
import structuresLightQuery from './structures.light.query';
// import { resourceLookup } from './related-object.query';

export const readQuery = [
  ...metas,
  {
    $lookup: {
      from: 'structures',
      localField: 'resourceId',
      foreignField: 'id',
      pipeline: structuresLightQuery,
      as: 'resource',
    },
  },
  { $set: { resource: { $arrayElemAt: ['$resource', 0] } } },

  {
    $lookup: {
      from: 'geographicalcategories',
      localField: 'geographicalCategoryId',
      foreignField: 'id',
      as: 'geographiCalcategory',
    },
  },
  { $set: { geographiCalcategory: { $arrayElemAt: ['$geographiCalcategory', 0] } } },

  {
    $project: {
      _id: 0,
      id: 1,
      geographicalCategoryId: 1,
      resourceId: 1,
      resource: 1,
      geographiCalcategory: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

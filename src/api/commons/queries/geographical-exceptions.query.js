import metas from './metas.query';
import geographicalCategoryQuery from './geographical-categories.query';
import structureLightQuery from './structures.light.query';

export default [
  ...metas,
  {
    $lookup: {
      from: 'geographicalcategories',
      localField: 'geographicalCategoryId',
      foreignField: 'id',
      pipeline: geographicalCategoryQuery,
      as: 'geographicalCategory',
    },
  },
  { $set: { geographicalCategory: { $arrayElemAt: ['$geographicalCategory', 0] } } },
  {
    $lookup: {
      from: 'structures',
      localField: 'resourceId',
      foreignField: 'id',
      pipeline: structureLightQuery,
      as: 'resource',
    },
  },
  { $set: { resource: { $arrayElemAt: ['$resource', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      // geographicalCategoryId: 1,
      geographicalCategory: 1,
      // resourceId: 1,
      resource: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

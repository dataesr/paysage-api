import metas from './metas.query';
import legalcategoryLightQuery from './legalcategories.light.query';

export default [
  ...metas,
  {
    $lookup: {
      from: 'legalcategories',
      localField: 'legalcategoryId',
      foreignField: 'id',
      pipeline: legalcategoryLightQuery,
      as: 'legalcategory',
    },
  },
  { $set: { legalcategory: { $arrayElemAt: ['$legalcategory', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      rid: 1,
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      legalcategory: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

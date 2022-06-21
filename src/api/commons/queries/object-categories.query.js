import metas from './metas.query';
import categoryLightQuery from './categories.light.query';

export default [
  ...metas,
  {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: 'id',
      pipeline: categoryLightQuery,
      as: 'category',
    },
  },
  { $set: { category: { $arrayElemAt: ['$category', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      rid: 1,
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      categoryId: 1,
      category: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

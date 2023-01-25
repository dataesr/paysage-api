export default [
  {
    $lookup: {
      from: 'relationships',
      let: { item: '$id' },
      pipeline: [
        { $match: { $expr: { $and: [{ $eq: ['$resourceId', '$$item'] }, { $eq: ['$relationTag', 'structure-categorie'] }] } } },
      ],
      as: 'categories',
    },
  },
  { $set: { category: '$categories.relatedObjectId' } },
  {
    $lookup: {
      from: 'categories',
      let: { categoryIds: '$categories' },
      as: 'categories',
      pipeline: [
        { $match: { $expr: { $in: ['$id', '$$categoryIds'] } } },
        { $sort: { priority: 1 } },
      ],
    },
  },
  { $set: { category: { $arrayElemAt: ['$categories', 0] } } },
];

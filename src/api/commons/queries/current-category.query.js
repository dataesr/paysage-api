export default function currentCategoryQuery(local = 'id') {
  return [
    {
      $lookup: {
        from: 'relationships',
        localField: local,
        foreignField: 'resourceId',
        as: 'categories',
        pipeline: [{ $match: { relationTag: 'structure-categorie' } }],
      },
    },
    { $set: { categories: '$relationships.relatedObjectId' } },
    {
      $lookup: {
        from: 'categories',
        localField: 'categories',
        foreignField: 'id',
        as: 'categories',
        pipeline: [{ $sort: { priority: 1 } }],
      },
    },
    { $set: { category: { $arrayElemAt: ['$categories', 0] } } },
  ];
}

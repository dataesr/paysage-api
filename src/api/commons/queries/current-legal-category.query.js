export default function currentLegalCategoryQuery(local = 'id') {
  return [
    {
      $lookup: {
        from: 'relationships',
        localField: local,
        foreignField: 'resourceId',
        as: 'cjs',
        pipeline: [
          { $match: { relationTag: 'structure-categorie-juridique' } },
          { $sort: { startDate: 1 } },
        ],
      },
    },
    { $set: { legalcategory: { $arrayElemAt: ['$cjs', 0] } } },
  ];
}

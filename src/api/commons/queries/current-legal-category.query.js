export default [
  {
    $lookup: {
      from: 'relationships',
      localField: 'id',
      foreignField: 'resourceId',
      as: 'cjs',
      pipeline: [
        { $match: { relationTag: 'structure-categorie-juridique' } },
        { $sort: { startDate: 1 } },
      ],
    },
  },
  { $set: { legalcategory: { $arrayElemAt: ['$legalcategories', 0] } } },
];

export default [
  {
    $lookup: {
      from: 'relationships',
      let: { item: '$id' },
      pipeline: [
        { $match: { $expr: { $and: [{ $eq: ['$resourceId', '$$item'] }, { $eq: ['$relationTag', 'structure-categorie-juridique'] }] } } },
        { $sort: { startDate: 1 } },
      ],
      as: 'legalcategories',
    },
  },
  { $set: { legalcategory: { $arrayElemAt: ['$cjs', 0] } } },
];

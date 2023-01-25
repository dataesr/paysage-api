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
  { $set: { legalcategories: '$legalcategories.relatedObjectId' } },
  {
    $lookup: {
      from: 'legalcategories',
      let: { legalcategoryIds: '$legalcategories' },
      as: 'legalcategories',
      pipeline: [
        { $match: { $expr: { $in: ['$id', '$$legalcategoryIds'] } } },
        { $sort: { startDate: -1 } },
      ],
    },
  },
  { $set: { legalcategory: { $arrayElemAt: ['$legalcategories', 0] } } },
];

export default [
  {
    $lookup: {
      from: 'identifiers',
      localField: 'id',
      foreignField: 'resourceId',
      as: 'identifiers',
      pipeline: [{
        $match: {
          $expr: {
            $and: [
              { $eq: ['$active', true] },
              { $in: ['$type', ['idRef', 'ORCID', 'Wikidata']] },
            ],
          },
        },
      }],
    },
  },
  {
    $project: {
      _id: 0,
      id: 1,
      toindex: [{
        firstName: { $ifNull: ['$firstName', false] },
        identifiers: { $ifNull: ['$identifiers.value', null] },
        lastName: { $ifNull: ['$lastName', false] },
        otherNames: { $ifNull: ['$otherNames', false] },
      }],
      isDeleted: { $ifNull: ['$isDeleted', false] },
      name: { $concat: [{ $ifNull: ['$firstName', null] }, ' ', '$lastName'] },
    },
  },
];

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
      activity: { $ifNull: ['$activity', null] },
      firstName: { $ifNull: ['$firstName', false] },
      identifiers: { $ifNull: ['$identifiers.value', null] },
      isDeleted: { $ifNull: ['$isDeleted', false] },
      lastName: { $ifNull: ['$lastName', false] },
      name: { $concat: [{ $ifNull: ['$firstName', null] }, ' ', { $ifNull: ['$lastName', null] }] },
      otherNames: { $ifNull: ['$otherNames', false] },
    },
  },
];

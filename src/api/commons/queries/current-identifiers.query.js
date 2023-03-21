export default [
  {
    $lookup: {
      from: 'identifiers',
      let: { item: '$id' },
      pipeline: [{
        $match: {
          $expr: {
            $and: [
              { $eq: ['$resourceId', '$$item'] }, { $eq: ['$active', true] },
            ],
          },
        },
      }],
      as: 'identifiers',
    },
  },
];

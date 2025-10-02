export default [
  {
    $lookup: {
      from: 'identifiers',
      let: { item: '$id' },
      pipeline: [{
        $match: {
          $expr: {
            $eq: ['$resourceId', '$$item']
          },
        },
      }],
      as: 'identifiers',
    },
  },
];

export default [
  {
    $lookup: {
      from: 'socialmedias',
      let: { item: '$id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$resourceId', '$$item'] } } },
      ],
      as: 'socialmedias',
    },
  },
];

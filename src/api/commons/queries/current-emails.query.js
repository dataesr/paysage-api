export default [
  {
    $lookup: {
      from: 'emails',
      let: { item: '$id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$resourceId', '$$item'] } } },
      ],
      as: 'emails',
    },
  },
];

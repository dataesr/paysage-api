export default [
  {
    $lookup: {
      from: 'websites',
      let: { item: '$id' },
      pipeline: [
        { $match: { $expr: { $and: [{ $eq: ['$resourceId', '$$item'] }, { $eq: ['$type', 'website'] }] } } },
      ],
      as: 'websites',
    },
  },
];

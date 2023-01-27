export default [
  {
    $lookup: {
      from: 'weblinks',
      let: { item: '$id' },
      pipeline: [
        { $match: { $expr: { $and: [{ $eq: ['$resourceId', '$$item'] }, { $eq: ['$type', 'website'] }] } } },
      ],
      as: 'websites',
    },
  },
];

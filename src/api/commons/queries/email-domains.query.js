export default [
  { $match: { archived: { $ne: true } } },
  { $unwind: '$structures' },
  {
    $project: {
      _id: 0,
      structureId: '$structures.structureId',
      domain: { $toLower: '$domainName' },
      type: '$structures.type',
    },
  },
];

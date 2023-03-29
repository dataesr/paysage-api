export default [
  { $match: { name: 'reindex' } },
  { $set: { id: '$_id' } },
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      type: 1,
      data: 1,
      result: 1,
      lastRunAt: 1,
      lastFinishedAt: 1,
    },
  },
];

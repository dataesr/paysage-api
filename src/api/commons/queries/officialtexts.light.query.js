export default [
  {
    $project: {
      _id: 0,
      id: 1,
      nature: 1,
      type: 1,
      title: 1,
      pageUrl: 1,
      publicationDate: { $ifNull: ['$publicationDate', null] },
    },
  },
];

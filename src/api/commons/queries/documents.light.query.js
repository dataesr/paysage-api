export default [{
  $project: {
    _id: 0,
    id: 1,
    title: 1,
    description: { $ifNull: ['$description', null] },
    url: 1,
    mimetype: 1,
    canEdit: 1,
    canRead: 1,
  },
}];

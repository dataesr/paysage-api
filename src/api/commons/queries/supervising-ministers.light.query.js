export default [{
  $project: {
    _id: 0,
    id: 1,
    displayName: '$usualName',
    collection: 'supervising-ministers',
    href: { $concat: ['/supervising-ministers/', '$id'] },
  },
}];

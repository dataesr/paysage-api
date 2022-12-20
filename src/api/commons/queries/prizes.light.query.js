export default [{
  $project: {
    _id: 0,
    id: 1,
    displayName: '$nameFr',
    collection: 'prizes',
    href: { $concat: ['/prizes/', '$id'] },
    nameFr: { $ifNull: ['$nameFr', null] },
    nameEn: { $ifNull: ['$nameEn', null] },
  },
}];

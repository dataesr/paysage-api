export default [{
  $project: {
    _id: 0,
    id: 1,
    displayName: '$nameFr',
    collection: 'prices',
    href: { $concat: ['/prices/', '$id'] },
    nameFr: { $ifNull: ['$nameFr', null] },
    nameEn: { $ifNull: ['$nameEn', null] },
  },
}];

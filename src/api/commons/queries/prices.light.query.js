export default [{
  $project: {
    _id: 0,
    id: 1,
    nameFr: { $ifNull: ['$nameFr', null] },
    nameEn: { $ifNull: ['$nameEn', null] },
  },
}];

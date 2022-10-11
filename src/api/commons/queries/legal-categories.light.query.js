export default [
  {
    $project: {
      _id: 0,
      id: 1,
      displayName: '$longNameFr',
      collection: 'legal-categories',
      href: { $concat: ['/legal-categories/', '$id'] },
      longNameFr: 1,
      inseeCode: { $ifNull: ['$inseeCode', null] },
      sector: { $ifNull: ['$sector', null] },
      legalPersonality: { $ifNull: ['$legalPersonality', null] },
      inPublicResearch: { $ifNull: ['$inPublicResearch', null] },
    },
  },
];

import relatedElementsQueries from './related-elements.query';

export default [
  ...relatedElementsQueries,
  {
    $project: {
      _id: 0,
      id: 1,
      title: 1,
      description: { $ifNull: ['$description', null] },
      fileUrl: { $ifNull: ['$url', null] },
      fileMimetype: { $ifNull: ['$mimetype', null] },
      eventDate: { $ifNull: ['$eventDate', null] },
      relatedStructures: 1,
      relatedCategories: 1,
      relatedPersons: 1,
      relatedPrices: 1,
      relatedProjects: 1,
      relatedTerms: 1,
    },
  },
];

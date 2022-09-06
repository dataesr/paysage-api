import metas from './metas.query';
import relatedElementsQueries from './related-elements.query';

export default [
  ...metas,
  ...relatedElementsQueries,
  {
    $project: {
      _id: 0,
      id: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
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

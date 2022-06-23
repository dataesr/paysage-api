import metas from './metas.query';
import relatedElementsQueries from './related-elements.query';
import documentTypeLightQuery from './document-types.light.query';

export default [
  ...metas,
  ...relatedElementsQueries,
  {
    $lookup: {
      from: 'documenttypes',
      localField: 'documentTypeId',
      foreignField: 'id',
      pipeline: documentTypeLightQuery,
      as: 'documentType',
    },
  },
  { $set: { documentType: { $arrayElemAt: ['$documentType', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      title: 1,
      description: { $ifNull: ['$description', null] },
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      documentType: 1,
      url: 1,
      mimetype: 1,
      originalName: 1,
      path: 1,
      canEdit: 1,
      canRead: 1,
      relatedStructures: 1,
      relatedCategories: 1,
      relatedPersons: 1,
      relatedPrices: 1,
      relatedProjects: 1,
      relatedTerms: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

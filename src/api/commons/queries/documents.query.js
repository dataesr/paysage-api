import metas from './metas.query';
import { relatedObjectsListLookup } from './related-object.query';
import documentTypeLightQuery from './document-types.light.query';

export default [
  ...metas,
  ...relatedObjectsListLookup,
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
      startDate: 1,
      endDate: { $ifNull: ['$endDate', null] },
      documentType: 1,
      documentTypeId: 1,
      documentUrl: { $ifNull: ['$documentUrl', null] },
      files: 1,
      relatedObjects: 1,
      isPublic: 1,
      canAccess: 1,
      relatesTo: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

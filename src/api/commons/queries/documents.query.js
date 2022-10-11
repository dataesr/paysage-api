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
      files: 1,
      relatedObjects: 1,
      relatesTo: 1,
    },
  },
];

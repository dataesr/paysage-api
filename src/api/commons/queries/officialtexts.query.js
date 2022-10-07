import metas from './metas.query';
import { relatedObjectsListLookup } from './related-object.query';

export default [
  ...metas,
  ...relatedObjectsListLookup,
  {
    $project: {
      _id: 0,
      id: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
      nature: 1,
      type: 1,
      jorftext: { $ifNull: ['$jorftext', null] },
      nor: { $ifNull: ['$nor', null] },
      title: 1,
      pageUrl: 1,
      boesrId: { $ifNull: ['$boesrId', null] },
      joId: { $ifNull: ['$joId', null] },
      publicationDate: { $ifNull: ['$publicationDate', null] },
      signatureDate: { $ifNull: ['$signatureDate', null] },
      startDate: { $ifNull: ['$startDate', null] },
      previsionalEndDate: { $ifNull: ['$previsionalEndDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      textExtract: { $ifNull: ['$textExtract', null] },
      comment: { $ifNull: ['$comment', null] },
      relatedObjects: 1,
    },
  },
];

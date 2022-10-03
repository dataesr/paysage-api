import metas from './metas.query';
import relatedObjectsQuery from './related-objects.query';

export default [
  ...metas,
  ...relatedObjectsQuery,
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
      type: 1,
      files: { $ifNull: ['$files', []] },
      eventDate: { $ifNull: ['$eventDate', null] },
      relatedObjects: 1,
    },
  },
];

import metas from './metas.query';
import {
  relatedObjectsListLookup,
  matchedWithListLookup,
  excludedObjectsListLookup,
} from './related-object.query';

export default [
  ...metas,
  ...relatedObjectsListLookup,
  ...matchedWithListLookup,
  ...excludedObjectsListLookup,
  {
    $project: {
      _id: 0,
      id: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
      alertId: 1,
      title: 1,
      publicationDate: 1,
      sourceUrl: 1,
      sourceName: { $ifNull: ['$sourceName', null] },
      crawlDate: { $ifNull: ['$crawlDate', null] },
      text: { $ifNull: ['$text', null] },
      relatedObjects: 1,
      excluded: 1,
      matchedWith: 1,
    },
  },
];
import metas from './metas.query';
import { resourceLookup } from './related-object.query';

export const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      type: 1,
      url: 1,
      language: { $ifNull: ['$language', null] },
      resourceId: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];
export const readQueryWithLookup = [
  ...metas,
  ...resourceLookup,
  {
    $project: {
      _id: 0,
      id: 1,
      type: 1,
      url: 1,
      language: { $ifNull: ['$language', null] },
      resourceId: 1,
      resource: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

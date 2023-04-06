import metas from './metas.query';
import { resourceLookup } from './related-object.query';

export const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      account: 1,
      type: 1,
      resourceId: 1,
      createdAt: 1,
      createdBy: 1,
      updatedAt: 1,
      updatedBy: 1,
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
      account: 1,
      type: 1,
      resourceId: 1,
      resource: 1,
      createdAt: 1,
      createdBy: 1,
      updatedAt: 1,
      updatedBy: 1,
    },
  },
];

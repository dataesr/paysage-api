import metas from './metas.query';
import { resourceLookup } from './related-object.query';

export const readQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      geographicalCategoryId: 1,
      resourceId: 1,
    },
  },
];

export const readQueryWithLookup = [
  ...metas,
  ...resourceLookup,
  {
    $project: {
      _id: 0,
      geographicalCategoryId: 1,
      resourceId: 1,
    },
  },
];

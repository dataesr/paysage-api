import metas from './metas.query';

export const onCreateApiKeyQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      role: 1,
      apiKey: 1,
      userId: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

export const onListApiKeyQuery = [
  ...metas,
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      role: 1,
      userId: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

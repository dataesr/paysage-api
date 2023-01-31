import currentIdentifiersQuery from './current-identifiers.query';

export default [
  ...currentIdentifiersQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      displayName: { $trim: { input: { $concat: [{ $ifNull: ['$firstName', ''] }, ' ', '$lastName'] } } },
      collection: 'persons',
      href: { $concat: ['/persons/', '$id'] },
      lastName: 1,
      firstName: { $ifNull: ['$firstName', null] },
      gender: { $ifNull: ['$gender', null] },
      identifiers: { $ifNull: ['$identifiers', []] },
    },
  },
];

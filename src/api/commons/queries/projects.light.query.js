import currentLocalisationQuery from './current-localisation.query';

export default [
  ...currentLocalisationQuery,
  { $project:
    {
      _id: 0,
      id: 1,
      displayName: '$nameFr',
      collection: 'projects',
      href: { $concat: ['/projects/', '$id'] },
      nameFr: 1,
      acronymFr: { $ifNull: ['$acronymFr', null] },
      description: { $ifNull: ['$description', null] },
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      currentLocalisation: 1,
    } },
];

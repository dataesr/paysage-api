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
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      grantPart: { $ifNull: ['$grantPart', null] },
      funding: { $ifNull: ['$funding', null] },
      currentLocalisation: 1,
    } },
];

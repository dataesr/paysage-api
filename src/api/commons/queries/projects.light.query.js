import metas from './metas.query';
import currentLocalisationQuery from './current-localisation.query';

export default [
  ...metas,
  ...currentLocalisationQuery,
  { $project:
    {
      _id: 0,
      id: 1,
      nameFr: 1,
      acronymFr: { $ifNull: ['$acronymFr', null] },
      description: { $ifNull: ['$description', null] },
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      currentLocalisation: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    } },
];

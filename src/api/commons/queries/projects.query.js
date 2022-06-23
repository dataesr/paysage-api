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
      nameEn: { $ifNull: ['$nameEn', null] },
      fullNameFr: { $ifNull: ['$fullNameFr', null] },
      fullNameEn: { $ifNull: ['$fullNameEn', null] },
      acronymFr: { $ifNull: ['$acronymFr', null] },
      acronymEn: { $ifNull: ['$acronymEn', null] },
      description: { $ifNull: ['$description', null] },
      startDate: { $ifNull: ['$startDate', null] },
      endDate: { $ifNull: ['$endDate', null] },
      grantPart: { $ifNull: ['$grantPart', null] },
      comment: { $ifNull: ['$comment', null] },
      currentLocalisation: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    } },
];

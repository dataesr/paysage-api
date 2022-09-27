import metas from './metas.query';
import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';

export default [
  ...metas,
  ...currentNameQuery,
  ...currentLocalisationQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      structureStatus: { $ifNull: ['$structureStatus', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      creationOfficialTextId: { $ifNull: ['$creationOfficialTextId', null] },
      creationReason: { $ifNull: ['$creationReason', null] },
      closureDate: { $ifNull: ['$closureDate', null] },
      closureOfficialTextId: { $ifNull: ['$closureOfficialTextId', null] },
      closureReason: { $ifNull: ['$closureReason', null] },
      descriptionFr: { $ifNull: ['$descriptionFr', null] },
      descriptionEn: { $ifNull: ['$descriptionEn', null] },
      status: 1,
      alternativePaysageIds: { $ifNull: ['$alternativePaysageIds', []] },
      currentName: { $ifNull: ['$currentName', {}] },
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
      redirection: { $ifNull: ['$redirection', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

import metas from './metas.query';
import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';
import officialtextLightQuery from './officialtexts.light.query';

export default [
  ...metas,
  ...currentNameQuery,
  ...currentLocalisationQuery,
  {
    $lookup: {
      from: 'officialtexts',
      localField: 'creationOfficialTextId',
      foreignField: 'id',
      pipeline: officialtextLightQuery,
      as: 'creationOfficialText',
    },
  },
  { $set: { creationOfficialText: { $arrayElemAt: ['$creationOfficialText', 0] } } },
  {
    $lookup: {
      from: 'officialtexts',
      localField: 'closureOfficialTextId',
      foreignField: 'id',
      pipeline: officialtextLightQuery,
      as: 'closureOfficialText',
    },
  },
  { $set: { closureOfficialText: { $arrayElemAt: ['$closureOfficialText', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      structureStatus: { $ifNull: ['$structureStatus', null] },
      closureDate: { $ifNull: ['$closureDate', null] },
      closureOfficialTextId: { $ifNull: ['$closureOfficialTextId', null] },
      closureOfficialText: { $ifNull: ['$closureOfficialText', {}] },
      closureReason: { $ifNull: ['$closureReason', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      creationOfficialTextId: { $ifNull: ['$creationOfficialTextId', null] },
      creationOfficialText: { $ifNull: ['$creationOfficialText', {}] },
      creationReason: { $ifNull: ['$creationReason', null] },
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

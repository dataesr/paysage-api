import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';
import metas from './metas.query';
import officialtextLightQuery from './official-texts.light.query';

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
      alternativePaysageIds: { $ifNull: ['$alternativePaysageIds', []] },
      closureDate: { $ifNull: ['$closureDate', null] },
      closureOfficialText: { $ifNull: ['$closureOfficialText', {}] },
      closureOfficialTextId: { $ifNull: ['$closureOfficialTextId', null] },
      closureReason: { $ifNull: ['$closureReason', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      creationOfficialText: { $ifNull: ['$creationOfficialText', {}] },
      creationOfficialTextId: { $ifNull: ['$creationOfficialTextId', null] },
      creationReason: { $ifNull: ['$creationReason', null] },
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
      currentName: { $ifNull: ['$currentName', {}] },
      descriptionEn: { $ifNull: ['$descriptionEn', null] },
      descriptionFr: { $ifNull: ['$descriptionFr', null] },
      exercice: { $ifNull: ['$exercice', null] },
      motto: { $ifNull: ['$motto', null] },
      netAccountingResult: { $ifNull: ['$netAccountingResult', null] },
      population: { $ifNull: ['$population', null] },
      source: { $ifNull: ['$source', null] },
      status: { $ifNull: ['$status', null] },
      structureStatus: { $ifNull: ['$structureStatus', null] },
      year: { $ifNull: ['$year', null] },
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
  },
];

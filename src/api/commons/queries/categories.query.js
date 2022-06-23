import metas from './metas.query';
import officialtextLightQuery from './officialtexts.light.query';

export default [
  ...metas,
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
  { $project: {
    _id: 0,
    id: 1,
    usualNameFr: 1,
    usualNameEn: { $ifNull: ['$usualNameEn', null] },
    shortNameEn: { $ifNull: ['$shortNameEn', null] },
    shortNameFr: { $ifNull: ['$shortNameFr', null] },
    acronymFr: { $ifNull: ['$acronymFr', null] },
    pluralNameFr: { $ifNull: ['$pluralNameFr', null] },
    otherNamesFr: { $ifNull: ['$otherNamesFr', []] },
    otherNamesEn: { $ifNull: ['$otherNamesEn', []] },
    descriptionFr: { $ifNull: ['$descriptionFr', null] },
    descriptionEn: { $ifNull: ['$descriptionEn', null] },
    comment: { $ifNull: ['$comment', null] },
    creationOfficialText: 1,
    closureOfficialText: 1,
    creationOfficialTextId: 1,
    closureOfficialTextId: 1,
    priority: 1,
    createdBy: 1,
    updatedBy: 1,
    createdAt: 1,
    updatedAt: 1,
  } },
];

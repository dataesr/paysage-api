import metas from './metas.query';
import officialtextLightQuery from './official-texts.light.query';

export default [
  ...metas,
  {
    $lookup: {
      from: 'officialtexts',
      localField: 'officialTextId',
      foreignField: 'id',
      pipeline: officialtextLightQuery,
      as: 'officialText',
    },
  },
  { $set: { officialText: { $arrayElemAt: ['$officialText', 0] } } },
  {
    $project: {
      _id: 0,
      id: 1,
      longNameFr: 1,
      inseeCode: { $ifNull: ['$inseeCode', null] },
      shortNameFr: { $ifNull: ['$shortNameFr', null] },
      acronymFr: { $ifNull: ['$acronymFr', null] },
      pluralNameFr: { $ifNull: ['$pluralNameFr', null] },
      descriptionFr: { $ifNull: ['$descriptionFr', null] },
      longNameEn: { $ifNull: ['$longNameEn', null] },
      shortNameEn: { $ifNull: ['$shortNameEn', null] },
      otherNames: { $ifNull: ['$otherNames', []] },
      sector: { $ifNull: ['$sector', null] },
      legalPersonality: { $ifNull: ['$legalPersonality', null] },
      inPublicResearch: { $ifNull: ['$inPublicResearch', null] },
      wikidataId: { $ifNull: ['$wikidataId', null] },
      websiteFr: { $ifNull: ['$websiteFr', null] },
      websiteEn: { $ifNull: ['$websiteEn', null] },
      comment: { $ifNull: ['$comment', null] },
      officialText: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

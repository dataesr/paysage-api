import currentLegalCategoryQuery from './current-legal-category.query';
import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';

const currentSiretQuery = [
  {
    $lookup: {
      from: 'identifiers',
      let: { item: '$id' },
      pipeline: [{
        $match: {
          $expr: {
            $and: [
              { $eq: ['$resourceId', '$$item'] },
              { $eq: ['$type', 'siret'] },
              { $ne: ['$active', false] },
            ],
          },
        },
      }],
      as: 'currentSiret',
    },
  },
  {
    $set: {
      currentSiret: { $arrayElemAt: ['$currentSiret', 0] }
    }
  }
]

const structQuery = [
  ...currentLegalCategoryQuery,
  ...currentLocalisationQuery,
  ...currentNameQuery,
  ...currentSiretQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      currentSiret: { $ifNull: ['$currentSiret', null] },
      closureDate: { $ifNull: ['$closureDate', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
      currentName: { $ifNull: ['$currentName', {}] },
      displayName: '$currentName.usualName',
      emails: { $ifNull: ['$emails', []] },
      href: { $concat: ['/structures/', '$id'] },
      legalcategory: { $ifNull: ['$legalcategory', {}] },
      structureStatus: { $ifNull: ['$structureStatus', 'active'] },
    },
  },
];
export default [
  {
    $group: {
      _id: "$paysage",
      siren: { $first: "$siren" },
      siret: { $first: "$siret" },
      id: { $first: "$paysage" },
      type: { $first: "$type" },
      lastModificationDate: { $max: "$lastChecked" },
      updates: { $push: "$$ROOT" },
    }
  },
  {
    $lookup: {
      from: "structures",
      localField: "_id",
      foreignField: "id",
      pipeline: structQuery,
      as: "paysageData",
    },
  },
  {
    $project: {
      _id: 0,
      id: "$_id",
      siren: 1,
      siret: 1,
      id: 1,
      type: 1,
      lastModificationDate: { $max: "$lastChecked" },
      paysageData: { $arrayElemAt: ["$paysageData", 0] },
      updates: 1,
    }
  },
];

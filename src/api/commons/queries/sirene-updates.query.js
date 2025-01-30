import currentLegalCategoryQuery from './current-legal-category.query';
import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';

const structQuery = [
  ...currentLegalCategoryQuery,
  ...currentLocalisationQuery,
  ...currentNameQuery,
  {
    $project: {
      _id: 0,
      id: 1,
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
      paysageData: { $arrayElemAt: ["$paysageData", 0] },
      updates: 1,
    }
  },
];

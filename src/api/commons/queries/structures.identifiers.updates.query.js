import currentLegalCategoryQuery from './current-legal-category.query';
import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';

const currentIdentifiersQuery = [
  {
    $lookup: {
      from: 'identifiers',
      let: { item: '$id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$resourceId', '$$item'] },
                { $ne: ['$active', false] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            type: 1,
            value: 1,
          },
        },
      ],
      as: 'currentIdentifiers',
    },
  },
];

const structQuery = [
  ...currentLegalCategoryQuery,
  ...currentLocalisationQuery,
  ...currentNameQuery,
  ...currentIdentifiersQuery,
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
      currentIdentifiers: { $ifNull: ['$currentIdentifiers', []] },
    },
  },
];

export default [
  {
    $group: {
      _id: '$paysage',
      id: { $first: '$paysage' },
      suggestions: {
        $push: {
          _id: '$_id',
          type: '$type',
          value: '$value',
          sourceType: '$sourceType',
          sourceValue: '$sourceValue',
          status: '$status',
          lastChecked: '$lastChecked',
        },
      },
      lastModificationDate: { $max: '$lastChecked' },
    },
  },
  {
    $lookup: {
      from: 'structures',
      localField: '_id',
      foreignField: 'id',
      pipeline: structQuery,
      as: 'paysageData',
    },
  },
  {
    $project: {
      _id: 0,
      id: '$_id',
      lastModificationDate: 1,
      suggestions: 1,
      paysageData: { $arrayElemAt: ['$paysageData', 0] },
    },
  },
];

import currentCategoryQuery from './current-category.query';
import currentLegalCategoryQuery from './current-legal-category.query';
import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';

export default [
  ...currentNameQuery,
  ...currentLocalisationQuery,
  ...currentLegalCategoryQuery,
  ...currentCategoryQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      displayName: '$currentName.usualName',
      collection: 'structures',
      href: { $concat: ['/structures/', '$id'] },
      structureStatus: { $ifNull: ['$structureStatus', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      closureDate: { $ifNull: ['$closureDate', null] },
      currentName: { $ifNull: ['$currentName', {}] },
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
      categories: { $ifNull: ['$categories', []] },
      category: { $ifNull: ['$category', {}] },
      legalcategory: { $ifNull: ['$legalcategory', {}] },
    },
  },
];

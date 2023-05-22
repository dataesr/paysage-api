import currentCategoryQuery from './current-category.query';
import currentEmailsQuery from './current-emails.query';
import currentIdentifiersQuery from './current-identifiers.query';
import currentLegalCategoryQuery from './current-legal-category.query';
import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';
import currentWebsitesQuery from './current-websites.query';

export default [
  ...currentWebsitesQuery,
  ...currentEmailsQuery,
  ...currentNameQuery,
  ...currentLocalisationQuery,
  ...currentLegalCategoryQuery,
  ...currentCategoryQuery,
  ...currentIdentifiersQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      displayName: '$currentName.usualName',
      collection: 'structures',
      href: { $concat: ['/structures/', '$id'] },
      structureStatus: { $ifNull: ['$structureStatus', null] },
      descriptionEn: { $ifNull: ['$descriptionEn', null] },
      descriptionFr: { $ifNull: ['$descriptionFr', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      closureDate: { $ifNull: ['$closureDate', null] },
      currentName: { $ifNull: ['$currentName', {}] },
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
      categories: { $ifNull: ['$categories', []] },
      category: { $ifNull: ['$category', {}] },
      legalcategories: { $ifNull: ['$legalcategories', []] },
      legalcategory: { $ifNull: ['$legalcategory', {}] },
      identifiers: { $ifNull: ['$identifiers', []] },
      socialmedias: { $ifNull: ['$socialmedias', []] },
      websites: { $ifNull: ['$websites', []] },
      emails: { $ifNull: ['$emails', []] },
    },
  },
];

import currentCategoryQuery from './current-category.query';
import currentEmailsQuery from './current-emails.query';
import currentIdentifiersQuery from './current-identifiers.query';
import currentLegalCategoryQuery from './current-legal-category.query';
import currentLocalisationQuery from './current-localisation.query';
import currentNameQuery from './current-name.query';
import currentWebsitesQuery from './current-websites.query';
import metas from './metas.query';

export default [
  ...metas,
  ...currentCategoryQuery,
  ...currentEmailsQuery,
  ...currentIdentifiersQuery,
  ...currentLegalCategoryQuery,
  ...currentLocalisationQuery,
  ...currentNameQuery,
  ...currentWebsitesQuery,
  {
    $project: {
      _id: 0,
      id: 1,
      categories: { $ifNull: ['$categories', []] },
      category: { $ifNull: ['$category', {}] },
      closureDate: { $ifNull: ['$closureDate', null] },
      creationDate: { $ifNull: ['$creationDate', null] },
      collection: 'structures',
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
      currentName: { $ifNull: ['$currentName', {}] },
      descriptionEn: { $ifNull: ['$descriptionEn', null] },
      descriptionFr: { $ifNull: ['$descriptionFr', null] },
      displayName: '$currentName.usualName',
      emails: { $ifNull: ['$emails', []] },
      href: { $concat: ['/structures/', '$id'] },
      identifiers: { $ifNull: ['$identifiers', []] },
      legalcategories: { $ifNull: ['$legalcategories', []] },
      legalcategory: { $ifNull: ['$legalcategory', {}] },
      socialmedias: { $ifNull: ['$socialmedias', []] },
      structureStatus: { $ifNull: ['$structureStatus', null] },
      websites: { $ifNull: ['$websites', []] },
    },
  },
];

import categoryLightQuery from './categories.light.query';
import legalCategoryLightQuery from './legal-categories.light.query';
import personLightQuery from './persons.light.query';
import prizeLightQuery from './prizes.light.query';
import projectLightQuery from './projects.light.query';
import structuresLightQuery from './structures.light.query';
import supervisingMinistersLightQuery from './supervising-ministers.light.query';
import termsLightQuery from './terms.light.query';

function getRelatedObject(localField) {
  return ([
    {
      $lookup: {
        from: 'categories',
        localField,
        foreignField: 'id',
        pipeline: categoryLightQuery,
        as: 'relatedCategories',
      },
    },
    {
      $lookup: {
        from: 'legalcategories',
        localField,
        foreignField: 'id',
        pipeline: legalCategoryLightQuery,
        as: 'relatedLegalCategories',
      },
    },
    {
      $lookup: {
        from: 'terms',
        localField,
        foreignField: 'id',
        pipeline: termsLightQuery,
        as: 'relatedTerms',
      },
    },
    {
      $lookup: {
        from: 'persons',
        localField,
        foreignField: 'id',
        pipeline: personLightQuery,
        as: 'relatedPersons',
      },
    },
    {
      $lookup: {
        from: 'prizes',
        localField,
        foreignField: 'id',
        pipeline: prizeLightQuery,
        as: 'relatedPrizes',
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField,
        foreignField: 'id',
        pipeline: projectLightQuery,
        as: 'relatedProjects',
      },
    },
    {
      $lookup: {
        from: 'structures',
        localField,
        foreignField: 'id',
        pipeline: structuresLightQuery,
        as: 'relatedStructures',
      },
    },
    {
      $lookup: {
        from: 'supervisingministers',
        localField,
        foreignField: 'id',
        pipeline: supervisingMinistersLightQuery,
        as: 'relatedMinisters',
      },
    },
    {
      $set: {
        related: {
          $concatArrays: [
            '$relatedLegalCategories',
            '$relatedStructures',
            '$relatedProjects',
            '$relatedPrizes',
            '$relatedPersons',
            '$relatedTerms',
            '$relatedCategories',
            '$relatedMinisters',
          ],
        },
      },
    },
  ]);
}

export const relatedObjectLookup = [
  ...getRelatedObject('relatedObjectId'),
  { $set: { relatedObject: { $arrayElemAt: ['$related', 0] } } },
];
export const resourceLookup = [
  ...getRelatedObject('resourceId'),
  { $set: { resource: { $arrayElemAt: ['$related', 0] } } },
];

export const relatedObjectsListLookup = [
  ...getRelatedObject('relatesTo'),
  { $set: { relatedObjects: '$related' } },
];
export const matchedWithListLookup = [
  ...getRelatedObject('matchedWith'),
  { $set: { matchedWith: '$related' } },
];
export const excludedObjectsListLookup = [
  ...getRelatedObject('excluded'),
  { $set: { excluded: '$related' } },
];
export const associatedObjectsListLookup = [
  ...getRelatedObject('otherAssociatedObjectIds'),
  { $set: { otherAssociatedObjects: '$related' } },
];

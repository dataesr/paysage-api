import categoryLightQuery from './categories.light.query';
import personLightQuery from './persons.light.query';
import priceLightQuery from './prices.light.query';
import projectLightQuery from './projects.light.query';
import structureLightQuery from './structures.light.query';
import termsLightQuery from './terms.light.query';

export default [
  {
    $lookup: {
      from: 'categories',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: categoryLightQuery,
      as: 'relatedCategories',
    },
  },
  {
    $lookup: {
      from: 'terms',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: termsLightQuery,
      as: 'relatedTerms',
    },
  },
  {
    $lookup: {
      from: 'persons',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: personLightQuery,
      as: 'relatedPersons',
    },
  },
  {
    $lookup: {
      from: 'prices',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: priceLightQuery,
      as: 'relatedPrices',
    },
  },
  {
    $lookup: {
      from: 'projects',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: projectLightQuery,
      as: 'relatedProjects',
    },
  },
  {
    $lookup: {
      from: 'structures',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: structureLightQuery,
      as: 'relatedStructures',
    },
  },
  { $set: { relatedObject: { $concatArrays: [
    '$relatedStructures',
    '$relatedProjects',
    '$relatedPrices',
    '$relatedPersons',
    '$relatedTerms',
    '$relatedCategories',
  ] } } },
  { $set: { relatedObject: { $arrayElemAt: ['$relatedObject', 0] } } },
];

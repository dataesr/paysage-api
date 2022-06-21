import structureLightQuery from './structures.light.query';
import personLightQuery from './persons.light.query';
import categoryLightQuery from './categories.light.query';
import termsLightQuery from './terms.light.query';
import priceLightQuery from './prices.light.query';
import projectLightQuery from './projects.light.query';

export default [
  {
    $lookup: {
      from: 'categories',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: categoryLightQuery,
      as: 'relatedCategories',
    },
  },
  {
    $lookup: {
      from: 'terms',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: termsLightQuery,
      as: 'relatedTerms',
    },
  },
  {
    $lookup: {
      from: 'persons',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: personLightQuery,
      as: 'relatedPersons',
    },
  },
  {
    $lookup: {
      from: 'prices',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: priceLightQuery,
      as: 'relatedPrices',
    },
  },
  {
    $lookup: {
      from: 'projects',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: projectLightQuery,
      as: 'relatedProjects',
    },
  },
  {
    $lookup: {
      from: 'structures',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: structureLightQuery,
      as: 'relatedStructures',
    },
  },
];

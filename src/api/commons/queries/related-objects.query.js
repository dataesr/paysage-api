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
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: categoryLightQuery,
      as: 'relatedCategories',
    },
  },
  { $addFields: { 'relatedCategories.type': 'category' } },
  {
    $lookup: {
      from: 'terms',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: termsLightQuery,
      as: 'relatedTerms',
    },
  },
  { $addFields: { 'relatedTerms.type': 'term' } },
  {
    $lookup: {
      from: 'persons',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: personLightQuery,
      as: 'relatedPersons',
    },
  },
  { $addFields: { 'relatedPersons.type': 'person' } },
  {
    $lookup: {
      from: 'prices',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: priceLightQuery,
      as: 'relatedPrices',
    },
  },
  { $addFields: { 'relatedPrices.type': 'price' } },
  {
    $lookup: {
      from: 'projects',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: projectLightQuery,
      as: 'relatedProjects',
    },
  },
  { $addFields: { 'relatedProjects.type': 'project' } },
  {
    $lookup: {
      from: 'structures',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: structureLightQuery,
      as: 'relatedStructures',
    },
  },
  { $addFields: { 'relatedStructures.type': 'structure' } },
  {
    $set: {
      relatedObjects: {
        $concatArrays: [
          '$relatedStructures',
          '$relatedProjects',
          '$relatedPrices',
          '$relatedPersons',
          '$relatedTerms',
          '$relatedCategories',
        ],
      },
    },
  },
];

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
  { $addFields: { 'relatedCategories.type': 'category' } },
  {
    $lookup: {
      from: 'terms',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: termsLightQuery,
      as: 'relatedTerms',
    },
  },
  { $addFields: { 'relatedTerms.type': 'term' } },
  {
    $lookup: {
      from: 'persons',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: personLightQuery,
      as: 'relatedPersons',
    },
  },
  { $addFields: { 'relatedPersons.type': 'person' } },
  {
    $lookup: {
      from: 'prices',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: priceLightQuery,
      as: 'relatedPrices',
    },
  },
  { $addFields: { 'relatedPrices.type': 'price' } },
  {
    $lookup: {
      from: 'projects',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: projectLightQuery,
      as: 'relatedProjects',
    },
  },
  { $addFields: { 'relatedProjects.type': 'project' } },
  {
    $lookup: {
      from: 'structures',
      localField: 'relatedObjectId',
      foreignField: 'id',
      pipeline: structureLightQuery,
      as: 'relatedStructures',
    },
  },
  { $addFields: { 'relatedStructures.type': 'structure' } },
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

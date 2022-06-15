import metas from '../commons/pipelines/metas';
import { lightQuery as structureLightQuery } from '../structures/root/root.queries';

const relatedElementsPipeline = [
  {
    $lookup: {
      from: 'categories',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            id: 1,
            usualNameFr: 1,
            usualNameEn: { $ifNull: ['$usualNameEn', null] },
            descriptionFr: { $ifNull: ['$descriptionFr', null] },
            descriptionEn: { $ifNull: ['$descriptionEn', null] },
          },
        },
      ],
      as: 'relatedCategories',
    },
  },
  {
    $lookup: {
      from: 'terms',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            id: 1,
            usualNameFr: 1,
            usualNameEn: { $ifNull: ['$usualNameEn', null] },
            descriptionFr: { $ifNull: ['$descriptionFr', null] },
            descriptionEn: { $ifNull: ['$descriptionEn', null] },
          },
        },
      ],
      as: 'relatedTerms',
    },
  },
  {
    $lookup: {
      from: 'persons',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            id: 1,
            firstName: { $ifNull: ['$firstName', null] },
            lastName: 1,
            gender: { $ifNull: ['$gender', null] },
            birthDate: { $ifNull: ['$birthDate', null] },
            deathDate: { $ifNull: ['$deathDate', null] },
            activity: { $ifNull: ['$activity', null] },
          },
        },
      ],
      as: 'relatedPersons',
    },
  },
  {
    $lookup: {
      from: 'prices',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            id: 1,
            nameFr: 1,
            nameEn: { $ifNull: ['$nameEn', null] },
          },
        },
      ],
      as: 'relatedPrices',
    },
  },
  {
    $lookup: {
      from: 'projects',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            id: 1,
            nameFr: 1,
            nameEn: { $ifNull: ['$nameEn', null] },
          },
        },
      ],
      as: 'relatedProjects',
    },
  },
  {
    $lookup: {
      from: 'structures',
      localField: 'relatesTo',
      foreignField: 'id',
      pipeline: [
        ...structureLightQuery,
      ],
      as: 'relatedStructures',
    },
  },
];

const model = {
  _id: 0,
  id: 1,
  createdBy: 1,
  updatedBy: 1,
  createdAt: 1,
  updatedAt: 1,
  nature: 1,
  type: 1,
  textNumber: { $ifNull: ['$textNumber', null] },
  title: 1,
  pageUrl: 1,
  boesrId: { $ifNull: ['$boesrId', null] },
  joId: { $ifNull: ['$joId', null] },
  publicationDate: { $ifNull: ['$publicationDate', null] },
  signatureDate: { $ifNull: ['$signatureDate', null] },
  startDate: { $ifNull: ['$startDate', null] },
  previsionalEndDate: { $ifNull: ['$previsionalEndDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
  textExtract: { $ifNull: ['$textExtract', null] },
  comment: { $ifNull: ['$comment', null] },
  relatedStructures: 1,
  relatedCategories: 1,
  relatedPersons: 1,
  relatedPrices: 1,
  relatedProjects: 1,
  relatedTerms: 1,
};

const readQuery = [
  ...metas, ...relatedElementsPipeline, { $project: model },
];

export { readQuery };

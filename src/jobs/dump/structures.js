import { db } from "../../services/mongo.service";

import currentCategoryQuery from "../../api/commons/queries/current-category.query";
import currentEmailsQuery from "../../api/commons/queries/current-emails.query";
import currentIdentifiersQuery from "../../api/commons/queries/current-identifiers.query";
import currentLegalCategoryQuery from "../../api/commons/queries/current-legal-category.query";
import currentLocalisationQuery from "../../api/commons/queries/current-localisation.query";
import currentNameQuery from "../../api/commons/queries/current-name.query";
import currentWebsitesQuery from "../../api/commons/queries/current-websites.query";
import currentSocialsQuery from "../../api/commons/queries/current-socials.query";
import relationTypesLightQuery from '../../api/commons/queries/relation-types.light.query';
import categoryLightQuery from '../../api/commons/queries/categories.light.query';
import legalCategoryLightQuery from '../../api/commons/queries/legal-categories.light.query';
import personLightQuery from '../../api/commons/queries/persons.light.query';
import prizeLightQuery from '../../api/commons/queries/prizes.light.query';
import structuresDumpQuery from '../../api/commons/queries/structures.dump.query';
import supervisingMinistersLightQuery from '../../api/commons/queries/supervising-ministers.light.query';
import termsLightQuery from '../../api/commons/queries/terms.light.query';

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
        from: 'structures',
        localField,
        foreignField: 'id',
        pipeline: structuresDumpQuery,
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

const relationTypeQuery = [
  {
    $lookup: {
      from: 'relationtypes',
      localField: 'relationTypeId',
      foreignField: 'id',
      pipeline: relationTypesLightQuery,
      as: 'relationType',
    },
  },
  { $set: { relationType: { $arrayElemAt: ['$relationType', 0] } } },
]
const relationGroupQuery = [
  {
    $lookup: {
      from: 'relationgroups',
      localField: 'relationsGroupId',
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            id: 1,
            resourceId: 1,
            name: 1,
            accepts: 1,
            priority: 1,
          },
        },
      ],
      as: 'relationGroup',
    },
  },
  { $set: { relationGroup: { $arrayElemAt: ['$relationGroup', 0] } } },
]

const projection = {
  _id: 0,
  id: 1,
  resourceId: 1,
  relatedObjectId: 1,
  relationGroup: { $ifNull: ['$relationGroup', null] },
  relationType: { $ifNull: ['$relationType', { priority: 99 }] },
  relationTag: { $ifNull: ['$relationTag', null] },
  startDate: { $ifNull: ['$startDate', null] },
  endDate: { $ifNull: ['$endDate', null] },
  endDatePrevisional: { $ifNull: ['$endDatePrevisional', null] },
  mandatePosition: { $ifNull: ['$mandatePosition', null] },
  mandateReason: { $ifNull: ['$mandateReason', null] },
  mandateEmail: { $ifNull: ['$mandateEmail', null] },
  personalEmail: { $ifNull: ['$personalEmail', null] },
  mandatePhonenumber: { $ifNull: ['$mandatePhonenumber', null] },
  mandateTemporary: { $ifNull: ['$mandateTemporary', null] },
  mandatePrecision: { $ifNull: ['$mandatePrecision', null] },
  laureatePrecision: { $ifNull: ['$laureatePrecision', null] },
  active: { $ifNull: ['$active', null] },
}

const relationRelatedQuery = [
  ...relatedObjectLookup,
  ...relationTypeQuery,
  ...relationGroupQuery,
  {
    $project: {...projection, relatedObject: 1 },
  },
];

const relationResourceQuery = [
  ...resourceLookup,
  ...relationTypeQuery,
  ...relationGroupQuery,
  {
    $project: {...projection, resource: 1 },
  },
];



const structureDumpQuery =  [
  ...currentCategoryQuery,
  ...currentEmailsQuery,
  ...currentIdentifiersQuery,
  ...currentLegalCategoryQuery,
  ...currentLocalisationQuery,
  ...currentNameQuery,
  ...currentSocialsQuery,
  ...currentWebsitesQuery,
  {
    $lookup: {
      from: 'relationships',
      localField: 'id',
      foreignField: 'resourceId',
      pipeline: [...relationRelatedQuery],
      as: 'rel1'
    }
  },
  {
    $lookup: {
      from: 'relationships',
      localField: 'id',
      foreignField: 'relatedObjectId',
      pipeline: [...relationResourceQuery],
      as: 'rel2'
    }
  },
  {
    $set: {
      relations: {
        $concatArrays: ['$rel1', '$rel2']
      }
    }
  },
  {
    $project: {
      _id: 0,
      id: 1,
      object: 'structures',
      status: { $ifNull: ['$structureStatus', null] },
      displayName: '$currentName.usualName',
      currentName: { $ifNull: ['$currentName', {}] },
      descriptionEn: { $ifNull: ['$descriptionEn', null] },
      descriptionFr: { $ifNull: ['$descriptionFr', null] },
      currentLocalisation: { $ifNull: ['$currentLocalisation', {}] },
      localisations: 1,
      category: { $ifNull: ['$category', {}] },
      legalcategory: { $ifNull: ['$legalcategory', {}] },
      identifiers: { $ifNull: ['$identifiers', []] },
      relations: { $ifNull: ['$relations', []] },
      socialmedias: { $ifNull: ['$socialmedias', []] },
      categories: { $ifNull: ['$categories', []] },
      closureDate: { $ifNull: ['$closureDate', null] },
      createdAt: 1,
      creationDate: { $ifNull: ['$creationDate', null] },
      emails: { $ifNull: ['$emails', []] },
      websites: { $ifNull: ['$websites', []] },
      dumpedAt: new Date()
    },
  },
  {
    $out: 'structures-dump',
  },
];


export default async function createStructuresDump() {
  console.log('--------------------------------------');
  console.log('Creating structures dump...');
  console.log('--------------------------------------');
  try {
    const res = await db.collection('structures').aggregate(structureDumpQuery, { allowDiskUse: true }).toArray();
    console.log('--------------------------------------');
    console.log('Structures dump created successfully', res);
    console.log('--------------------------------------');
    return {status: 'success', data: res};
  } catch (error) {
    console.log('--------------------------------------');
    console.log('--------------------------------------');
    console.log('--------------------------------------');
    console.error('Error creating structures dump:', error);
    console.log('--------------------------------------');
    console.log('--------------------------------------');
    console.log('--------------------------------------');
    throw error;
  }
}

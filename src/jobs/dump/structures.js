import { db } from "../../services/mongo.service";

import currentCategoryQuery from "../../api/commons/queries/current-category.query";
import currentEmailsQuery from "../../api/commons/queries/current-emails.query";
import currentIdentifiersQuery from "../../api/commons/queries/current-identifiers.query";
import currentLegalCategoryQuery from "../../api/commons/queries/current-legal-category.query";
import currentLocalisationQuery from "../../api/commons/queries/current-localisation.query";
import currentNameQuery from "../../api/commons/queries/current-name.query";
import currentWebsitesQuery from "../../api/commons/queries/current-websites.query";
import currentSocialsQuery from "../../api/commons/queries/current-socials.query";
import relationsQuery from "../../api/commons/queries/relations.query";


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
      pipeline: [...relationsQuery],
      as: 'rel1'
    }
  },
  {
    $lookup: {
      from: 'relationships',
      localField: 'id',
      foreignField: 'relatedObjectId',
      pipeline: [...relationsQuery],
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

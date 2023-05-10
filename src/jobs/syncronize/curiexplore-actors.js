import structuresLightQuery from '../../api/commons/queries/structures.light.query';
import { db } from '../../services/mongo.service';

export default async function syncronizeCuriexploreActors(job) {
  const curie = await db.collection('relationships')
    .find({ relationTag: 'categorie-parent', relatedObjectId: 'qC5q7' })
    .toArray();

  const curixploreCategories = curie.map((rel) => rel.resourceId);
  let result = "La syncronisation s'est terminée avec succès";
  await db.collection('relationships').aggregate([
    { $match: { relationTag: 'structure-categorie', relatedObjectId: { $in: curixploreCategories } } },
    {
      $group: {
        _id: '$resourceId',
        curieCategories: { $push: '$relatedObjectId' },
      },
    },
    {
      $lookup: {
        from: 'structures',
        localField: '_id',
        foreignField: 'id',
        pipeline: structuresLightQuery,
        as: 'structure',
      },
    },
    { $set: { structure: { $arrayElemAt: ['$structure', 0] } } },
    { $replaceRoot: { newRoot: { $mergeObjects: ['$$ROOT', '$structure'] } } },
    { $set: { iso3: '$currentLocalisation.iso3' } },
    { $project: { structure: 0, _id: 0 } },
    { $out: 'curiexploreactors' },
  ]).toArray().catch((e) => {
    job.fail(`La syncronisation a échouée: ${e.message}`);
    result = null;
  });
  return result;
}

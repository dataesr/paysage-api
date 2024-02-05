import { client, db } from '../../services/mongo.service';

const dataset = 'fr-esr-paysage_prix';

export default async function exportFrEsrPrizes() {
  const json = await db.collection('prizes').aggregate([
    {
      $lookup: {
        from: 'relationships',
        let: { prizeId: '$id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$resourceId', '$$prizeId'] },
                  { $eq: ['$relationTag', 'prix-porteur'] },
                ],
              },
            },
          },
        ],
        as: 'relationshipData',
      },
    },
    {
      $project: {
        dataset,
        id_paysage: '$id',
        nameFr: '$nameFr',
        nameEn: '$nameEn',
        descriptionFr: '$descriptionFr',
        descriptionEn: '$descriptionEn',
        relatedObjectId: {
          $ifNull: [{ $arrayElemAt: ['$relationshipData.relatedObjectId', 0] }, null],
        },
      },
    },
    {
      $match: {
        id_paysage: { $exists: true },
      },
    },
  ]).toArray();

  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('opendata').deleteMany({ dataset });
    await db.collection('opendata').insertMany(json);
    await session.endSession();
  });

  return { status: 'success', location: `/opendata/${dataset}` };
}

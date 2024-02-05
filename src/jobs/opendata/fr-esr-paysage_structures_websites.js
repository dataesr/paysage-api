import structuresLightQuery from '../../api/commons/queries/structures.light.query';
import { client, db } from '../../services/mongo.service';

const dataset = 'fr-esr-paysage_structures_websites';

export default async function exportFrEsrStructureWebsites() {
  const data = await db.collection('weblinks').aggregate([
    {
      $lookup: {
        from: 'structures',
        localField: 'resourceId',
        foreignField: 'id',
        pipeline: structuresLightQuery,
        as: 'structure',
      },
    },
    { $set: { structure: { $arrayElemAt: ['$structure', 0] } } },
  ]).toArray();
  const json = data.map(({ structure, ...websites }) => {
    if (!structure || !structure.id || !websites || !websites.id) {
      return null;
    }
    const row = {
      dataset,
      url: websites.url,
      internal_id: websites.id,
      id_structure_paysage: structure.id,
      type: websites.type,
      language: websites.language,
    };
    return row;
  }).filter((row) => row !== null);

  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('opendata').deleteMany({ dataset });
    await db.collection('opendata').insertMany(json);
    await session.endSession();
  });

  return { status: 'success', location: `/opendata/${dataset}` };
}

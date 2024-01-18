import structuresLightQuery from '../../api/commons/queries/structures.light.query';
import { client, db } from '../../services/mongo.service';

const dataset = 'fr-esr-paysage_structures_identifiants';

export default async function exportFrEsrStructureIdentifiers() {
  const data = await db.collection('identifiers').aggregate([
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
  const json = data.map(({ structure, ...identifier }) => {
    if (!structure || !structure.id || !identifier || !identifier.id) {
      return null;
    }

    const row = {
      dataset,
      id: identifier.value,
      internal_id: identifier.id,
      id_structure_paysage: structure.id,
      id_type: identifier.type,
      active: identifier.active,
      id_startDate: identifier.startDate,
      id_endDate: identifier.endDate,
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

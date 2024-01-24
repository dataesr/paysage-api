import personsLightQuery from '../../api/commons/queries/persons.light.query';
import { client, db } from '../../services/mongo.service';

const dataset = 'fr-esr-paysage_personnes_identifiants';

export default async function exportFrEsrPersonIdentifiers() {
  const data = await db.collection('identifiers').aggregate([
    {
      $lookup: {
        from: 'persons',
        localField: 'resourceId',
        foreignField: 'id',
        pipeline: personsLightQuery,
        as: 'person',
      },
    },
    { $set: { person: { $arrayElemAt: ['$person', 0] } } },
  ]).toArray();
  const json = data.map(({ person, ...identifier }) => {
    if (!person || !person.id || !identifier || !identifier.id) {
      return null;
    }

    const row = {
      dataset,
      id: identifier.value,
      internal_id: identifier.id,
      id_person_paysage: person.id,
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

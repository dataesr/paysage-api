import { db } from '../../services/mongo.service';
import relationsQuery from '../../api/commons/queries/relations.query';

export default async function synchronizeAnnuaireCollection(job) {
  await db.collection('relationships')
    .aggregate([
      { $match: { relationTag: 'gouvernance' } },
      ...relationsQuery,
      { $set: { endDate: { $ifNull: ['$endDate', null] } } },
      { $out: 'annuaire' },
    ]).toArray().catch((e) => {
      job.fail(`La synchronisation a échoué: ${e.message}`);
      return null;
    });
  return { ok: 1 };
}

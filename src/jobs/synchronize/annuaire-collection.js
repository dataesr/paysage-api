import { db } from '../../services/mongo.service';
import relationsQuery from '../../api/commons/queries/relations.query';


export default async function synchronizeAnnuaireCollection(job) {
  await db.collection('relationships')
    .aggregate([
      { $match: { relationTag: 'gouvernance' } },
      ...relationsQuery,
      { $set: { endDate: { $ifNull: ['$endDate', null] } } },
      // { $set: { isActive: { $ifNull: ['$active', false] } } },
      // { $set: { isActive: { $or: [{ $eq: ['$sActive', true] }, { $eq: ['$endDate', null] }, { $gte: ['$endDate', new Date().toISOString().split('T')[0]] }] } } },
      // { $set: { forthcomming: { $gte: ['$startDate', new Date().toISOString().split('T')[0]] } } },
      // { $set: { status: { $cond: [{ $eq: ['$forthcomming', true] }, 'forthcomming', { $cond: [{ $eq: ['$isActive', false] }, 'inactive', 'current'] }] } } },
      // {
      //   $project: {
      //     _id: 0,
      //     isActive: 0,
      //   },
      // },
      { $out: 'annuaire' },
    ]).toArray().catch((e) => {
      job.fail(`La synchronisation a échouée: ${e.message}`);
      return null;
    });
  return { ok: 1 }
}

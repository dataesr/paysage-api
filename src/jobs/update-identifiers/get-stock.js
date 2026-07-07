import { db } from '../../services/mongo.service';

export async function getIdentifierStockFromPaysage({ checkedBefore } = {}) {
  const suggestionsColl = db.collection('_identifier_updates_structures');

  const recentlyChecked = checkedBefore
    ? await suggestionsColl.distinct('paysage', {
      lastChecked: { $gte: new Date(checkedBefore) },
    })
    : [];

  return db.collection('identifiers').aggregate([
    {
      $match: {
        type: { $in: ['wikidata', 'idref', 'ror'] },
        active: { $ne: false },
        ...(recentlyChecked.length && {
          resourceId: { $nin: recentlyChecked },
        }),
      },
    },
    {
      $lookup: {
        from: 'structures',
        localField: 'resourceId',
        foreignField: 'id',
        as: '_structure',
      },
    },
    {
      $match: {
        '_structure.0': { $exists: true },
      },
    },
    {
      $unset: '_structure',
    },
    {
      $group: {
        _id: '$resourceId',
        identifiers: {
          $push: { type: '$type', value: '$value' },
        },
      },
    },
    {
      $project: {
        _id: 0,
        paysage: '$_id',
        identifiers: 1,
      },
    },
  ]).toArray();
}

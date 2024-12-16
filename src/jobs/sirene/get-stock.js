import { db } from '../../services/mongo.service';

export async function getSiretStockFromPaysage() {
  const sirets = db.collection('identifiers').aggregate([
    {
      $match: {
        type: 'siret',
        active: {
          $ne: false,
        },
      },
    },
    {
      $addFields: {
        siren: { $substr: ['$value', 0, 9] },
        siret: '$value',
      },
    },
    {
      $group: {
        _id: '$siren',
        sirenCount: { $sum: 1 },
        docs: {
          $push: {
            paysage: '$resourceId',
            siret: '$value',
            siren: '$siren',
          },
        },
      },
    },
    {
      $unwind: '$docs',
    },
    {
      $project: {
        _id: 0,
        paysage: '$docs.paysage',
        siret: '$docs.siret',
        siren: '$docs.siren',
        type: {
          $cond: [{ $eq: ['$sirenCount', 1] }, 'siren', 'siret'],
        },
        sirenCount: 1,
      },
    },
  ]);

  return sirets.toArray();
}

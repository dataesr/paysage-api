import { db } from "./mongo.js";

export async function getSiretStockFromPaysage() {
  const sirets = db.collection("identifiers").aggregate([
    {
      $match: {
        type: "siret",
        active: {
          $ne: false,
        },
      },
    },
    {
      $project: {
        siren: { $substr: ["$value", 0, 9] },
        siret: "$value",
        paysage: "$resourceId",
      },
    },
    {
      $group: {
        _id: "$siren",
        sirenCount: { $sum: 1 },
        docs: { $push: "$$ROOT" },
      },
    },
    {
      $unwind: "$docs",
    },
    {
      $project: {
        _id: 0,
        paysage: "$docs.paysage",
        siret: "$docs.siret",
        siren: "$docs.siren",
        type: {
          $cond: [{ $eq: ["$sirenCount", 1] }, "siren", "siret"],
        },
        sirenCount: 1,
      },
    },
  ]);

  return sirets.toArray();
}

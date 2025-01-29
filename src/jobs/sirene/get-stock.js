import { db } from "../../services/mongo.service";

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
        siren: "$docs.siren",
        siret: {
          $cond: [{ $eq: ["$sirenCount", 1] }, null, "$docs.siret"],
        },
        type: {
          $cond: [{ $eq: ["$sirenCount", 1] }, "legalUnit", "establishment"],
        },
      },
    },
  ]);

  return sirets.toArray();
}

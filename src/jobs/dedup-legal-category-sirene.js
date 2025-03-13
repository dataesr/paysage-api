import { db } from '../services/mongo.service';

const pipeline = [
  {
    $match: {
      type: "siret",
      active: {
        $ne: false
      }
    }
  },
  {
    $project: {
      siren: { $substr: ["$value", 0, 9] },
      siret: "$value",
      paysage: "$resourceId"
    }
  },
  {
    $group: {
      _id: "$siren",
      count: { $sum: 1 },
      docs: { $push: "$$ROOT" }
    }
  },
  {
    $unwind: "$docs"
  },
  { $match: { count: { $gt: 1 } } },
  {
    $project: {
      _id: 0,
      paysage: "$docs.paysage",
      siren: "$docs.siren",
      siret: "$docs.siret"
    }
  },
  {
    $lookup: {
      from: "relationships",
      let: { paysageId: "$paysage" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$resourceId", "$$paysageId"]
            },
            relatedObjectId: {
              $in: [
                "3ectR3ectR3ectR",
                "K6Q23K6Q23K6Q23"
              ]
            }
          }
        },
        { $limit: 1 }
      ],
      as: "hasNolegalCategoryCheck"
    }
  },
  {
    $project: {
      _id: 0,
      paysage: 1,
      siren: 1,
      siret: 1,
      count: 1,
      hasLc: {
        $cond: [
          {
            $eq: [
              {
                $size: "$hasNolegalCategoryCheck"
              },
              0
            ]
          },
          true,
          false
        ]
      }
    }
  },
  {
    $group: {
      _id: "$siren",
      count: { $sum: 1 },
      roots: { $push: "$$ROOT" },
      isDup: { $push: "$hasLc" },
      paysages: { $push: "$paysage" }
    }
  },
  {
    $addFields: {
      dup: {
        $filter: {
          input: "$roots",
          as: "item",
          cond: { $eq: ["$$item.hasLc", true] }
        }
      }
    }
  },
  {
    $addFields: {
      dupSize: { $size: "$dup" },
      paysages: "$dup.paysage"
    }
  },
  { $match: { dupSize: { $gt: 1 } } },
  {
    $project: {
      siren: "$_id",
      paysagesWithLC: "$paysages",
      _id: 0
    }
  },
  {
    $out: "_deduped_legal_category_sirene"
  }
]

export default async function dedupLegalCategorySirene() {
  await db.collection('identifiers').aggregate(pipeline).toArray();
  return "ok";
}

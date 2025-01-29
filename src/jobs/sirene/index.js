import config from "../../config";
import { db } from "../../services/mongo.service";
import { fetchLegalUnitUpdates, fetchEstablishmentUpdates, fetchLegalUnitById, fetchEstablishmentById } from "./api";
import { getEstablishmentChanges, getLegalUnitChanges } from "./get-changes";
import { getSiretStockFromPaysage } from "./get-stock";

const { taskName } = config.sirene;

async function getLastExecutionDate() {
  const filters = {
    name: taskName,
    "result.status": "success",
    data: null, // ensure the job has not been called with custom dates
  };

  const jobs = await db
    .collection("_jobs")
    .find(filters)
    .sort({ "result.lastExecution": -1 })
    .toArray();

  return jobs?.[0]?.result?.lastExecution?.toISOString()?.slice(0, 19);
}

export default async function monitorSiren(job) {
  const now = new Date();
  const from = await getLastExecutionDate();
  const until = now.toISOString().slice(0, 19);

  if (!from) {
    return {
      status: "failed",
      message: "No previous execution"
    };
  }

  const siretStockFromPaysage = await getSiretStockFromPaysage();
  const siretUpdatesMap = await fetchEstablishmentUpdates(from, until);
  const sirenUpdatesMap = await fetchLegalUnitUpdates(from, until);


  const hasLegalUnitUpdates = siretStockFromPaysage
    .filter(element => element.type === "siren" && sirenUpdatesMap.has(element.siren))

  const hasEstablishmentUpdates = siretStockFromPaysage
    .filter(element => element.type === "siret" && siretUpdatesMap.has(element.siret))

  const updates = []
  for (const element of hasLegalUnitUpdates) {
    const changes = await getLegalUnitChanges(element);
    updates.push(...changes);
  };
  for (const element of hasEstablishmentUpdates) {
    const changes = await getEstablishmentChanges(element);
    updates.push(...changes);
  }

  if (updates.length === 0) {
    return {
      status: "success",
      message: "Nothing to update",
      lastExecution: now,
      from,
      until,
    };
  }

  const bulkOperations = updates.map(update => ({
    updateOne: {
      filter: { ...update },
      update: {
        $setOnInsert: {
          ...update,
          status: "pending",
          createdAt: now
        },
        $set: {
          lastChecked: now,
        }
      },
      upsert: true
    }
  }));

  try {
    const result = await db.collection("siren_updates").bulkWrite(bulkOperations);

    return {
      status: "success",
      lastExecution: now,
      from,
      until,
      updates: {
        modified: result.modifiedCount,
        inserted: result.upsertedCount
      }
    };
  } catch (error) {
    console.error('Bulk write error:', error);
    return {
      status: "failed",
      message: error.message,
      lastExecution: now,
      from,
      until
    };
  }
}

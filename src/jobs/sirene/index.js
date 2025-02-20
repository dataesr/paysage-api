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
    .limit(1)
    .toArray();

  return jobs?.[0]?.result?.lastExecution?.toISOString()?.slice(0, 19);
}

function makeBulk(updates) {
  return updates.map(update => ({
    updateOne: {
      filter: { ...update },
      update: {
        $setOnInsert: {
          ...update,
          status: "pending",
          createdAt: new Date()
        },
        $set: {
          lastChecked: new Date(),
        }
      },
      upsert: true
    }
  }));
}

export async function monitorSiren(job) {
  const now = new Date();
  const from = await getLastExecutionDate();
  const until = now.toISOString().slice(0, 19);
  let res = null

  if (!from) {
    job.fail("No previous execution");
    return res;
  }

  const siretStockFromPaysage = await getSiretStockFromPaysage();
  const sirenUpdatesMap = await fetchLegalUnitUpdates(from, until);


  const hasLegalUnitUpdates = siretStockFromPaysage
    .filter(element => element.type === "legalUnit" && sirenUpdatesMap.has(element.siren))


  const updates = []
  for (const element of hasLegalUnitUpdates) {
    const changes = await getLegalUnitChanges(element);
    updates.push(...changes);
  };
  if (updates.length === 0) {
    res = {
      status: "success",
      message: "Nothing to update",
      lastExecution: now,
      from,
      until,
    };
  } else {
    const bulkOperations = makeBulk(updates);

    const result = await db.collection("_sirene_updates").bulkWrite(bulkOperations).catch((error) => {
      console.error('Bulk write error:', error.message);
      job.fail(error)
      return null;
    })
    res = {
      status: "success",
      lastExecution: now,
      from,
      until,
      updates: {
        modified: result?.modifiedCount,
        inserted: result?.upsertedCount
      }
    };
  }
  return res;
}

export async function monitorSiret(job) {
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

  const hasEstablishmentUpdates = siretStockFromPaysage
    .filter(element => element.type === "establishment")

  const updates = []
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

  const bulkOperations = makeBulk(updates);

  const result = await db.collection("_sirene_updates").bulkWrite(bulkOperations).catch((error) => {
    console.error('Bulk write error:', error);
    job.fail(error.message)
  })
  return {
    status: "success",
    lastExecution: now,
    from,
    until,
    updates: {
      modified: result?.modifiedCount,
      inserted: result?.upsertedCount
    }
  };
}

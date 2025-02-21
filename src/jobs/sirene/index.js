import config from "../../config";
import { db } from "../../services/mongo.service";
import { fetchEstablishmentUpdates, fetchLegalUnitUpdates } from "./api";
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

const processBulkWrite = async (bulkOperations) => {
  try {
    return await db.collection("_sirene_updates").bulkWrite(bulkOperations, { ordered: false });
  } catch (error) {
    console.error('Bulk write error:', error);
    throw error;
  }
};

const validateDateRange = (from, until) => {
  if (!from) throw new Error("No previous execution");
  if (!from || !until) throw new Error("Invalid date range");
  if (new Date(from) >= new Date(until)) {
    throw new Error("'from' date must be before 'until' date");
  }
};

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

async function monitorSirene(type) {

  if (!type) throw new Error("Type missing");
  if (type !== 'establishment' && type !== 'legalUnit') throw new Error("Invalid type");

  const fetchUpdateFunction = type === 'establishment' ? fetchEstablishmentUpdates : fetchLegalUnitUpdates;
  const getChanges = type === 'establishment' ? getEstablishmentChanges : getLegalUnitChanges;

  try {
    const now = new Date();
    const from = await getLastExecutionDate();
    const until = now.toISOString().slice(0, 19);

    validateDateRange(from, until);

    const [siretStockFromPaysage, sirenUpdatesMap] = await Promise.all([
      getSiretStockFromPaysage(),
      fetchUpdateFunction(from, until)
    ]);

    const legalUnitsToUpdate = siretStockFromPaysage
      .filter(element =>
        element.type === type &&
        element.siren &&
        sirenUpdatesMap.has(element.siren)
      );

    const updates = []
    for (const element of legalUnitsToUpdate) {
      const changes = await getChanges(element);
      updates.push(...changes);
    };
    if (!updates.length) {
      return {
        status: "success",
        message: "Nothing to update",
        lastExecution: now,
        from,
        until,
      };
    }
    const bulkOperations = makeBulk(updates);
    const result = await processBulkWrite(bulkOperations);

    return {
      status: "success",
      lastExecution: now,
      from,
      until,
      updates: {
        modified: result?.modifiedCount || 0,
        inserted: result?.upsertedCount || 0,
        total: updates.length
      }
    };
  } catch (error) {
    console.error(`${type} -- Monitoring failed:`, error);
    throw error;
  }
}

export async function monitorSiren() {
  return monitorSirene('legalUnit');
}
export async function monitorSiret() {
  return monitorSirene('establishment');
}

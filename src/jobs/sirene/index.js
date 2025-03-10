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

const processBulkOps = async (bulkOperations) => {
  try {
    return await db.collection("_sirene_updates").bulkWrite(bulkOperations, { ordered: false });
  } catch (error) {
    console.error('Bulk write error:', error);
    throw error;
  }
};

const validateDateRange = (from, until) => {
  if (!from) throw new Error("No previous execution");
  if (!until) throw new Error("Invalid date range");
  if (new Date(from) >= new Date(until)) {
    throw new Error("'from' date must be before 'until' date");
  }
};

function createBulkOps(updates) {
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

const configFromType = {
  establishment: {
    fetchUpdateFunction: fetchEstablishmentUpdates,
    getChanges: getEstablishmentChanges,
    filterKey: 'siret'
  },
  legalUnit: {
    fetchUpdateFunction: fetchLegalUnitUpdates,
    getChanges: getLegalUnitChanges,
    filterKey: 'siren'
  }
}

async function monitorSirene(type) {

  if (!type) throw new Error("Type missing");
  if (type !== 'establishment' && type !== 'legalUnit') throw new Error("Invalid type");

  const { fetchUpdateFunction, getChanges, filterKey } = configFromType[type];

  try {
    const now = new Date();
    const from = await getLastExecutionDate();
    const until = now.toISOString().slice(0, 19);

    validateDateRange(from, until);

    const [stockFromPaysage, sireneUpdatesMap] = await Promise.all([
      getSiretStockFromPaysage(),
      fetchUpdateFunction(from, until)
    ]);

    const toUpdate = stockFromPaysage
      .filter(element =>
        element.type === type &&
        sireneUpdatesMap.has(element?.[filterKey])
      );

    const updates = []
    for (const element of toUpdate) {
      const changes = await getChanges(element);
      updates.push(...changes);
    }
    if (!updates.length) {
      return {
        status: "success",
        message: "Nothing to update",
        lastExecution: now,
        from,
        until,
      };
    }
    const bulkOperations = createBulkOps(updates);
    const result = await processBulkOps(bulkOperations);

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

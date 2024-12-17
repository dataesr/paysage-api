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

async function getLegalCategoryPaysageDocs(inseeCode) {
  return db.collection("legalcategories").findOne({ inseeCode });
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


  const hasUpdates = siretStockFromPaysage
    .filter(element => {
      const hasSiretUpdate = siretUpdatesMap.has(element.siret);
      const hasSirenUpdate = element.type === "siren" && sirenUpdatesMap.has(element.siren);
      return hasSiretUpdate || hasSirenUpdate;
    })

  const updates = []
  for (const element of hasUpdates) {
    const siretData = await fetchEstablishmentById(element.siret);
    const sirenData = await fetchLegalUnitById(element.siren);
    const legalUnitChanges = getLegalUnitChanges(sirenData);
    const establishmentChanges = getEstablishmentChanges(siretData);
    const allChanges = [...legalUnitChanges, ...establishmentChanges]
      .map(change => ({ ...element, ...change }));
    updates.push(...allChanges);
  };

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
      filter: {
        siren: update.siren,
        paysage: update.paysage,
        siret: update.siret,
        type: update.type,
        field: update.field,
        value: update.value,
        changeEffectiveDate: update.changeEffectiveDate
      },
      update: {
        $set: {
          ...update,
          lastChecked: now
        }
      },
      upsert: true
    }
  }));

  try {
    const result = await db.collection("_siren").bulkWrite(bulkOperations);

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

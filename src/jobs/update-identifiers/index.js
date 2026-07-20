import config from '../../config';
import { db } from '../../services/mongo.service';
import { getAllMissingIdentifiers } from './get-changes';
import { getIdentifierStockFromPaysage } from './get-stock';

const { taskName } = config.identifiers;

async function getLastExecutionDate() {
  const filters = {
    name: taskName,
    'result.status': 'success',
    data: null,
  };

  const jobs = await db
    .collection('_jobs')
    .find(filters)
    .sort({ 'result.lastExecution': -1 })
    .limit(1)
    .toArray();

  return jobs?.[0]?.result?.lastExecution;
}

const processBulkOps = async (bulkOperations) => {
  try {
    return await db
      .collection('_identifier_updates_structures')
      .bulkWrite(bulkOperations, { ordered: false });
  } catch (error) {
    console.error('Bulk write error:', error);
    throw error;
  }
};

function createBulkOps(suggestions) {
  return suggestions.map((suggestion) => ({
    updateOne: {
      filter: {
        paysage: suggestion.paysage,
        type: suggestion.type,
        value: suggestion.value,
        sourceType: suggestion.sourceType,
        sourceValue: suggestion.sourceValue,
      },
      update: {
        $setOnInsert: {
          ...suggestion,
          status: 'pending',
          createdAt: new Date(),
        },
        $set: {
          lastChecked: new Date(),
        },
      },
      upsert: true,
    },
  }));
}

const CHUNK_SIZE = 200;

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function monitorStructuresIdentifiers() {
  const now = new Date();

  try {
    const lastExecution = await getLastExecutionDate();
    const stock = await getIdentifierStockFromPaysage({ checkedBefore: lastExecution });

    console.log(`Stock loaded: ${stock.length} structures with known identifiers`);

    const chunks = chunkArray(stock, CHUNK_SIZE);
    let totalModified = 0;
    let totalInserted = 0;
    let totalSuggestions = 0;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1}/${chunks.length} (${chunk.length} structures)...`);

      // eslint-disable-next-line no-await-in-loop
      const suggestions = await getAllMissingIdentifiers(chunk);

      if (suggestions.length) {
        const bulkOperations = createBulkOps(suggestions);
        // eslint-disable-next-line no-await-in-loop
        const result = await processBulkOps(bulkOperations);
        totalModified += result?.modifiedCount ?? 0;
        totalInserted += result?.upsertedCount ?? 0;
        totalSuggestions += suggestions.length;
      }
    }

    if (!totalSuggestions) {
      return {
        status: 'success',
        message: 'No new identifier suggestions',
        lastExecution: now,
        processed: stock.length,
      };
    }

    return {
      status: 'success',
      lastExecution: now,
      processed: stock.length,
      suggestions: {
        modified: totalModified,
        inserted: totalInserted,
        total: totalSuggestions,
      },
    };
  } catch (error) {
    console.error('Identifier monitoring failed:', error);
    throw error;
  }
}

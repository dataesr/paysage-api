/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import logger from '../../services/logger.service';
import { client, db } from '../../services/mongo.service';
import datasets from './datasets';

async function downloadDataset(datasetId) {
  const url = `https://data.enseignementsup-recherche.gouv.fr/explore/dataset/${datasetId}/download/?format=json`;
  const options = { headers: { Authorization: `Apikey ${process.env.ODS_API_KEY}` } };
  const response = await fetch(url, options);
  response.data = await response.json();
  return response;
}

function extractKeyNumbers({ paysageIdFields, name }, data) {
  if (!data || !data.length) return [];
  return data
    .flatMap((item) => {
      const paysageIds = paysageIdFields.map((field) => item.fields?.[field]).flatMap((id) => id?.split(','));
      return paysageIds.map((paysageId) => ({
        ...item.fields,
        id: item.recordid,
        dataset: name,
        resourceId: paysageId,
        updatedAt: new Date()
      }));
    });
}
function extractStructuresUpdateOperations(dataset, data) {
  if (!data || !data.length) return [];
  if (!dataset.field) return [];
  const sortField = (dataset?.sortField[0] === '-') ? dataset?.sortField.slice(1) : dataset?.sortField;
  const uniqueStructures = [];
  const operations = data?.length && data
    .filter((item) => item?.fields?.[sortField])
    .sort((a, b) => ((dataset?.sortField?.[0] === '-')
      ? ((b.fields[sortField] > a.fields[sortField]) ? 1 : ((a.fields[sortField] > b.fields[sortField]) ? -1 : 0))
      : ((a.fields[sortField] > b.fields[sortField]) ? 1 : ((b.fields[sortField] > a.fields[sortField]) ? -1 : 0))))
    .filter((item) => {
      if (!uniqueStructures.includes(item.fields[dataset.paysageIdFields])) {
        uniqueStructures.push(item.fields[dataset.paysageIdFields]);
        return item;
      }
      return false;
    })
    .map((item) => {
      const set = {};
      if (dataset?.field && item && item?.fields?.[dataset.field]) {
        set[dataset.fieldName] = item.fields[dataset.field];
      }
      if (dataset?.sortField && item && item?.fields?.[sortField]) {
        set[dataset.sortFieldName] = item.fields[sortField];
      }
      if (dataset?.extraField && item && item?.fields?.[dataset?.extraField]) {
        set[dataset.extraField] = item.fields[dataset.extraField];
      }
      if (Object.keys(set).length > 0) {
        return {
          updateOne: {
            filter: { id: { $eq: item.fields[dataset.paysageIdFields] } },
            update: { $set: set },
          },
        };
      }
      return {};
    });
  return operations;
}

export default async function updateKeyNumbers(job) {
  const results = [];
  for (const dataset of datasets) {
    try {
      const { data } = await downloadDataset(dataset.id);
      const keyNumbers = extractKeyNumbers(dataset, data);
      const operationsStructures = extractStructuresUpdateOperations(dataset, data);
      const session = client.startSession();
      await session.withTransaction(async () => {
        if (keyNumbers?.length) {
          logger.info(`Updating dataset ${dataset.name} with ${keyNumbers.length} key numbers operations`);
          await db.collection('keynumbers').deleteMany({ dataset: dataset.name });
          await db.collection('keynumbers').insertMany(keyNumbers);
          logger.info(`Dataset ${dataset.name} updated`);
        }
        if (operationsStructures?.length) {
          await db.collection('structures').bulkWrite(operationsStructures, { ordered: false });
        }
        await session.endSession();
      });
      results.push({ datasetName: dataset.name, datasetId: dataset.id, status: 'success' });
    } catch (e) {
      results.push({ datasetName: dataset.name, datasetId: dataset.id, status: 'failed', error: e.message });
    }
  }
  if (results.find((result) => result.status === 'failed')) {
    const failures = results.filter((result) => result.status === 'failed').map((result) => result.datasetName).join(', ');
    job.fail(`Dataset update failed: ${failures}. Check job results for more details`);
    await job.save();
  }
  return results;
}

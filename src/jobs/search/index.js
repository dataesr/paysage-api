import config from '../../config';
import esClient from '../../services/elastic.service';
import { db } from '../../services/mongo.service';

const { index } = config.elastic;

async function reindexDocuments(type) {
  const { default: query } = await import(`./src/api/commons/queries/${type}.elastic.js`);
  const documents = db.collection(type.replace('-', '')).aggregate(query).toArray();
  const documentCount = documents.length;
  if (documentCount === 0) return { type, status: 'aborted', documentCount };
  const bulkBody = documents.reduce((acc, doc) => (
    [...acc, { update: { _index: index, id: doc.id } }, { doc: { ...doc, type }, doc_as_upsert: true }]
  ), []);
  const bulkResponse = await esClient.bulk({ refresh: true, bulkBody });
  if (!bulkResponse.errors) return { type, status: 'success', documentCount, indexedCount: documentCount };
  const errors = bulkResponse?.items.map((item) => item.update).filter((item) => item.error);
  return { type, status: 'success', documentCount, indexedCount: documentCount - errors.lenth, errors };
}

export default async function reindex(job) {
  const { types } = job.attrs.data;
  const reindexations = types.map((type) => reindexDocuments(type).catch(() => ({ type, status: 'error' })));
  const results = await Promise.all(reindexations);
  return results;
}

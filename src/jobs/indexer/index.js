import config from '../../config';
import esClient from '../../services/elastic.service';
import { db } from '../../services/mongo.service';

const { index } = config.elastic;

const TYPES = [
  'categories',
  'geographical-categories',
  'legal-categories',
  'official-texts',
  'persons',
  'prizes',
  'projects',
  'structures',
  'terms',
  'users',
];

async function reindexDocumentsByType(type, _indexer) {
  const { default: query } = await import(`../../api/commons/queries/${type}.elastic.js`);
  const documents = await db.collection(type.replace('-', '')).aggregate(query).toArray();
  const documentCount = documents.length;
  if (documentCount === 0) return { type, status: 'aborted', reason: 'No document to index.' };

  // Update all documents of <type> coming from mongo with their respective ids
  const body = documents.flatMap((doc) => [
    { update: { _index: index, _id: doc.id } }, { doc: { ...doc, type, _indexer }, doc_as_upsert: true },
  ]);
  const bulkResponse = await esClient.bulk({ refresh: true, body });

  // Delete all documents of <type> that where not in the previously updated documents
  // It ensures that for this <type> the number of indexed documents is the same as
  // the number of documents in the mongo database
  const { body: deleteBody } = await esClient.deleteByQuery({
    index,
    body: { query: { bool: { filter: [{ term: { 'type.keyword': type } }], must_not: [{ match: { _indexer } }] } } },
    refresh: true,
  });
  const { deleted } = deleteBody;
  if (!bulkResponse.errors) return { type, status: 'success', documentCount, indexedCount: documentCount, deleted };
  const errors = bulkResponse?.items.map((item) => item.update).filter((item) => item.error);
  return { type, status: 'success', documentCount, indexedCount: documentCount - errors.length, errors, deleted };
}

export default async function reindex(job) {
  const jobId = job.attrs._id.toString();
  const reindexations = TYPES.map(async (type) => reindexDocumentsByType(type, jobId).catch((e) => ({ type, status: 'error', error: e })));
  const results = await Promise.all(reindexations);
  return results;
}

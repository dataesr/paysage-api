import db from './services/mongo.service';
import elastic from './services/elastic.service';
import logger from './services/logger.service';
import config from './config/app.config';
import categories from './api/categories/root/root.resource';
import structures from './api/structures/root/root.resource';

const { index: paysageIndex } = config.elastic;

const mapping = {
  properties: {
    // type: { type: 'text' },
    // name: { type: 'text' },
    suggest: {
      type: 'completion',
      contexts: [
        {
          name: 'type',
          type: 'category',
          path: 'type',
        },
      ],
    },
  },
};

class Indexer {
  constructor(mongo, elasticsearch, index) {
    this._mongo = mongo;
    this._elastic = elasticsearch;
    this._index = index;
    this._elastic.indices.exists({ index }).then((res) => {
      if (!res.body) {
        this._elastic.indices.create({ index })
          .catch((err) => {
            logger.error(err);
            process.exit(1);
          });
        this._elastic.indices.putMapping({ index, body: mapping });
      }
    });
    logger.info('Indexers ready');
  }

  use = async (resource) => {
    const changeStream = this._mongo.collection('_events').watch(
      [{ $match: { 'fullDocument.collection': resource.repository.collectionName } }],
    );
    changeStream.on('change', async (next) => {
      const { id } = next.fullDocument;
      const { op, doc } = await resource.repository.index(id);
      switch (op) {
        case 'index':
          elastic.update({ index: this._index, id, body: { doc, doc_as_upsert: true } })
            .catch((e) => { logger.error(`error occured: ${e}`); });
          break;
        case 'desindex':
          elastic.delete({ index: this._index, id })
            .catch((e) => { logger.error(`error occured: ${e}`); });
          break;
        default:
          logger.info('Unknown action');
          break;
      }
    });
  };
}
export default function createIndexers() {
  const indexer = new Indexer(db, elastic, paysageIndex);
  indexer.use(categories);
  indexer.use(structures);
}

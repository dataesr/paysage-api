import db from '../../../services/mongo.service';
import elastic from '../../../services/elastic.service';
import logger from '../../../services/logger.service';
import config from '../../../config/app.config';

const { index } = config.elastic;

export default class Indexer {
  constructor({ repository, pipeline }) {
    this._pipeline = pipeline;
    this._repository = repository;
    this._changeStream = null;
  }

  start = async () => {
    this._changeStream = db.collection('_events').watch(this._pipeline);
    this._changeStream.on('change', async (next) => {
      const doc = this._repository.get(next.id, { useQuery: 'indexQuery' });
      await elastic.update({ index, id: doc.id, body: { doc, doc_as_upsert: true } }).catch((error) => {
        logger.error(error);
      });
    });
  };

  stop = async () => {
    this._changeStream.close();
  };
}

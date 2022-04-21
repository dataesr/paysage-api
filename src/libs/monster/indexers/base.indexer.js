import config from '../../../config/app.config';
import logger from '../../../services/logger.service';
import elastic from '../../../services/elastic.service';

const { index } = config.elastic;

class Indexer {
  constructor(resource) {
    this._repository = resource.repository;
  }

  index = async (id) => {
    const op = !await this._repository.get(id) ? 'index' : 'remove';
    const doc = await this._repository.get(id, { useQuery: 'indexQuery' });
    switch (op) {
      case 'index':
        elastic.update({ index, id, body: { doc, doc_as_upsert: true } })
          .catch((e) => { logger.error(`IndexingError: ${e}`); });
        break;
      case 'remove':
        elastic.delete({ index, id })
          .catch((e) => { logger.error(`IndexingError: ${e}`); });
        break;
      default:
        logger.error('IndexingError: Unknown operation');
        break;
    }
  };
}

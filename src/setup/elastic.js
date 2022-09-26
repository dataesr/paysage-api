import 'dotenv/config';

import config from '../config';
import esClient from '../services/elastic.service';
import logger from '../services/logger.service';

const { index } = config.elastic;

const body = {
  mappings: {
    properties: {
      search: {
        type: 'text',
        analyzer: 'autocomplete',
      },
    },
  },
  settings: {
    number_of_shards: 1,
    analysis: {
      filter: {
        autocomplete_filter: {
          type: 'edge_ngram',
          min_gram: 1,
          max_gram: 20,
        },
      },
      analyzer: {
        autocomplete: {
          type: 'custom',
          tokenizer: 'standard',
          filter: [
            'lowercase',
            'autocomplete_filter',
          ],
        },
      },
    },
  },
};

async function setupElasticIndices() {
  const exists = await esClient.indices.exists({ index });
  if (!exists.body) {
    await esClient.indices.create({ index, body });
  }
  logger.info('Elasticsearch setup successfull');
  process.exit(0);
}

setupElasticIndices().catch((e) => {
  logger.error({ ...e, message: 'Elasticsearch setup failed' });
  process.exit(1);
});

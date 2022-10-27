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
      name: {
        type: 'text',
        analyzer: 'light',
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
        french_elision: {
          type: 'elision',
          articles: [
            'l',
            'm',
            't',
            'qu',
            'n',
            's',
            'j',
            'd',
            'c',
            'jusqu',
            'quoiqu',
            'lorsqu',
            'puisqu',
          ],
          articles_case: true,
        },
      },
      analyzer: {
        autocomplete: {
          filter: [
            'lowercase',
            'french_elision',
            'icu_folding',
            'autocomplete_filter',
          ],
          tokenizer: 'icu_tokenizer',
          type: 'custom',
        },
        light: {
          filter: [
            'lowercase',
            'french_elision',
            'icu_folding',
          ],
          tokenizer: 'icu_tokenizer',
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
  logger.info('Elasticsearch setup successful');
  process.exit(0);
}

setupElasticIndices().catch((e) => {
  logger.error({ ...e, message: 'Elasticsearch setup failed' });
  process.exit(1);
});

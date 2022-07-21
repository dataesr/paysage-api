import 'dotenv/config';

import config from '../config';
import esClient from '../services/elastic.service';
import logger from '../services/logger.service';

const { index } = config.elastic;

const body = {
  mappings: {
    properties: {
      content: {
        type: 'text',
        analyzer: 'name_analyzer',
      },
      id: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword',
            ignore_above: 256,
          },
        },
      },
      query: {
        type: 'percolator',
      },
    },
  },
  settings: {
    analysis: {
      filter: {
        french_elision: {
          type: 'elision',
          articles: ['l', 'm', 't', 'qu', 'n', 's', 'j', 'd', 'c', 'jusqu', 'quoiqu', 'lorsqu', 'puisqu'],
          articles_case: true,
        },
      },
      analyzer: {
        name_analyzer: {
          filter: ['lowercase', 'french_elision', 'icu_folding'],
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
  logger.info('Elasticsearch setup successfull');
  process.exit(0);
}

setupElasticIndices().catch((e) => {
  logger.error({ ...e, message: 'Elasticsearch setup failed' });
  process.exit(1);
});

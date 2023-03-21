import 'dotenv/config';

import config from '../config';
import esClient from '../services/elastic.service';
import logger from '../services/logger.service';

const { index } = config.elastic;

const body = {
  mappings: {
    properties: {
      coordinates: {
        type: 'geo_point',
      },
      locality: {
        type: 'text',
      },
      name: {
        type: 'text',
      },
      nameEn: {
        type: 'text',
      },
      otherNames: {
        type: 'text',
      },
      shortName: {
        type: 'text',
      },
    },
  },
  settings: {
    number_of_shards: 1,
    analysis: {
      filter: {
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
        default: {
          filter: [
            'lowercase',
            'french_elision',
            'icu_folding',
          ],
          tokenizer: 'icu_tokenizer',
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
    logger.info('Elasticsearch index creation');
    await esClient.indices.create({ index, body });
  }
  logger.info('Elasticsearch setup successful');
  process.exit(0);
}

setupElasticIndices().catch((e) => {
  logger.error({ ...e, message: 'Elasticsearch setup failed' });
  process.exit(1);
});

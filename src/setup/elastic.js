// NOT IN USE FOR NOW
import 'dotenv/config';

import config from '../config';
import elastic from '../services/elastic.service';
import logger from '../services/logger.service';

const { index } = config.elastic;

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

async function setupElasticIndicies() {
  const exists = await elastic.indices.exists({ index });
  if (!exists.body) {
    await elastic.indices.create({ index });
    await elastic.indices.putMapping({ index, body: mapping });
  }
  logger.info('Elasticsearch setup successfull');
  process.exit(0);
}

setupElasticIndicies().catch((e) => {
  logger.error({ ...e, message: 'Elasticsearch setup failed' });
  process.exit(1);
});

// NOT IN USE FOR NOW
import 'dotenv/config';
import logger from '../services/logger.service';
import elastic from '../services/elastic.service';
import config from '../config';

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
  logger.info('elasticsearch setup successfull');
  process.exit(0);
}

setupElasticIndicies().catch((e) => {
  e.message = 'elasticsearch setup failed';
  logger.error(e);
  process.exit(1);
});

import elastic from '../services/elastic.service';
import config from './app.config';

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

export default async function setupElasticIndicies() {
  const exists = await elastic.indices.exists({ index });
  if (!exists.body) {
    await elastic.indices.create({ index });
    await elastic.indices.putMapping({ index, body: mapping });
  }
}

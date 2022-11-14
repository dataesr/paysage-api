// NODE_ENV=development ES_NODE=http://localhost:9200 MONGO_URI=mongodb://mongodb:27017 node es-init.js

import config from './src/config.js';
import esClient from './src/services/elastic.service.js';

const { index } = config.elastic;

const data = [{
  acronym: 'UK',
  isDeleted: false,
  name: 'Université de Kerivach',
  search: 'Université de Kerivach UK',
  type: 'structures',
}];

// Delete all documents
await esClient.deleteByQuery({
  index,
  body: {
    query: {
      match_all: {},
    },
  },
  refresh: true,
});

await Promise.all(data.map((body) => esClient.index({
  index,
  body,
  refresh: true,
})));

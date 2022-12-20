import 'dotenv/config';

import config from './src/config';
import esClient from './src/services/elastic.service';
import { client, db } from './src/services/mongo.service';

const { index } = config.elastic;
const allowedTypes = ['categories', 'legal-categories', 'official-texts', 'persons', 'prizes', 'projects', 'structures', 'terms', 'users'];

const load = async (paysageObject) => {
  const { default: query } = await import(`./src/api/commons/queries/${paysageObject}.elastic.js`);
  // Collect all Paysage objects from Mongo
  const body = [];
  const objects = db.collection(paysageObject.replace('-', '')).aggregate(query);
  await objects.forEach((object) => {
    body.push({ index: { _index: index } });
    body.push({ ...object, isDeleted: object?.isDeleted || false, type: paysageObject });
  });
  console.log(`${body.length / 2} ${paysageObject} indexed`);

  // Delete all documents in ES
  await esClient.deleteByQuery({
    index,
    body: {
      query: {
        match: {
          type: paysageObject,
        },
      },
    },
    refresh: true,
  });

  // Index all Paysage objects in ES
  if (body.length) {
    const bulkResponse = await esClient.bulk({ refresh: true, body });
    if (bulkResponse.body.errors) {
      const erroredDocuments = [];
      bulkResponse.body.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            operation: body[i * 2],
            document: body[i * 2 + 1],
          });
        }
      });
      console.log(erroredDocuments);
    }
  }
};

if (process.argv.length === 2) {
  await Promise.all(allowedTypes.map((type) => load(type)));
} else if (process.argv.length === 3) {
  const type = process.argv[2];
  if (allowedTypes.includes(type)) {
    await load(type);
  } else {
    console.error(`${type} n'est pas un type autorisé, merci de choisir parmi ${allowedTypes.join(', ')}.`);
  }
} else {
  console.error('Utilisation incorrecte : `node es-init.js [TYPE]`');
}
client.close();

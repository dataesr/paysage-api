import 'dotenv/config';

import logger from '../services/logger.service';
import mongo from '../services/mongo.service';

const { client, db } = mongo;

async function setupDatabase() {
  await db.collection('categories').createIndex({ id: 1 }, { unique: true });
  await db.collection('documents').createIndex({ id: 1 }, { unique: true });
  await db.collection('legalcategories').createIndex({ id: 1 }, { unique: true });
  await db.collection('news').createIndex({ id: 1 }, { unique: true });
  await db.collection('officialdocuments').createIndex({ id: 1 }, { unique: true });
  await db.collection('persons').createIndex({ id: 1 }, { unique: true });
  await db.collection('prices').createIndex({ id: 1 }, { unique: true });
  await db.collection('strctures').createIndex({ id: 1 }, { unique: true });
  await db.collection('terms').createIndex({ id: 1 }, { unique: true });
  logger.info('Mongodb setup successfull');
  if (client) client.close();
  logger.info('Mongodb connexion closed');
  process.exit(0);
}

setupDatabase().catch((e) => {
  logger.error({ ...e, message: 'Mongodb setup failed' });
  process.exit(1);
});

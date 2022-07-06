import 'dotenv/config';

import logger from '../services/logger.service';
import { client, db } from '../services/mongo.service';

async function setupDatabase() {
  await db.collection('categories').createIndex({ id: 1 }, { unique: true });
  await db.collection('documents').createIndex({ id: 1 }, { unique: true });
  await db.collection('documenttypes').createIndex({ id: 1 }, { unique: true });
  await db.collection('emails').createIndex({ id: 1 }, { unique: true });
  await db.collection('emailtypes').createIndex({ id: 1 }, { unique: true });
  await db.collection('identifiers').createIndex({ id: 1 }, { unique: true });
  await db.collection('legalcategories').createIndex({ id: 1 }, { unique: true });
  await db.collection('officialtexts').createIndex({ id: 1 }, { unique: true });
  await db.collection('persons').createIndex({ id: 1 }, { unique: true });
  await db.collection('prices').createIndex({ id: 1 }, { unique: true });
  await db.collection('projects').createIndex({ id: 1 }, { unique: true });
  await db.collection('relationships').createIndex({ id: 1 }, { unique: true });
  await db.collection('socialmedias').createIndex({ id: 1 }, { unique: true });
  await db.collection('structures').createIndex({ id: 1 }, { unique: true });
  await db.collection('supervisingministers').createIndex({ id: 1 }, { unique: true });
  await db.collection('terms').createIndex({ id: 1 }, { unique: true });
  await db.collection('weblinks').createIndex({ id: 1 }, { unique: true });
  logger.info('Mongodb setup successfull');
  if (client) {
    await client.close();
  }
  logger.info('Mongodb connexion closed');
  process.exit(0);
}

setupDatabase().catch((e) => {
  logger.error({ ...e, message: 'Mongodb setup failed' });
  process.exit(1);
});

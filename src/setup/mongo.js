import 'dotenv/config';

import logger from '../services/logger.service';
import { client, db } from '../services/mongo.service';

async function setupMongo() {
  await db.collection('categories').createIndex({ id: 1 }, { unique: true });
  await db.collection('documents').createIndex({ id: 1 }, { unique: true });
  await db.collection('documenttypes').createIndex({ id: 1 }, { unique: true });
  await db.collection('emails').createIndex({ id: 1 }, { unique: true });
  await db.collection('emailtypes').createIndex({ id: 1 }, { unique: true });
  await db.collection('identifiers').createIndex({ id: 1 }, { unique: true });
  await db.collection('keynumbers').createIndex({ dataset: 1, resourceId: 1 });
  await db.collection('legalcategories').createIndex({ id: 1 }, { unique: true });
  await db.collection('officialtexts').createIndex({ id: 1 }, { unique: true });
  await db.collection('persons').createIndex({ id: 1 }, { unique: true });
  await db.collection('prices').createIndex({ id: 1 }, { unique: true });
  await db.collection('projects').createIndex({ id: 1 }, { unique: true });
  await db.collection('relationships').createIndex({ id: 1 }, { unique: true });
  await db.collection('relationships').createIndex({ resourceId: 1 });
  await db.collection('relationships').createIndex({ resourceId: 1, relationTag: 1 });
  await db.collection('relationships').createIndex({ relatedObjectId: 1 });
  await db.collection('relationships').createIndex({ relatedObjectId: 1, relationTag: 1 });
  await db.collection('socialmedias').createIndex({ id: 1 }, { unique: true });
  await db.collection('structures').createIndex({ id: 1 }, { unique: true });
  await db.collection('supervisingministers').createIndex({ id: 1 }, { unique: true });
  await db.collection('terms').createIndex({ id: 1 }, { unique: true });
  await db.collection('tokens').createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('tokens').createIndex({ token: 1, userAgent: 1 });
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ id: 1 }, { unique: true });
  await db.collection('groups').createIndex({ id: 1 }, { unique: true });
  await db.collection('groupmembers').createIndex({ userId: 1, groupId: 1 }, { unique: true });
  await db.collection('weblinks').createIndex({ id: 1 }, { unique: true });
  logger.info('Mongodb setup successful');
  if (client) {
    await client.close();
  }
  logger.info('Mongodb connexion closed');
  process.exit(0);
}

setupMongo().catch((e) => {
  logger.error({ ...e, message: 'Mongodb setup failed' });
  process.exit(1);
});

import 'dotenv/config';

import logger from '../services/logger.service';
import { client, db } from '../services/mongo.service';

async function setupMongo() {
  await db.collection('categories').createIndex({ id: 1 }, { unique: true });
  await db.collection('contact').createIndex({ id: 1 }, { unique: true });
  await db.collection('documents').createIndex({ id: 1 }, { unique: true });
  await db.collection('documents').createIndex({ relatesTo: 1 });
  await db.collection('documenttypes').createIndex({ id: 1 }, { unique: true });
  await db.collection('emails').createIndex({ id: 1 }, { unique: true });
  await db.collection('emails').createIndex({ resourceId: 1 });
  await db.collection('emailtypes').createIndex({ id: 1 }, { unique: true });
  await db.collection('followups').createIndex({ id: 1 }, { unique: true });
  await db.collection('followups').createIndex({ relatesTo: 1 });
  await db.collection('groups').createIndex({ id: 1 }, { unique: true });
  await db.collection('groupmembers').createIndex({ userId: 1, groupId: 1 }, { unique: true });
  await db.collection('groupmembers').createIndex({ userId: 1 });
  await db.collection('identifiers').createIndex({ id: 1 }, { unique: true });
  await db.collection('identifiers').createIndex({ resourceId: 1 });
  await db.collection('identifiers').createIndex({ resourceId: 1, type: 1 });
  await db.collection('keynumbers').createIndex({ dataset: 1, resourceId: 1 });
  await db.collection('keynumbers').createIndex({ dataset: 1, resourceId: 1, annee: 1 }, { sparse: true });
  await db.collection('keynumbers').createIndex({ dataset: 1, resourceId: 1, rentree: 1 }, { sparse: true });
  await db.collection('legalcategories').createIndex({ id: 1 }, { unique: true });
  await db.collection('officialtexts').createIndex({ id: 1 }, { unique: true });
  await db.collection('officialtexts').createIndex({ relatesTo: 1 });
  await db.collection('persons').createIndex({ id: 1 }, { unique: true });
  await db.collection('press').createIndex({ id: 1 }, { unique: true });
  await db.collection('press').createIndex({ alertId: 1 }, { unique: true });
  await db.collection('press').createIndex({ relatesTo: 1 });
  await db.collection('press').createIndex({ matchedWith: 1 });
  await db.collection('press').createIndex({ excluded: 1 });
  await db.collection('prices').createIndex({ id: 1 }, { unique: true });
  await db.collection('projects').createIndex({ id: 1 }, { unique: true });
  await db.collection('relationships').createIndex({ id: 1 }, { unique: true });
  await db.collection('relationships').createIndex({ resourceId: 1 });
  await db.collection('relationships').createIndex({ resourceId: 1, relationTag: 1 });
  await db.collection('relationships').createIndex({ relatedObjectId: 1 });
  await db.collection('relationships').createIndex({ relatedObjectId: 1, relationTag: 1 });
  await db.collection('relationships').createIndex({ otherAssociatedObjectIds: 1, relationTag: 1 });
  await db.collection('relationships').createIndex({ relationsGroupId: 1 });
  await db.collection('relationtypes').createIndex({ id: 1 }, { unique: true });
  await db.collection('relationtypes').createIndex({ for: 1 });
  await db.collection('socialmedias').createIndex({ id: 1 }, { unique: true });
  await db.collection('socialmedias').createIndex({ resourceId: 1 });
  await db.collection('structures').createIndex({ id: 1 }, { unique: true });
  await db.collection('supervisingministers').createIndex({ id: 1 }, { unique: true });
  await db.collection('terms').createIndex({ id: 1 }, { unique: true });
  await db.collection('tokens').createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('tokens').createIndex({ token: 1, userAgent: 1 });
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ id: 1 }, { unique: true });
  await db.collection('weblinks').createIndex({ id: 1 }, { unique: true });
  await db.collection('weblinks').createIndex({ resourceId: 1 });
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

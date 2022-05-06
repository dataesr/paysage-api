import 'dotenv/config';
import db, { client } from '../services/mongo.service';
import logger from '../services/logger.service';

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
  logger.info('mongodb setup successfull');
  if (client) client.close();
  logger.info('mongodb connexion closed');
  process.exit(0);
}

setupDatabase().catch((e) => {
  e.message = 'mongodb setup failed';
  logger.error(e);
  process.exit(1);
});

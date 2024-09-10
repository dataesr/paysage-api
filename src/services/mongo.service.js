import { MongoClient } from 'mongodb';

import config from '../config';
import logger from './logger.service';

const { mongoDbName, mongoUri } = config.mongo;

const client = new MongoClient(mongoUri, { directConnection: process.env.NODE_ENV === 'testing' });

logger.info(`Try to connect to mongo... ${mongoUri}`);
await client.connect().catch((e) => {
  logger.info(`Connexion to mongo instance failed... Terminating... ${e.message}`);
  process.kill(process.pid, 'SIGTERM');
});

logger.info(`Connected to mongo database... ${mongoDbName}`);
const db = client.db(mongoDbName);

const clearDB = async (_db, exclude = []) => {
  const collections = await _db.listCollections().toArray();
  const excludeAll = [...exclude, 'system.views'];
  const collectionsToDelete = collections.filter((collection) => (!(excludeAll.includes(collection.name))));
  return Promise.all(collectionsToDelete.map((collection) => _db.collection(collection.name).drop()));
};

export { clearDB, client, db };

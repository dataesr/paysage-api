import mongodb from 'mongodb';

import config from '../config';
import logger from './logger.service';

const { mongoUri, mongoDbName } = config.database;

const client = new mongodb.MongoClient(
  mongoUri,
  { useNewUrlParser: true, useUnifiedTopology: true },
);

logger.info(`Try to connect to mongo... ${mongoUri}`);
client
  .connect()
  .then(() => {
    logger.info(`Connected to mongo database... ${mongoDbName}`);
  })
  .catch((e) => {
    logger.info(`Connexion to mongo instance failed... Terminating... ${e.message}`);
    process.kill(process.pid, 'SIGTERM');
  });

const db = client.db(mongoDbName);

const clearDB = async (_db, exclude = []) => {
  const collections = await _db.listCollections().toArray();
  const excludeAll = [...exclude, 'system.views'];
  const collectionsToDelete = collections.filter((collection) => (!(excludeAll.includes(collection.name))));
  return Promise.all(collectionsToDelete.map((collection) => _db.collection(collection.name).drop()));
};

export { client, clearDB };
export default db;

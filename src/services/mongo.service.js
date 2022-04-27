import mongodb from 'mongodb';
import logger from './logger.service';
import config from '../config/app.config';

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
const mongoUtils = {
  async clear(exclude) {
    const collections = await db.listCollections().toArray();
    const collectionsToDelete = collections.filter((collection) => (!(exclude.includes(collection.name))));
    await Promise.all(collectionsToDelete.map(async (collection) => {
      await db.collection(collection.name).drop();
    }));
  },
};
export { client, mongoUtils };
export default db;

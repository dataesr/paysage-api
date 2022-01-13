import mongodb from 'mongodb';
import logger from './logger.service';
import config from '../../../config/app.config';

const { mongoUri, mongoDbName } = config.database;

const client = new mongodb.MongoClient(
  mongoUri,
  { useNewUrlParser: true, useUnifiedTopology: true },
);
logger.info(`Try to connect to mongo... ${mongoUri}`);

client.connect().catch((e) => {
  logger.info(`Connexion to mongo instance failed... Terminating... ${e.message}`);
  process.kill(process.pid, 'SIGTERM');
});

const db = client.db(mongoDbName);
logger.info(`Connected to mongo database... ${mongoDbName}`);

export { client };
export default db;

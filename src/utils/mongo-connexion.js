import mongodb from 'mongodb';
import logger from './logger';
import configs from '../config';

const { MONGO_URI, MONGO_DBNAME } = configs[process.env.NODE_ENV].database;

const client = new mongodb.MongoClient(
  MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
);
logger.info(`Try to connect to mongo... ${MONGO_URI}`);

client.connect().catch((e) => {
  logger.info(`Connexion to mongo instance failed... Terminating... ${e.message}`);
  process.kill(process.pid, 'SIGTERM');
});

const connexion = client.db(MONGO_DBNAME);
logger.info(`Connected to mongo database... ${MONGO_DBNAME}`);

export default connexion;

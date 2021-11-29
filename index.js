import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app';
import setupDatabase from './src/config/database.config';
import logger from './src/modules/commons/services/logger.service';
// import setupDatabase from './src/database-setup';
import registerEventListeners from './src/listeners';
import config from './src/config';

const { MONGO_URI } = config.database;

async function createServer() {
  await setupDatabase();
  app.listen(3000, () => logger.info('Lancement du serveur ok - 3000'));
const PORT = 5500;

function createServer() {
  // await setupDatabase();
  registerEventListeners();

  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (error) => {
    logger.info(`Connexion to Mongodb ${error}`);
  });

  const { connection } = mongoose;
  connection.once('open', () => {
    logger.info(`MongoDB connection established to ${MONGO_URI}`);
  });

  app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
}

createServer();

import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app';
// import setupDatabase from './src/database-setup';
import logger from './src/logger';
import registerEventListeners from './src/listeners';
import config from './src/config';

const { MONGO_URI } = config.database;

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

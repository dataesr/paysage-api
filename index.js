import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app';
// import setupDatabase from './src/config/database.config';
import logger from './src/modules/commons/services/logger.service';
import config from './src/config/app.config';

const { MONGO_URI } = config.database;

async function createServer() {
  // await setupDatabase();
  const PORT = 5500;

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

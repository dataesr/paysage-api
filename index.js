import 'dotenv/config';
import app from './src/app';
import setupDatabase from './src/config/database.config';
import logger from './src/modules/commons/services/logger.service';

async function createServer() {
  await setupDatabase();
  app.listen(3000, () => logger.info('Lancement du serveur ok - 3000'));
}

createServer();

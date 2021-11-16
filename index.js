import 'dotenv/config';
import app from './src/app';
import setupDatabase from './src/database-setup';
import logger from './src/logger';
import registerEventListeners from './src/listeners';

async function createServer() {
  await setupDatabase();
  registerEventListeners();
  app.listen(3000, () => logger.info('Lancement du serveur ok - 3000'));
}

createServer();

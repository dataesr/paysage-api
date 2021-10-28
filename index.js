import 'dotenv/config';
import app from './src/app';
import setupDatabase from './src/database-setup';
import logger from './src/logger';

async function createServer() {
  await setupDatabase();
  app.listen(3000, () => logger.info('Lancement du serveur ok - 3000'));
}

createServer();

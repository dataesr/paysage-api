import 'dotenv/config';
import app from './src/app';
import setupDatabase from './src/database-setup';
import logger from './src/logger';
import registerEventListeners from './src/listeners';

const PORT = 5500;

async function createServer() {
  await setupDatabase();
  registerEventListeners();
  app.listen(PORT, () => logger.info(`Lancement du serveur sur le port ${PORT}`));
}

createServer();

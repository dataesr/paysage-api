import 'dotenv/config';
import app from './src/app';
import { client } from './src/services/mongo.service';
import logger from './src/services/logger.service';
import setupDatabase from './src/config/database.config';
import setupAppContainer from './src/config/storage.config';

const PORT = process.env.PORT || 3000;

async function createServer() {
  await setupDatabase().catch((e) => {
    logger.error(e);
    process.kill(process.pid, 'SIGTERM');
  });
  await setupAppContainer().catch((e) => {
    logger.error(e);
    process.kill(process.pid, 'SIGTERM');
  });
  logger.info('setupDatabase successful');
  logger.info('setupAppContainer successful');

  app.listen(PORT, () => {
    logger.info(`Server started! docs at http://localhost:${PORT}/docs/api`);
    app.isReady = true;
  });
}

function cleanup() {
  logger.info('SIGTERM signal received: closing HTTP server');
  app.isReady = false;
  // app.close(() => {
  //   logger.info('HTTP server stopped');
  // });
  client.close(() => {
    logger.info('Mongo connexion closed');
  });
  process.exit(1);
}
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

createServer();

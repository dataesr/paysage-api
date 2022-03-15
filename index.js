import 'dotenv/config';
import app from './src/app';
import { client } from './src/services/mongo.service';
import logger from './src/services/logger.service';
import setupDatabase from './src/config/database.config';
import setupAppContainer from './src/config/storage.config';
import createIndexers from './src/indexer';

let httpServer;

function cleanup() {
  logger.info('SIGTERM signal received: closing HTTP server');
  app.isReady = false;
  httpServer.close(() => {
    logger.info('HTTP server stopped');
  });
  client.close(() => {
    logger.info('Mongo connexion closed');
  });
  process.exit(1);
}
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

async function createServer(port) {
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

  httpServer = app.listen(port, () => {
    logger.info(`Server started! docs at http://localhost:${port}/docs/api`);
    app.isReady = true;
  });
}

switch (process.env.ENTRYPOINT) {
  case 'api':
    createServer(process.env.PORT || 3000);
    break;
  case 'indexers':
    createIndexers();
    break;
  default:
    logger.info("'entrypoint' must be one of 'api', 'indexer'");
    process.exit(1);
}

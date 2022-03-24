import app from './app';
import db, { client } from '../services/mongo.service';
import swift from '../services/storage.service';
import logger from '../services/logger.service';
import setupDatabase from '../config/database.config';
import setupAppContainer from '../config/storage.config';

let httpServer;

function cleanup() {
  app.isReady = false;
  logger.info('SIGTERM/SIGINT signal received');
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

export default async function createAPIServer(port) {
  await setupDatabase(db)
    .then(() => logger.info('setupDatabase successful'))
    .catch((e) => {
      e.message = 'setupDatabase failed';
      logger.error(e);
      process.kill(process.pid, 'SIGTERM');
    });
  await setupAppContainer(swift)
    .then(() => logger.info('setupAppContainer successful'))
    .catch((e) => {
      e.message = 'setupAppContainer failed';
      logger.error(e);
      process.kill(process.pid, 'SIGTERM');
    });

  httpServer = app.listen(port, () => {
    logger.info(`Server started! docs at http://localhost:${port}/docs/api`);
    app.isReady = true;
  });
}

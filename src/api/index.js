import app from './app';
import { client } from '../services/mongo.service';
import logger from '../services/logger.service';
import agenda from '../jobs';

let httpServer;

async function cleanup() {
  app.isReady = false;
  logger.info('SIGTERM/SIGINT signal received');
  if (httpServer) {
    await httpServer.close();
  }
  logger.info('HTTP server stopped');
  if (client) {
    await client.close();
  }
  logger.info('Mongo connexion closed');
  process.exit(1);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

export default async function createAPIServer(port) {
  httpServer = app.listen(port, () => {
    logger.info(`Server started! docs at http://localhost:${port}/docs/api`);
    app.isReady = true;
    agenda.start();
    agenda.every('0 2 * * *', 'backup data');
    logger.info('Agenda started up');
  });
}

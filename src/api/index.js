import app from './app';
import mongo from '../services/mongo.service';
import logger from '../services/logger.service';

const { client } = mongo;
let httpServer;

function cleanup() {
  app.isReady = false;
  logger.info('SIGTERM/SIGINT signal received');
  if (httpServer) httpServer.close();
  logger.info('HTTP server stopped');
  if (client) client.close();
  logger.info('Mongo connexion closed');
  process.exit(1);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

export default async function createAPIServer(port) {
  httpServer = app.listen(port, () => {
    logger.info(`Server started! docs at http://localhost:${port}/docs/api`);
    app.isReady = true;
  });
}

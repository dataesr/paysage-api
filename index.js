import 'dotenv/config';
import app from './src/app';
import logger from './src/modules/commons/services/logger.service';
import setupDatabase from './src/config/database.config';

const PORT = process.env.PORT || 3000;

async function createServer() {
  await setupDatabase();
  app.listen(PORT, () => logger.info(`Server started! docs at http://localhost:${PORT}/docs/api`));
}

createServer();

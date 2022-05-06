import 'dotenv/config';
import storage from 'swift/storage';
import swift from '../services/storage.service';
import logger from '../services/logger.service';
import config from '../config';

const { container } = config.objectStorage;

async function setupAppContainer() {
  await storage.createContainer(swift, container);
  logger.info('objectStorage setup container successful');
  process.exit(0);
}

setupAppContainer().catch((e) => {
  e.message = 'objectStorage setup container failed';
  logger.error(e);
  process.exit(1);
});

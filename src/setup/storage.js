import 'dotenv/config';
import storage from 'swift/storage';

import config from '../config';
import logger from '../services/logger.service';
import swift from '../services/storage.service';

const { container } = config.objectStorage;

async function setupAppContainer() {
  await storage.createContainer(swift, container);
  logger.info('ObjectStorage setup container successful');
  process.exit(0);
}

setupAppContainer().catch((e) => {
  logger.error({ ...e, message: 'ObjectStorage setup container failed' });
  process.exit(1);
});

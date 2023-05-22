import 'dotenv/config';

import { client } from '../services/storage.service';
import config from '../config';
import logger from '../services/logger.service';

const { container: containerName } = config.objectStorage;

client.createContainer({ name: containerName }, (err, container) => {
  if (err) {
    logger.error('ObjectStorage setup container failed');
    logger.error(err);
    process.exit(1);
  }
  logger.info(`ObjectStorage ${container.name} container setup successful`);
  process.exit(0);
});

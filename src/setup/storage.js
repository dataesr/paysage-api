import 'dotenv/config';
import { client } from '../services/storage.service';
import config from '../config';
import logger from '../services/logger.service';

const { container: containerName } = config.objectStorage;

client.createContainer({ name: containerName }, (err, container) => {
  if (err) {
    logger.error({ ...err, message: 'ObjectStorage setup container failed' });
    process.exit(1);
  }
  logger.info(`ObjectStorage ${container.name} container setup successful`);
  process.exit(0);
});

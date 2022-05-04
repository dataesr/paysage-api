import 'dotenv/config';

import logger from './src/services/logger.service';

const { ENTRYPOINT: entrypoint, PORT: port } = process.env;

logger.info(`"Starting with entrypoint ${entrypoint}`);

switch (entrypoint) {
  case 'api':
    import('./src/api')
      .then(({ default: createAPIServer }) => createAPIServer(port || 3000));
    break;
  case 'indexers':
    import('./src/api')
      .then(({ default: createIndexers }) => createIndexers());
    break;
  default:
    logger.info("'entrypoint' must be one of ['api', 'indexer']");
    process.exit(1);
}

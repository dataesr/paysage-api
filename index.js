import 'dotenv/config';

import logger from './src/services/logger.service';

const { ENTRYPOINT, PORT } = process.env;

logger.info(`Starting with entrypoint ${ENTRYPOINT}`);

switch (ENTRYPOINT) {
  case 'api':
    import('./src/api')
      .then(({ default: createAPIServer }) => createAPIServer(PORT || 3000));
    break;
  case 'indexers':
    import('./src/api')
      .then(({ default: createIndexers }) => createIndexers());
    break;
  default:
    logger.info("'entrypoint' must be one of ['api', 'indexer']");
    process.exit(1);
}

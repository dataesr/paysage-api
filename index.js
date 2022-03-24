import 'dotenv/config';
import logger from './src/services/logger.service';
import createAPIServer from './src/api';
import createIndexers from './src/indexers';

const { ENTRYPOINT: entrypoint } = process.env;

logger.info(`"Starting with entrypoint ${entrypoint}`);

switch (entrypoint) {
  case 'api':
    createAPIServer(process.env.PORT || 3000);
    break;
  case 'indexers':
    createIndexers();
    break;
  default:
    logger.info("'entrypoint' must be one of ['api', 'indexer']");
    process.exit(1);
}

import agenda from './agenda';
import logger from '../services/logger.service';

agenda
  .on('ready', async () => { logger.info('agenda connected to mongodb'); })
  .on('error', () => { logger.info('agenda connexion to mongodb failed'); });

async function graceful() {
  logger.info('Gracefully stopping agenda');
  await agenda.stop();
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

agenda.start();

// test a job run;
// agenda.now('process press articles');

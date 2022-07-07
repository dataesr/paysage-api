import os from 'os';
import agenda from './agenda';
import logger from '../services/logger.service';

agenda.name(`worker-${os.hostname}-${process.pid}`);
agenda
  .on('ready', async () => {
    logger.info('Agenda connected to mongodb');
    await agenda.start();
    await agenda.now('process all press articles');
  })
  .on('error', () => { logger.info('Agenda connexion to mongodb failed'); });

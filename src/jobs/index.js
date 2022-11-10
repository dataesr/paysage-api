import os from 'os';
import { Agenda } from 'agenda';
import logger from '../services/logger.service';
import backupData from './data';
import {
  sendAuthenticationEmail,
  sendWelcomeEmail,
  sendPasswordRecoveryEmail,
  sendAccountConfirmedEmail,
} from './emails';

import { db } from '../services/mongo.service';

const agenda = new Agenda()
  .mongo(db, '_jobs')
  .name(`worker-${os.hostname}-${process.pid}`)
  .processEvery('30 seconds');

agenda.define('send welcome email', { shouldSaveResult: true }, sendWelcomeEmail);
agenda.define('send confirmed email', { shouldSaveResult: true }, sendAccountConfirmedEmail);
agenda.define('send signin email', { shouldSaveResult: true }, sendAuthenticationEmail);
agenda.define('send recovery email', { shouldSaveResult: true }, sendPasswordRecoveryEmail);
agenda.define('backup data', { shouldSaveResult: true }, backupData);

agenda
  .on('ready', () => { logger.info('Agenda connected to mongodb'); })
  .on('error', () => { logger.info('Agenda connexion to mongodb failed'); });

async function graceful() {
  logger.info('Gracefully stopping agenda');
  await agenda.stop();
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

export default agenda;

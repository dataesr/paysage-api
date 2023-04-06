import { Agenda } from 'agenda';
import os from 'os';

import logger from '../services/logger.service';
import backupData from './data';
import {
  sendAccountConfirmedEmail,
  sendAuthenticationEmail,
  sendContactEmail,
  sendPasswordRecoveryEmail,
  sendWelcomeEmail,
} from './emails';

import reindex from './search';

import { db } from '../services/mongo.service';

const agenda = new Agenda()
  .mongo(db, '_jobs')
  .name(`worker-${os.hostname}-${process.pid}`)
  .processEvery('30 seconds');

agenda.define('send welcome email', { shouldSaveResult: true }, sendWelcomeEmail);
agenda.define('send confirmed email', { shouldSaveResult: true }, sendAccountConfirmedEmail);
agenda.define('send signin email', { shouldSaveResult: true }, sendAuthenticationEmail);
agenda.define('send recovery email', { shouldSaveResult: true }, sendPasswordRecoveryEmail);
agenda.define('send contact email', { shouldSaveResult: true }, sendContactEmail);
agenda.define('backup data', { shouldSaveResult: true }, backupData);
agenda.define('reindex', { shouldSaveResult: true }, reindex);

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

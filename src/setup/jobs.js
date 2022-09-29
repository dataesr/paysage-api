import logger from '../services/logger.service';
import agenda from '../jobs/agenda';
import backupData from '../jobs/data';
import {
  sendAuthenticationEmail,
  sendWelcomeEmail,
  sendPasswordRecoveryEmail,
} from '../jobs/emails';

agenda.define('send welcome email', { shouldSaveResult: true }, sendWelcomeEmail);
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

agenda.start();
agenda.every('1 day', 'backup data');

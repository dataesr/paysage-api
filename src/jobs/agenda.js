import os from 'os';
import { Agenda } from 'agenda';
import { db } from '../services/mongo.service';

import {
  sendAuthenticationEmail,
  sendWelcomeEmail,
  sendPasswordRecoveryEmail,
} from './emails';

const agenda = new Agenda()
  .mongo(db, '_jobs')
  .name(`worker-${os.hostname}-${process.pid}`)
  .processEvery('30 seconds');

agenda.define('send welcome email', { shouldSaveResult: true }, sendWelcomeEmail);
agenda.define('send signin email', { shouldSaveResult: true }, sendAuthenticationEmail);
agenda.define('send recovery email', { shouldSaveResult: true }, sendPasswordRecoveryEmail);
agenda.start();
export default agenda;

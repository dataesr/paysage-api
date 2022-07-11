import os from 'os';
import { Agenda } from 'agenda';
import { db } from '../services/mongo.service';

import { processPressAlerts } from './press';

const agenda = new Agenda()
  .mongo(db, '_jobs')
  .name(`worker-${os.hostname}-${process.pid}`)
  .processEvery('30 seconds');

agenda.define('process press articles', { shouldSaveResult: true }, processPressAlerts);

export default agenda;

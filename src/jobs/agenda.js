import { Agenda } from 'agenda';
import os from 'os';

import { db } from '../services/mongo.service';

const agenda = new Agenda()
  .mongo(db, '_jobs')
  .name(`worker-${os.hostname}-${process.pid}`)
  .processEvery('30 seconds');

export default agenda;

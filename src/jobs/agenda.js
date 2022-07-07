import { Agenda } from 'agenda';
import { db } from '../services/mongo.service';

import { processAllAlerts, processNewAlerts } from './press';

const agenda = new Agenda()
  .mongo(db, '_jobs')
  .processEvery('30 seconds');

agenda.define('process all press articles', { shouldSaveResult: true }, processAllAlerts);

agenda.define('process new press articles', { shouldSaveResult: true }, processNewAlerts);

export default agenda;

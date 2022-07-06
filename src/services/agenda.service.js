import { Agenda } from 'agenda';
import { db } from './mongo.service';
import logger from './logger.service';

const agenda = new Agenda().mongo({ db, collection: '_jobs' });

agenda.on('ready', () => { logger.info('Agenda connected to mongodb'); });

export default agenda;

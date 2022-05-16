import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './officialdocuments.config';

const { collection } = config;
const officialDocumentsRepository = new BaseMongoRepository({ db, collection });

export default officialDocumentsRepository;

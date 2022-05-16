import mongo from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './officialdocuments.config';

const { db } = mongo;
const { collection } = config;
const officialDocumentsRepository = new BaseMongoRepository({ db, collection });

export default officialDocumentsRepository;

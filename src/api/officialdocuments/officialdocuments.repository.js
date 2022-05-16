import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './officialdocuments.config';

const { collectionName } = config;
const officialDocumentsRepository = new BaseMongoRepository({ db, collection: collectionName });

export default officialDocumentsRepository;

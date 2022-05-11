import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './documents.config';

const documentsRepository = new BaseMongoRepository({ db, collection: config.collectionName });

export default documentsRepository;

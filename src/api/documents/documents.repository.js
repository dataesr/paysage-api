import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './documents.config';

const { collectionName } = config;
const documentsRepository = new BaseMongoRepository({ db, collection: collectionName });

export default documentsRepository;

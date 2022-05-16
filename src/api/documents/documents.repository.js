import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './documents.config';

const { collection } = config;
const documentsRepository = new BaseMongoRepository({ db, collection });

export default documentsRepository;
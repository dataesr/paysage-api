import mongo from '../../services/mongo.service';
import BaseMongoRepository from '../commons/repositories/base.mongo.repository';
import config from './officialdocuments.config';

const { db } = mongo;
const { collection } = config;
const officialDocumentsRepository = new BaseMongoRepository({ db, collection });

export default officialDocumentsRepository;

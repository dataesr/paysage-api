import { db } from '../../services/mongo.service';
import BaseMongoRepository from '../commons/repositories/base.mongo.repository';
import config from './officialdocuments.config';

const { collection } = config;
const officialDocumentsRepository = new BaseMongoRepository({ db, collection });

export default officialDocumentsRepository;

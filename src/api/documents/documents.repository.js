import { db } from '../../services/mongo.service';
import BaseMongoRepository from '../commons/repositories/base.mongo.repository';
import config from './documents.config';

const { collection } = config;
const documentsRepository = new BaseMongoRepository({ db, collection });

export default documentsRepository;

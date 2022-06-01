import { db } from '../../services/mongo.service';
import BaseMongoRepository from '../commons/repositories/base.mongo.repository';
import config from './terms.config';

const { collection } = config;
const termsRepository = new BaseMongoRepository({ db, collection });

export default termsRepository;

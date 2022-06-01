import { db } from '../../services/mongo.service';
import BaseMongoRepository from '../commons/repositories/base.mongo.repository';
import config from './prices.config';

const { collection } = config;
const pricesRepository = new BaseMongoRepository({ db, collection });

export default pricesRepository;

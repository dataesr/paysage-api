import mongo from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './terms.config';

const { db } = mongo;
const { collection } = config;
const termsRepository = new BaseMongoRepository({ db, collection });

export default termsRepository;

import mongo from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './identifiers.config';

const { db } = mongo;
const { collection } = config;
const identifiersRepository = new BaseMongoRepository({ db, collection });

export default identifiersRepository;

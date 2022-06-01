import mongo from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './officialtexts.config';

const { db } = mongo;
const { collection } = config;
const officialTextsRepository = new BaseMongoRepository({ db, collection });

export default officialTextsRepository;

import mongo from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { db } = mongo;
const { collection } = config;
const structuresRepository = new BaseMongoRepository({ db, collection });

export default structuresRepository;

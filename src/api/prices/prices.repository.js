import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './prices.config';

const { collectionName } = config;
const pricesRepository = new BaseMongoRepository({ db, collection: collectionName });

export default pricesRepository;

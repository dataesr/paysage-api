import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './prices.config';

const pricesRepository = new BaseMongoRepository({ db, collection: config.collectionName });

export default pricesRepository;

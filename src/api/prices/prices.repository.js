import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import { PRICES_COLLECTION } from './prices.config';

const pricesRepository = new BaseMongoRepository({ db, collection: PRICES_COLLECTION });

export default pricesRepository;

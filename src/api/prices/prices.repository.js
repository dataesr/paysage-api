import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';

const pricesRepository = new BaseMongoRepository(
  { db, collection: 'prices' },
);

export default pricesRepository;

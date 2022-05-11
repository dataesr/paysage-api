import db from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';
import config from '../categories.config';

const categoriesRepository = new BaseMongoRepository({ db, collection: config.collectionName });

export default categoriesRepository;

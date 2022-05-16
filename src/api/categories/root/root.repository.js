import db from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';
import config from '../categories.config';

const { collectionName } = config;
const categoriesRepository = new BaseMongoRepository({ db, collection: collectionName });

export default categoriesRepository;

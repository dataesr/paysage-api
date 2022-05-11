import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './legalcategories.config';

const legalCategoriesRepository = new BaseMongoRepository({ db, collection: config.collectionName });

export default legalCategoriesRepository;

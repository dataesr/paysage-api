import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './legalcategories.config';

const { collectionName } = config;
const legalCategoriesRepository = new BaseMongoRepository({ db, collection: collectionName });

export default legalCategoriesRepository;

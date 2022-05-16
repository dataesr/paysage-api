import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './legalcategories.config';

const { collection } = config;
const legalCategoriesRepository = new BaseMongoRepository({ db, collection });

export default legalCategoriesRepository;

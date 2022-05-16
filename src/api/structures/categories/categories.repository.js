import mongo from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { db } = mongo;
const { categoriesField: field, collection } = config;
const structureCategoriesRepository = new NestedMongoRepository({ db, collection, field });

export default structureCategoriesRepository;

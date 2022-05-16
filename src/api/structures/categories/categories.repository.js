import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { categoriesField: field, collection } = config;
const structureCategoriesRepository = new NestedMongoRepository({ db, collection, field });

export default structureCategoriesRepository;

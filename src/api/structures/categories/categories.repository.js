import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collectionName, categoriesField } = config;
const structureCategoriesRepository = new NestedMongoRepository({ db, collection: collectionName, field: categoriesField });

export default structureCategoriesRepository;

import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const structureCategoriesRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.categoriesField });

export default structureCategoriesRepository;

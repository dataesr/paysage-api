import { db } from '../../services/mongo.service';
import BaseMongoRepository from '../commons/repositories/base.mongo.repository';
import config from './legalcategories.config';

const { collection } = config;
const legalCategoriesRepository = new BaseMongoRepository({ db, collection });

export default legalCategoriesRepository;

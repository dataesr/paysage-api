import mongo from '../../../services/mongo.service';
import BaseMongoRepository from '../../commons/repositories/base.mongo.repository';
import config from '../categories.config';

const { db } = mongo;
const { collection } = config;
const categoriesRepository = new BaseMongoRepository({ db, collection });

export default categoriesRepository;

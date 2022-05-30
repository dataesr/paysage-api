import mongo from '../../../services/mongo.service';
import BaseMongoRepository from '../../commons/repositories/base.mongo.repository';
import config from '../persons.config';

const { db } = mongo;
const { collection } = config;
const personsRepository = new BaseMongoRepository({ db, collection });

export default personsRepository;

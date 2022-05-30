import mongo from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';
import config from '../categories.config';

const { db } = mongo;
const { collection, identifiersField: field } = config;
const categoryIdentifiersRepository = new NestedMongoRepository({ db, collection, field });

export default categoryIdentifiersRepository;
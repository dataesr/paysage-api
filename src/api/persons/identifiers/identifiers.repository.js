import mongo from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';
import config from '../persons.config';

const { db } = mongo;
const { collection, identifiersField: field } = config;
const personIdentifiersRepository = new NestedMongoRepository({ db, collection, field });

export default personIdentifiersRepository;

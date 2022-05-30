import mongo from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';
import config from '../structures.config';

const { db } = mongo;
const { collection, identifiersField: field } = config;
const structureIdentifiersRepository = new NestedMongoRepository({ db, collection, field });

export default structureIdentifiersRepository;

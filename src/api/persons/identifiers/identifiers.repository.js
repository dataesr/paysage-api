import mongo from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const { db } = mongo;
const { collection, identifiersField: field } = config;
const personIdentifiersRepository = new NestedMongoRepository({ db, collection, field });

export default personIdentifiersRepository;

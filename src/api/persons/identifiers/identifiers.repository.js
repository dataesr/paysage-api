import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const { collection, identifiersField: field } = config;
const personIdentifiersRepository = new NestedMongoRepository({ db, collection, field });

export default personIdentifiersRepository;

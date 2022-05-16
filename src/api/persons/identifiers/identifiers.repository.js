import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const { collectionName, identifiersField } = config;
const personIdentifiersRepository = new NestedMongoRepository({ db, collection: collectionName, field: identifiersField });

export default personIdentifiersRepository;

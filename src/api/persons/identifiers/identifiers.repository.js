import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const personIdentifiersRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.identifiersField });

export default personIdentifiersRepository;

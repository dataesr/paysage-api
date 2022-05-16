import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../categories.config';

const { collectionName, identifiersField } = config;
const categoryIdentifiersRepository = new NestedMongoRepository({ db, collection: collectionName, field: identifiersField });

export default categoryIdentifiersRepository;

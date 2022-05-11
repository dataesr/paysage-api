import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../categories.config';

const categoryIdentifiersRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.identifiersField });

export default categoryIdentifiersRepository;

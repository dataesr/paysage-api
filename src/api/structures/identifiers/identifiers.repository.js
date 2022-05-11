import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const structureIdentifiersRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.identifiersField });

export default structureIdentifiersRepository;

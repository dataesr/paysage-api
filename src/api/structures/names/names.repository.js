import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const structureNamesRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.namesField });

export default structureNamesRepository;

import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collectionName, namesField } = config;
const structureNamesRepository = new NestedMongoRepository({ db, collection: collectionName, field: namesField });

export default structureNamesRepository;

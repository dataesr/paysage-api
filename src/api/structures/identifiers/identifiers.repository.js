import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collectionName, identifiersField } = config;
const structureIdentifiersRepository = new NestedMongoRepository({ db, collection: collectionName, field: identifiersField });

export default structureIdentifiersRepository;

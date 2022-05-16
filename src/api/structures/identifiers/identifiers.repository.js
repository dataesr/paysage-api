import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collection, identifiersField: field } = config;
const structureIdentifiersRepository = new NestedMongoRepository({ db, collection, field });

export default structureIdentifiersRepository;

import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collection, namesField: field } = config;
const structureNamesRepository = new NestedMongoRepository({ db, collection, field });

export default structureNamesRepository;

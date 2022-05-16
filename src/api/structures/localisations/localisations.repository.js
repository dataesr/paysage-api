import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collection, localisationsField: field } = config;
const structureLocalisationsRepository = new NestedMongoRepository({ db, collection, field });

export default structureLocalisationsRepository;

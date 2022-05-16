import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collection, weblinksField: field } = config;
const structureWeblinksRepository = new NestedMongoRepository({ db, collection, field });

export default structureWeblinksRepository;
